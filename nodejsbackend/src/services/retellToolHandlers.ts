import { listApprovedDoctors } from './doctors';
import { listAvailableSlots } from './slots';
import {
  bookAppointment,
  cancelAppointment,
  listPatientAppointments,
} from './appointments';
import { parseDateInput } from '../utils/dates';

type RetellToolPayload = {
  name?: string;
  args?: Record<string, unknown>;
  call?: {
    metadata?: Record<string, unknown>;
    retell_llm_dynamic_variables?: Record<string, string>;
  };
};

function patientIdFromCall(payload: RetellToolPayload): string {
  const meta = payload.call?.metadata ?? {};
  const fromMeta = String(meta.patient_id ?? meta.patientId ?? '').trim();
  if (fromMeta) return fromMeta;

  const fromVars = payload.call?.retell_llm_dynamic_variables?.patient_id?.trim();
  return fromVars ?? '';
}

function formatDoctors(doctors: Awaited<ReturnType<typeof listApprovedDoctors>>) {
  if (!doctors.length) {
    return 'No approved doctors are available right now.';
  }
  const lines = doctors.map((d) => `${d.index}. ${d.label} at ${d.hospital || 'hospital'}`);
  return `Available doctors:\n${lines.join('\n')}`;
}

function formatSlots(result: Awaited<ReturnType<typeof listAvailableSlots>>) {
  if (!result.slots.length) {
    return `No open slots on ${result.date}. Please try another date.`;
  }
  const lines = result.slots.map((s) => `${s.index}. ${s.label}`);
  return `Available slots on ${result.date}:\n${lines.join('\n')}`;
}

function formatAppointments(rows: Awaited<ReturnType<typeof listPatientAppointments>>) {
  if (!rows.length) {
    return 'You have no appointments yet.';
  }
  const lines = rows.map(
    (a) => `• ${a.doctor} on ${a.date} at ${a.time} (${a.status})`,
  );
  return `Your appointments:\n${lines.join('\n')}`;
}

export async function handleRetellTool(payload: RetellToolPayload): Promise<string> {
  const name = (payload.name ?? '').trim();
  const args = payload.args ?? {};
  const patientId = patientIdFromCall(payload);

  switch (name) {
    case 'list_doctors': {
      const doctors = await listApprovedDoctors(String(args.specialization ?? ''));
      return formatDoctors(doctors);
    }

    case 'list_slots': {
      const doctorId = String(args.doctor_id ?? args.doctorId ?? '').trim();
      const date = String(args.date ?? args.appointment_date ?? 'tomorrow');
      if (!doctorId) return 'Doctor id is required to list slots.';
      const result = await listAvailableSlots(doctorId, date);
      return formatSlots(result);
    }

    case 'book_appointment': {
      if (!patientId) {
        return 'Patient id is missing from call metadata. Cannot book.';
      }
      const doctorId = String(args.doctor_id ?? args.doctorId ?? '').trim();
      const slotId = String(args.slot_id ?? args.slotId ?? '').trim();
      let appointmentDate = String(args.appointment_date ?? args.date ?? '').trim();
      let appointmentTime = String(args.appointment_time ?? args.time ?? '').trim();

      if (!doctorId || !slotId) {
        return 'doctor_id and slot_id are required to book.';
      }

      if (!appointmentDate) {
        appointmentDate = parseDateInput('tomorrow') ?? '';
      }
      if (appointmentTime && appointmentTime.split(':').length === 2) {
        appointmentTime = `${appointmentTime}:00`;
      }

      const booked = await bookAppointment({
        patient_id: patientId,
        doctor_id: doctorId,
        slot_id: slotId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime || '09:00:00',
      });

      return `Appointment booked successfully for ${booked.appointment_date} at ${String(booked.appointment_time).slice(0, 5)}. Check My Visits in the app.`;
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
