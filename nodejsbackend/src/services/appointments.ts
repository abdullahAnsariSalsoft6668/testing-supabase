import { getSupabase } from './supabase.js';
import { displayName } from '../utils/displayName.js';

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

export async function bookAppointment(params: {
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...params,
      status: 'PENDING',
      notes: params.notes ?? 'Booked via Retell voice agent',
    })
    .select('*')
    .single();

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
