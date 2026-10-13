import { getSupabase } from './supabase.js';
import { displayName } from '../utils/displayName.js';
import { formatErrorMessage } from '../utils/errors.js';
import { sendBookingConfirmationSms } from './sms.js';

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED'] as const;

export async function listPatientAppointments(patientId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctors(*, users(*))')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false })
    .limit(8);

  if (error) throw error;

  return (data ?? []).map((a) => ({
    id: a.id,
    doctor: displayName(a.doctors?.users, 'Doctor'),
    date: a.appointment_date,
    time: String(a.appointment_time ?? '').slice(0, 5),
    status: a.status,
  }));
}

/** Slot ids that already have a non-cancelled appointment. */
export async function listBookedSlotIds(slotIds: string[]): Promise<Set<string>> {
  if (!slotIds.length) return new Set();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select('slot_id')
    .in('slot_id', slotIds)
    .in('status', [...ACTIVE_STATUSES]);

  if (error) throw error;
  return new Set((data ?? []).map((row) => String(row.slot_id)).filter(Boolean));
}

export async function findActiveAppointmentForSlot(slotId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('slot_id', slotId)
    .in('status', [...ACTIVE_STATUSES])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function bookAppointment(params: {
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}) {
  const existing = await findActiveAppointmentForSlot(params.slot_id);
  if (existing) {
    if (existing.patient_id === params.patient_id) {
      return existing;
    }
    throw new Error('That time slot is already booked. Please choose another time from list_slots.');
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...params,
      status: 'PENDING',
      notes: params.notes ?? 'Booked via Retell voice agent',
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[appointments] book failed:', formatErrorMessage(error), error);
    throw error;
  }
  if (!data) {
    throw new Error('Booking insert did not return a row. Check Supabase appointments table permissions.');
  }

  console.log('[appointments] book ok, triggering booking SMS', { appointmentId: data.id });
  // Fire-and-forget — never block or fail the book on SMS errors
  void sendBookingConfirmationSms(String(data.id)).catch((err) => {
    console.error('[appointments] booking SMS failed:', formatErrorMessage(err));
  });

  return data;
}

export type RescheduleResult = {
  ok: boolean;
  unchanged?: boolean;
  appointment_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
};

export async function rescheduleAppointment(
  appointmentId: string,
  slotId: string,
  patientId: string,
): Promise<RescheduleResult> {
  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('reschedule_appointment', {
    p_appointment_id: appointmentId,
    p_slot_id: slotId,
    p_patient_id: patientId,
  });

  if (error) {
    console.error('[appointments] reschedule failed:', formatErrorMessage(error), error);
    throw error;
  }

  const row = (data ?? {}) as RescheduleResult;
  if (!row.ok && !row.appointment_id) {
    throw new Error('Reschedule did not return a visit.');
  }

  if (!row.unchanged) {
    void sendBookingConfirmationSms(String(row.appointment_id)).catch((err) => {
      console.error('[appointments] reschedule SMS failed:', formatErrorMessage(err));
    });
  }

  return row;
}

export async function getPatientAppointment(appointmentId: string, patientId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select('id, patient_id, doctor_id, slot_id, appointment_date, appointment_time, status')
    .eq('id', appointmentId)
    .eq('patient_id', patientId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function cancelAppointment(appointmentId: string, patientId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'CANCELLED' })
    .eq('id', appointmentId)
    .eq('patient_id', patientId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
