import { listApprovedDoctors } from './doctors';
import {
  ensureUpcomingDemoSlots,
  listAvailableSlots,
  listUpcomingAvailableSlots,
  type SlotOption,
} from './slots';
import {
  bookAppointment,
  cancelAppointment,
  listPatientAppointments,
} from './appointments';
import { formatVoiceDate, isOpenDateQuery, parseDateInput } from '../utils/dates';

export type RetellToolPayload = {
  name?: string;
  args?: Record<string, unknown>;
  call?: {
    metadata?: Record<string, unknown>;
    retell_llm_dynamic_variables?: Record<string, string>;
  };
};

type DoctorRow = Awaited<ReturnType<typeof listApprovedDoctors>>[number];

function patientIdFromCall(payload: RetellToolPayload, args: Record<string, unknown>): string {
  const fromArgs = String(args.patient_id ?? args.patientId ?? '').trim();
  if (fromArgs) return fromArgs;

  const meta = payload.call?.metadata ?? {};
  const fromMeta = String(meta.patient_id ?? meta.patientId ?? '').trim();
  if (fromMeta) return fromMeta;

  const fromVars = payload.call?.retell_llm_dynamic_variables?.patient_id?.trim();
  return fromVars ?? '';
}

function formatDoctors(doctors: DoctorRow[]) {
  if (!doctors.length) {
    return (
      'No approved doctors are available in the hospital system right now. ' +
      'An admin must approve at least one doctor (status APPROVED) before booking is possible.'
    );
  }
  const lines = doctors.map(
    (d) =>
      `${d.index}. ${d.label} at ${d.hospital || 'hospital'} | doctor_id=${d.id}`,
  );
  return (
    `Available doctors (use doctor_id when calling list_slots / book_appointment):\n` +
    `${lines.join('\n')}`
  );
}

/** Group slots by day for voice: "Available days: tomorrow… Times: 9:00, 10:00" */
function formatDaysAndSlots(
  doctor: DoctorRow,
  slots: SlotOption[],
  intro?: string,
): string {
  if (!slots.length) {
    return `No open days or slots for ${doctor.name} in the next few weeks.`;
  }

  const byDate = new Map<string, SlotOption[]>();
  for (const s of slots) {
    const date = s.appointment_date ?? '';
    if (!date) continue;
    const list = byDate.get(date) ?? [];
    list.push(s);
    byDate.set(date, list);
  }

  const dates = [...byDate.keys()].sort();
  const daySummary = dates.map((d) => formatVoiceDate(d)).join('; ');

  let n = 0;
  const dayBlocks = dates.map((date) => {
    const daySlots = byDate.get(date)!;
    const times = daySlots
      .map((s) => {
        n += 1;
        s.index = n;
        return `${String(s.start_time).slice(0, 5)} (slot #${n}, slot_id=${s.id})`;
      })
      .join(', ');
    return `${formatVoiceDate(date)}: ${times}`;
  });

  return (
    `${intro ?? `Availability for ${doctor.name}`} (doctor_id=${doctor.id}).\n` +
    `Open days: ${daySummary}.\n` +
    `${dayBlocks.join('\n')}\n` +
    `Tell the patient the days and times in plain speech. Use slot_id when booking.`
  );
}

function formatAppointments(rows: Awaited<ReturnType<typeof listPatientAppointments>>) {
  if (!rows.length) {
    return 'You have no appointments yet.';
  }
  const lines = rows.map(
    (a) => `• ${a.doctor} on ${a.date} at ${a.time} (${a.status}) | appointment_id=${a.id}`,
  );
  return `Your appointments:\n${lines.join('\n')}`;
}

function resolveDoctor(doctors: DoctorRow[], ref: string): DoctorRow | null {
  const q = ref.trim();
  if (!q) return null;

  const byId = doctors.find((d) => d.id === q);
  if (byId) return byId;

  if (/^\d+$/.test(q)) {
    const idx = Number(q);
    return doctors.find((d) => d.index === idx) ?? null;
  }

  const lower = q.toLowerCase();
  const matches = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(lower) ||
      d.label.toLowerCase().includes(lower) ||
      d.specialization.toLowerCase().includes(lower),
  );
  return matches[0] ?? null;
}

function resolveSlot(slots: SlotOption[], ref: string): SlotOption | null {
  const q = ref.trim();
  if (!q) return null;

  const byId = slots.find((s) => s.id === q);
  if (byId) return byId;

  if (/^\d+$/.test(q)) {
    const idx = Number(q);
    return slots.find((s) => s.index === idx) ?? null;
  }

  const lower = q.toLowerCase().replace(/\s+/g, '');
  return (
    slots.find((s) => {
      const label = s.label.toLowerCase().replace(/\s+/g, '');
      const start = String(s.start_time).slice(0, 5);
      return label.includes(lower) || start === q || s.label.toLowerCase().includes(q.toLowerCase());
    }) ?? null
  );
}

async function loadDoctorUpcoming(doctor: DoctorRow): Promise<SlotOption[]> {
  let upcoming = await listUpcomingAvailableSlots(doctor.id, 21);
  if (upcoming.slots.length === 0) {
    upcoming = await ensureUpcomingDemoSlots(doctor.id);
  }
  return upcoming.slots;
}

async function availabilityForDoctor(doctor: DoctorRow, dateInput: string) {
  // "which days / any / available" → full calendar
  if (isOpenDateQuery(dateInput)) {
    const slots = await loadDoctorUpcoming(doctor);
    return formatDaysAndSlots(doctor, slots);
  }

  const date = parseDateInput(dateInput);
  if (!date) {
    const slots = await loadDoctorUpcoming(doctor);
    return formatDaysAndSlots(doctor, slots);
  }

  const result = await listAvailableSlots(doctor.id, date);
  if (result.slots.length > 0) {
    const slots = result.slots.map((s) => ({ ...s, appointment_date: result.date }));
    return formatDaysAndSlots(
      doctor,
      slots,
      `${doctor.name} has open slots on ${formatVoiceDate(result.date)}`,
    );
  }

  const upcoming = await loadDoctorUpcoming(doctor);
  if (upcoming.length === 0) {
    return (
      `No open slots for ${doctor.name} on ${formatVoiceDate(date)}, ` +
      `and none in the next few weeks.`
    );
  }

  return formatDaysAndSlots(
    doctor,
    upcoming,
    `Nothing on ${formatVoiceDate(date)} for ${doctor.name}. Here are their open days instead`,
  );
}

/** All doctors — days + sample times (for "konse days/slots available?") */
async function availabilityForAllDoctors(doctors: DoctorRow[]) {
  if (!doctors.length) {
    return 'No approved doctors right now.';
  }

  const blocks: string[] = [];
  for (const doctor of doctors.slice(0, 5)) {
    const slots = await loadDoctorUpcoming(doctor);
    if (!slots.length) {
      blocks.push(`${doctor.name}: no open days soon.`);
      continue;
    }

    const byDate = new Map<string, string[]>();
    for (const s of slots) {
      const date = s.appointment_date ?? '';
      if (!date) continue;
      const times = byDate.get(date) ?? [];
      times.push(String(s.start_time).slice(0, 5));
      byDate.set(date, times);
    }

    const dayLines = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 5)
      .map(([date, times]) => `${formatVoiceDate(date)} at ${times.join(', ')}`);

    blocks.push(
      `${doctor.name} (doctor_id=${doctor.id}): open on ${dayLines.join('; ')}.`,
    );
  }

  return (
    `Here are available days and slots:\n${blocks.join('\n')}\n` +
    `Speak the doctor names, days, and times to the patient. ` +
    `Then call list_slots with a doctor_id to get slot_id values before booking.`
  );
}

export async function handleRetellTool(payload: RetellToolPayload): Promise<string> {
  const name = (payload.name ?? '').trim();
  const args = payload.args ?? {};
  const patientId = patientIdFromCall(payload, args);

  switch (name) {
    case 'list_doctors': {
      const doctors = await listApprovedDoctors(String(args.specialization ?? ''));
      return formatDoctors(doctors);
    }

    case 'list_slots': {
      const doctors = await listApprovedDoctors();
      const doctorRef = String(
        args.doctor_id ?? args.doctorId ?? args.doctor ?? args.doctor_name ?? '',
      ).trim();
      const dateRaw = String(args.date ?? args.appointment_date ?? args.when ?? '').trim();

      // No doctor → full system availability (days + slots)
      if (!doctorRef) {
        return availabilityForAllDoctors(doctors);
      }

      const doctor = resolveDoctor(doctors, doctorRef);
      if (!doctor) {
        return `Could not find doctor "${doctorRef}". Call list_doctors first.`;
      }

      return availabilityForDoctor(doctor, dateRaw || 'available');
    }

    case 'book_appointment': {
      if (!patientId) {
        return (
          'Patient id is missing from the call. In Retell, keep "Payload: args only" OFF for book_appointment, ' +
          'or add patient_id as a parameter with const {{patient_id}}.'
        );
      }

      const doctors = await listApprovedDoctors();
      const doctorRef = String(
        args.doctor_id ?? args.doctorId ?? args.doctor ?? args.doctor_name ?? '',
      ).trim();
      const doctor = resolveDoctor(doctors, doctorRef);
      if (!doctor) {
        return (
          'doctor_id is required. Call list_doctors or list_slots, pick a doctor, then pass that doctor_id.'
        );
      }

      let appointmentDate = String(args.appointment_date ?? args.date ?? '').trim();
      const openDate = isOpenDateQuery(appointmentDate);
      if (!appointmentDate || openDate) {
        appointmentDate = parseDateInput('tomorrow') ?? '';
      }

      let slotsPool = await loadDoctorUpcoming(doctor);
      const specificDate = openDate ? null : parseDateInput(appointmentDate);
      let slotsResult = {
        date: specificDate ?? appointmentDate,
        slots: specificDate
          ? slotsPool.filter((s) => s.appointment_date === specificDate)
          : slotsPool,
      };

      if (slotsResult.slots.length === 0) {
        slotsResult = { date: slotsPool[0]?.appointment_date ?? appointmentDate, slots: slotsPool };
      }

      if (slotsResult.slots.length === 0) {
        return `No available slots for ${doctor.name}. Cannot book.`;
      }

      // Re-index for resolveSlot number refs after formatting calendar
      slotsResult.slots = slotsResult.slots.map((s, i) => ({ ...s, index: i + 1 }));

      const slotRef = String(
        args.slot_id ?? args.slotId ?? args.slot ?? args.time ?? args.appointment_time ?? '',
      ).trim();

      const slot =
        resolveSlot(slotsResult.slots, slotRef) ??
        (!slotRef ? slotsResult.slots[0] : null);

      if (!slot) {
        return (
          `Could not match that time. ${formatDaysAndSlots(doctor, slotsResult.slots)}`
        );
      }

      const bookDate = slot.appointment_date ?? slotsResult.date;
      let appointmentTime = String(args.appointment_time ?? slot.start_time ?? '').trim();
      if (appointmentTime && appointmentTime.split(':').length === 2) {
        appointmentTime = `${appointmentTime}:00`;
      }

      const booked = await bookAppointment({
        patient_id: patientId,
        doctor_id: doctor.id,
        slot_id: slot.id,
        appointment_date: bookDate,
        appointment_time: appointmentTime || '09:00:00',
      });

      return (
        `Appointment booked with ${doctor.name} for ${formatVoiceDate(String(booked.appointment_date))} ` +
        `at ${String(booked.appointment_time).slice(0, 5)}. Check My Visits in the app.`
      );
    }

    case 'my_appointments': {
      if (!patientId) return 'Patient id is missing. Cannot list appointments.';
      const rows = await listPatientAppointments(patientId);
      return formatAppointments(rows);
    }

    case 'cancel_appointment': {
      if (!patientId) return 'Patient id is missing.';
      const appointmentId = String(args.appointment_id ?? args.appointmentId ?? '').trim();
      if (!appointmentId) return 'appointment_id is required.';
      await cancelAppointment(appointmentId, patientId);
      return 'Appointment cancelled successfully.';
    }

    default:
      return `Unknown tool: ${name}`;
  }
}
