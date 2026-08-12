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
import { findAnyPatientId, findPatientIdByEmail, patientExists } from './patients';
import { config } from '../config';
import { formatErrorMessage } from '../utils/errors';
import { formatVoiceDate, isOpenDateQuery, localISODate, parseDateInput } from '../utils/dates';

export type RetellToolPayload = {
  name?: string;
  args?: Record<string, unknown>;
  call?: Record<string, unknown> & {
    metadata?: Record<string, unknown>;
    retell_llm_dynamic_variables?: Record<string, string>;
  };
};

type DoctorRow = Awaited<ReturnType<typeof listApprovedDoctors>>[number];

/** Retell sometimes sends unresolved templates like "{{patient_id}}" in tool args. */
function isUnresolvedRetellTemplate(value: string): boolean {
  return /^\{\{[^}]+\}\}$/.test(value.trim());
}

function normalizePatientId(value: unknown): string {
  const id = String(value ?? '').trim();
  if (!id || isUnresolvedRetellTemplate(id)) return '';
  return id;
}

function patientIdFromCall(payload: RetellToolPayload, args: Record<string, unknown>): string {
  const meta = payload.call?.metadata ?? {};
  const vars = payload.call?.retell_llm_dynamic_variables ?? {};

  const candidates: unknown[] = [
    args.patient_id,
    args.patientId,
    meta.patient_id,
    meta.patientId,
    vars.patient_id,
    vars.patientId,
    payload.call?.patient_id,
    payload.call?.patientId,
  ];

  for (const candidate of candidates) {
    const id = normalizePatientId(candidate);
    if (id) return id;
  }

  return '';
}

let cachedTestPatientId: string | null | undefined;

export type PatientIdSource = 'call' | 'test_id' | 'test_email' | 'none';

async function resolvePatientId(
  payload: RetellToolPayload,
  args: Record<string, unknown>,
): Promise<{ patientId: string; source: PatientIdSource }> {
  const fromCall = patientIdFromCall(payload, args);
  if (fromCall) return { patientId: fromCall, source: 'call' };

  if (config.retellTestPatientId) {
    if (await patientExists(config.retellTestPatientId)) {
      console.log('[retell/tools] using RETELL_TEST_PATIENT_ID fallback');
      return { patientId: config.retellTestPatientId, source: 'test_id' };
    }
    console.warn(
      '[retell/tools] RETELL_TEST_PATIENT_ID not found in patients table:',
      config.retellTestPatientId,
    );
  }

  if (cachedTestPatientId !== undefined) {
    return { patientId: cachedTestPatientId ?? '', source: cachedTestPatientId ? 'test_email' : 'none' };
  }

  if (config.retellTestPatientEmail) {
    try {
      cachedTestPatientId = await findPatientIdByEmail(config.retellTestPatientEmail);
      if (cachedTestPatientId) {
        console.log(
          '[retell/tools] using RETELL_TEST_PATIENT_EMAIL fallback:',
          config.retellTestPatientEmail,
        );
        return { patientId: cachedTestPatientId, source: 'test_email' };
      }
    } catch (err) {
      console.error('[retell/tools] test patient lookup failed:', err);
    }
  }

  cachedTestPatientId = null;

  const anyPatient = await findAnyPatientId();
  if (anyPatient) {
    console.warn(
      '[retell/tools] using first patient in DB as Test Audio fallback:',
      anyPatient,
    );
    cachedTestPatientId = anyPatient;
    return { patientId: anyPatient, source: 'test_email' };
  }

  return { patientId: '', source: 'none' };
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
  const { patientId, source: patientSource } = await resolvePatientId(payload, args);

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
      let dateRaw = String(args.date ?? args.appointment_date ?? args.when ?? '').trim();
      if (!dateRaw || dateRaw === 'null' || dateRaw === 'undefined') {
        dateRaw = '';
      }

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
      console.log('[retell/tools] book_appointment patientSource=', patientSource);

      if (!patientId) {
        return (
          'Booking failed: no patient is linked to this call. ' +
          'From the mobile app: log in as a patient, open Talk to AI, then book again. ' +
          'For Retell Test Audio only: set RETELL_TEST_PATIENT_ID in nodejsbackend/.env and restart the Node server.'
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
        resolveSlot(slotsPool, slotRef) ??
        (!slotRef ? slotsResult.slots[0] : null);

      if (!slot) {
        return (
          `Could not match that time. ${formatDaysAndSlots(doctor, slotsResult.slots)}`
        );
      }

      const rawBookDate = String(slot.appointment_date ?? slotsResult.date ?? appointmentDate ?? '').trim();
      const bookDate =
        parseDateInput(rawBookDate) ??
        parseDateInput('today') ??
        localISODate();

      let appointmentTime = String(args.appointment_time ?? slot.start_time ?? '').trim();
      if (appointmentTime && appointmentTime.split(':').length === 2) {
        appointmentTime = `${appointmentTime}:00`;
      }
      if (!appointmentTime) {
        appointmentTime = String(slot.start_time ?? '09:00:00');
      }

      try {
        const booked = await bookAppointment({
          patient_id: patientId,
          doctor_id: doctor.id,
          slot_id: slot.id,
          appointment_date: bookDate,
          appointment_time: appointmentTime,
        });

        const timeLabel = String(booked.appointment_time ?? appointmentTime).slice(0, 5);
        return (
          `Appointment booked with ${doctor.name} for ${formatVoiceDate(String(booked.appointment_date ?? bookDate))} ` +
          `at ${timeLabel}. Check My Visits in the app.`
        );
      } catch (err) {
        const message = formatErrorMessage(err);
        console.error('[retell/tools] book_appointment failed:', message, err);
        if (/duplicate|unique|already booked|already taken/i.test(message)) {
          return 'That slot was just taken. Please pick another time from list_slots.';
        }
        return `Could not complete booking: ${message}`;
      }
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
