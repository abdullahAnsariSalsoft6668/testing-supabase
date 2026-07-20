import { supabase } from '@/lib/supabase';
import type { Appointment, AppointmentStatus, Department, Doctor, DoctorSlot, DoctorStatus, Hospital } from '@/types/database';

export async function listHospitals() {
  const { data, error } = await supabase.from('hospitals').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Hospital[];
}

export async function createHospital(payload: Partial<Hospital>) {
  const { data, error } = await supabase.from('hospitals').insert(payload).select().single();
  if (error) throw error;
  return data as Hospital;
}

export async function updateHospital(id: string, payload: Partial<Hospital>) {
  const { data, error } = await supabase.from('hospitals').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data as Hospital;
}

export async function deleteHospital(id: string) {
  const { error } = await supabase.from('hospitals').delete().eq('id', id);
  if (error) throw error;
}

export async function listDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*, hospitals(*)')
    .order('name');
  if (error) throw error;
  return (data ?? []) as Department[];
}

export async function createDepartment(payload: { hospital_id: string; name: string; description?: string }) {
  const { data, error } = await supabase.from('departments').insert(payload).select().single();
  if (error) throw error;
  return data as Department;
}

export async function deleteDepartment(id: string) {
  const { error } = await supabase.from('departments').delete().eq('id', id);
  if (error) throw error;
}

export async function listDoctors(status?: DoctorStatus) {
  let q = supabase.from('doctors').select('*, users(*), hospitals(*), departments(*)').order('created_at', {
    ascending: false,
  });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Doctor[];
}

export async function updateDoctorStatus(id: string, status: DoctorStatus) {
  const { data, error } = await supabase.from('doctors').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Doctor;
}

export async function listApprovedDoctors() {
  return listDoctors('APPROVED');
}

export async function listSlots(doctorId: string, date?: string) {
  let q = supabase.from('doctor_slots').select('*').eq('doctor_id', doctorId).order('appointment_date').order('start_time');
  if (date) q = q.eq('appointment_date', date);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DoctorSlot[];
}

export async function createSlot(payload: {
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status?: string;
}) {
  const { data, error } = await supabase
    .from('doctor_slots')
    .insert({ ...payload, status: payload.status ?? 'AVAILABLE' })
    .select()
    .single();
  if (error) throw error;
  return data as DoctorSlot;
}

export async function deleteSlot(id: string) {
  const { error } = await supabase.from('doctor_slots').delete().eq('id', id);
  if (error) throw error;
}

export async function listAppointmentsForPatient(patientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctors(*, users(*), hospitals(*))')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function listAppointmentsForDoctor(doctorId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patients(*, users(*))')
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function listAllAppointments(limit = 40) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctors(*, users(*)), patients(*, users(*))')
    .order('appointment_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Appointment;
}

export async function bookAppointment(payload: {
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...payload, status: 'PENDING', notes: payload.notes ?? null })
    .select()
    .single();
  if (error) throw error;
  return data as Appointment;
}

export async function cancelAppointment(id: string) {
  return updateAppointmentStatus(id, 'CANCELLED');
}

export async function getDashboardCounts() {
  const [hospitals, departments, pendingDoctors, appointments] = await Promise.all([
    supabase.from('hospitals').select('id', { count: 'exact', head: true }),
    supabase.from('departments').select('id', { count: 'exact', head: true }),
    supabase.from('doctors').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabase.from('appointments').select('id', { count: 'exact', head: true }),
  ]);
  return {
    hospitals: hospitals.count ?? 0,
    departments: departments.count ?? 0,
    pendingDoctors: pendingDoctors.count ?? 0,
    appointments: appointments.count ?? 0,
  };
}
