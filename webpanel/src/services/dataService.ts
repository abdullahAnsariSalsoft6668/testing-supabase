import { supabase } from '@/lib/supabase';
import type { Appointment, AppointmentStatus, ClinicOption, ClinicOptionKind, Department, Doctor, DoctorSlot, DoctorStatus, Hospital, HospitalStatus, Patient } from '@/types/database';

export async function listHospitals(hospitalId?: string | null) {
  let q = supabase.from('hospitals').select('*').order('name');
  if (hospitalId) q = q.eq('id', hospitalId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Hospital[];
}

export async function listHospitalsByStatus(status: HospitalStatus) {
  const { data, error } = await supabase
    .from('hospitals')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Hospital[];
}

export async function setHospitalStatus(id: string, status: HospitalStatus) {
  const { error } = await supabase.rpc('set_hospital_status', {
    p_hospital_id: id,
    p_status: status,
  });
  if (error) throw error;
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

export async function listDepartments(hospitalId?: string | null) {
  let q = supabase.from('departments').select('*, hospitals(*)').order('name');
  if (hospitalId) q = q.eq('hospital_id', hospitalId);
  const { data, error } = await q;
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

export async function listClinicOptions(kind: ClinicOptionKind, hospitalId?: string | null) {
  let q = supabase.from('clinic_options').select('*').eq('kind', kind).order('name');
  if (hospitalId) {
    q = q.or(`hospital_id.is.null,hospital_id.eq.${hospitalId}`);
  } else {
    q = q.is('hospital_id', null);
  }
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []) as ClinicOption[];
}

export async function createClinicOption(payload: {
  kind: ClinicOptionKind;
  name: string;
  hospital_id?: string | null;
}) {
  const { data, error } = await supabase
    .from('clinic_options')
    .insert({
      kind: payload.kind,
      name: payload.name.trim(),
      hospital_id: payload.hospital_id ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ClinicOption;
}

export async function deleteClinicOption(id: string) {
  const { error } = await supabase.from('clinic_options').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listDoctors(status?: DoctorStatus, hospitalId?: string | null) {
  let q = supabase.from('doctors').select('*, users(*), hospitals(*), departments(*)').order('created_at', {
    ascending: false,
  });
  if (status) q = q.eq('status', status);
  if (hospitalId) q = q.eq('hospital_id', hospitalId);
  const { data, error } = await q;
  if (error) throw error;

  let doctors = (data ?? []) as Doctor[];
  const missingIds = doctors.filter((d) => !d.users && d.user_id).map((d) => d.user_id);

  if (missingIds.length) {
    const { data: users } = await supabase.from('users').select('*').in('id', missingIds);
    const byId = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    doctors = doctors.map((d) => (d.users ? d : { ...d, users: byId[d.user_id] as Doctor['users'] }));
  }

  return doctors.map((d) => {
    if (!d.users) return d;
    const fullName = String(d.users.full_name || d.users.name || '').trim();
    return { ...d, users: { ...d.users, full_name: fullName } };
  });
}

export async function updateDoctorStatus(id: string, status: DoctorStatus) {
  const { data, error } = await supabase.from('doctors').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Doctor;
}

export async function createDoctorProfile(payload: {
  specialization: string;
  qualification?: string;
  experience?: number;
  consultation_fee?: number;
  bio?: string;
  license_number?: string;
  hospital_id: string;
  department_id?: string | null;
}) {
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id;
  if (!userId) throw new Error('Not authenticated');
  if (!payload.hospital_id) throw new Error('Choose a hospital to apply to');

  const { data, error } = await supabase
    .from('doctors')
    .insert({
      user_id: userId,
      status: 'PENDING',
      specialization: payload.specialization,
      qualification: payload.qualification ?? null,
      experience: payload.experience ?? 0,
      consultation_fee: payload.consultation_fee ?? null,
      bio: payload.bio ?? null,
      license_number: payload.license_number ?? null,
      hospital_id: payload.hospital_id,
      department_id: payload.department_id || null,
    })
    .select()
    .single();
  if (error) throw error;

  await supabase.from('users').update({ role: 'DOCTOR' }).eq('id', userId);
  return data as Doctor;
}

export async function listApprovedDoctors(hospitalId?: string | null) {
  if (!hospitalId) return [];
  const rows = await listDoctors('APPROVED', hospitalId);
  return rows.filter((d) => !d.hospitals?.status || d.hospitals.status === 'APPROVED');
}

export async function listPatients(hospitalId?: string | null) {
  let q = supabase.from('patients').select('*, users(*), hospitals(*)').order('created_at', { ascending: false });
  if (hospitalId) q = q.eq('hospital_id', hospitalId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Patient[];
}

export async function joinPatientHospital(hospitalId: string) {
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id;
  if (!userId) throw new Error('Not authenticated');
  if (!hospitalId) throw new Error('Choose your hospital');

  const { data, error } = await supabase.rpc('join_patient_hospital', {
    p_hospital_id: hospitalId,
  });
  if (error) throw new Error(error.message);
  return data as Patient;
}

export async function updateOwnPatientProfile(payload: {
  fullName: string;
  phone: string;
  gender?: string | null;
  blood_group?: string | null;
  dob?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  allergies?: string | null;
}) {
  const { data: sessionData } = await supabase.auth.getUser();
  const userId = sessionData.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const fullName = payload.fullName.trim();
  if (!fullName) throw new Error('Name is required');

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: fullName, phone: payload.phone.trim() || null })
    .eq('id', userId);
  if (userError) throw new Error(userError.message);

  const { data: patient, error: patientLookupError } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (patientLookupError) throw new Error(patientLookupError.message);
  if (!patient?.id) throw new Error('Patient profile not found');

  const { error: patientError } = await supabase
    .from('patients')
    .update({
      gender: payload.gender || null,
      blood_group: payload.blood_group || null,
      dob: payload.dob || null,
      address: payload.address?.trim() || null,
      emergency_contact_name: payload.emergency_contact_name?.trim() || null,
      emergency_contact_phone: payload.emergency_contact_phone?.trim() || null,
      allergies: payload.allergies?.trim() || null,
    })
    .eq('id', patient.id);
  if (patientError) throw new Error(patientError.message);
}

function localISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function localHM(d = new Date()) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export async function listSlots(doctorId: string, date?: string) {
  let q = supabase.from('doctor_slots').select('*').eq('doctor_id', doctorId).order('appointment_date').order('start_time');
  if (date) q = q.eq('appointment_date', date);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DoctorSlot[];
}

/** Patient booking: AVAILABLE slots from today onward (hides past August dates). */
export async function listBookableSlots(doctorId: string) {
  const today = localISODate();
  const nowHm = localHM();
  const { data, error } = await supabase
    .from('doctor_slots')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('status', 'AVAILABLE')
    .gte('appointment_date', today)
    .order('appointment_date')
    .order('start_time');
  if (error) throw error;

  return ((data ?? []) as DoctorSlot[]).filter((s) => {
    if (s.appointment_date > today) return true;
    return String(s.start_time ?? '').slice(0, 5) > nowHm;
  });
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

async function attachDoctorsToAppointments(rows: Appointment[]): Promise<Appointment[]> {
  if (!rows.length) return rows;

  const doctorIds = [...new Set(rows.map((r) => r.doctor_id).filter(Boolean))];
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('*, users(*), hospitals(*)')
    .in('id', doctorIds);

  if (error || !doctors?.length) return rows;

  const byId = new Map(doctors.map((d) => [d.id, d]));
  return rows.map((row) => ({
    ...row,
    doctors: (byId.get(row.doctor_id) ?? row.doctors) as Appointment['doctors'],
  }));
}

export async function listAppointmentsForPatient(patientId: string) {
  const base = supabase.from('appointments').select('*').eq('patient_id', patientId);

  const withCreated = await base
    .order('appointment_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (!withCreated.error) {
    return attachDoctorsToAppointments((withCreated.data ?? []) as Appointment[]);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });
  if (error) throw error;
  return attachDoctorsToAppointments((data ?? []) as Appointment[]);
}

async function attachPatientsToAppointments(rows: Appointment[]): Promise<Appointment[]> {
  if (!rows.length) return rows;

  const patientIds = [...new Set(rows.map((r) => r.patient_id).filter(Boolean))];
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*, users(*)')
    .in('id', patientIds);

  if (error || !patients?.length) return rows;

  const byId = new Map(patients.map((p) => [p.id, p]));
  return rows.map((row) => ({
    ...row,
    patients: (byId.get(row.patient_id) ?? row.patients) as Appointment['patients'],
  }));
}

/** Doctor visits — prefer RPC (migration 020) to avoid RLS/embed failures. */
export async function listAppointmentsForDoctor(doctorId: string) {
  const { data: rpcRows, error: rpcError } = await supabase.rpc('list_doctor_appointments', {
    p_doctor_id: doctorId,
  });

  if (!rpcError) {
    return attachPatientsToAppointments((rpcRows ?? []) as Appointment[]);
  }

  const withRelations = await supabase
    .from('appointments')
    .select('*, patients(*, users(*))')
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: false });

  if (!withRelations.error) {
    return (withRelations.data ?? []) as Appointment[];
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: false });

  if (error) throw error;
  return attachPatientsToAppointments((data ?? []) as Appointment[]);
}

export async function listAllAppointments(limit = 40, hospitalId?: string | null) {
  let q = supabase
    .from('appointments')
    .select('*, doctors!inner(*, users(*)), patients(*, users(*))')
    .order('appointment_date', { ascending: false })
    .limit(limit);
  if (hospitalId) q = q.eq('doctors.hospital_id', hospitalId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { data, error } = await supabase.from('appointments').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Appointment;
}

function notifyBookingSms(appointmentId: string) {
  const baseUrl = (import.meta.env.VITE_NODE_API_BASE_URL as string | undefined)?.trim().replace(/\/$/, '') ?? '';
  if (!baseUrl || !appointmentId) return;

  void fetch(`${baseUrl}/notify/booking-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointmentId }),
  }).catch((err) => {
    console.warn('[appointment] booking SMS notify failed:', err);
  });
}

async function assertDoctorInPatientHospital(patientId: string, doctorId: string) {
  const [{ data: patient }, { data: doctor }] = await Promise.all([
    supabase.from('patients').select('hospital_id').eq('id', patientId).maybeSingle(),
    supabase.from('doctors').select('hospital_id').eq('id', doctorId).maybeSingle(),
  ]);
  if (!patient?.hospital_id || patient.hospital_id !== doctor?.hospital_id) {
    throw new Error('You can only book doctors at your hospital.');
  }
}

export async function bookAppointment(payload: {
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}) {
  await assertDoctorInPatientHospital(payload.patient_id, payload.doctor_id);
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...payload, status: 'PENDING', notes: payload.notes ?? null })
    .select()
    .single();
  if (error) throw error;

  notifyBookingSms(String(data.id));

  return data as Appointment;
}

export async function cancelAppointment(id: string) {
  return updateAppointmentStatus(id, 'CANCELLED');
}

export async function getDashboardCounts(hospitalId?: string | null) {
  const hospitalsQ = hospitalId
    ? supabase.from('hospitals').select('id', { count: 'exact', head: true }).eq('id', hospitalId)
    : supabase.from('hospitals').select('id', { count: 'exact', head: true });
  const departmentsQ = hospitalId
    ? supabase.from('departments').select('id', { count: 'exact', head: true }).eq('hospital_id', hospitalId)
    : supabase.from('departments').select('id', { count: 'exact', head: true });
  const pendingDoctorsQ = hospitalId
    ? supabase
        .from('doctors')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'PENDING')
        .eq('hospital_id', hospitalId)
    : supabase.from('doctors').select('id', { count: 'exact', head: true }).eq('status', 'PENDING');
  const appointmentsQ = hospitalId
    ? supabase
        .from('appointments')
        .select('id, doctors!inner(hospital_id)', { count: 'exact', head: true })
        .eq('doctors.hospital_id', hospitalId)
    : supabase.from('appointments').select('id', { count: 'exact', head: true });
  const pendingHospitalsQ = hospitalId
    ? Promise.resolve({ count: 0 })
    : supabase.from('hospitals').select('id', { count: 'exact', head: true }).eq('status', 'PENDING');
  const patientsQ = hospitalId
    ? supabase.from('patients').select('id', { count: 'exact', head: true }).eq('hospital_id', hospitalId)
    : supabase.from('patients').select('id', { count: 'exact', head: true });

  const [hospitals, departments, pendingDoctors, appointments, pendingHospitals, patients] = await Promise.all([
    hospitalsQ,
    departmentsQ,
    pendingDoctorsQ,
    appointmentsQ,
    pendingHospitalsQ,
    patientsQ,
  ]);
  return {
    hospitals: hospitals.count ?? 0,
    departments: departments.count ?? 0,
    pendingDoctors: pendingDoctors.count ?? 0,
    appointments: appointments.count ?? 0,
    pendingHospitals: pendingHospitals.count ?? 0,
    patients: patients.count ?? 0,
  };
}
