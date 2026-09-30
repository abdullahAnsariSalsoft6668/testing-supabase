import { supabase } from '@/lib/supabase';
import type { Doctor, FullUserProfile, Hospital, Patient, User, UserRole } from '@/types/database';

function normalizeUser(row: Record<string, unknown> | null): User | null {
  if (!row) return null;
  return {
    ...(row as unknown as User),
    full_name: String(row.full_name ?? row.name ?? ''),
    email: (row.email as string | null) ?? null,
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: Extract<UserRole, 'PATIENT' | 'DOCTOR'>;
  hospitalId?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        phone: params.phone ?? '',
        role: params.role,
        hospital_id: params.hospitalId ?? '',
      },
    },
  });
  if (error) throw error;
  if (params.role === 'PATIENT' && params.hospitalId && data.session?.user?.id) {
    await ensurePatientHospital();
  }
  return data;
}

type HospitalApplyMeta = {
  hospital_name?: string;
  hospital_email?: string;
  hospital_phone?: string;
  hospital_address?: string;
  hospital_description?: string;
  hospital_timezone?: string;
  phone?: string;
  hospital_apply?: string | boolean;
};

async function callApplyHospital(params: {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  timezone?: string | null;
}) {
  const { error } = await supabase.rpc('apply_hospital', {
    p_name: params.name,
    p_email: params.email ?? null,
    p_phone: params.phone ?? null,
    p_address: params.address ?? null,
    p_description: params.description ?? null,
    p_timezone: params.timezone || null,
  });
  if (error && !/already|existing/i.test(error.message)) {
    throw error;
  }
}

/** After login/signup: bind a patient to the hospital chosen at registration. */
export async function ensurePatientHospital() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session?.user?.id) return;

  const meta = (session.user.user_metadata ?? {}) as { role?: string; hospital_id?: string };
  if (String(meta.role ?? '').toUpperCase() === 'DOCTOR') return;

  const hospitalId = String(meta.hospital_id ?? '').trim();
  const { data: patient } = await supabase
    .from('patients')
    .select('id, hospital_id')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (patient?.hospital_id) return;
  if (!hospitalId) return;

  if (patient?.id) {
    const { error } = await supabase.from('patients').update({ hospital_id: hospitalId }).eq('id', patient.id);
    if (error && !/cannot be changed/i.test(error.message)) throw error;
    return;
  }

  const { error } = await supabase.from('patients').insert({
    user_id: session.user.id,
    hospital_id: hospitalId,
  });
  if (error && !/duplicate|unique/i.test(error.message)) throw error;
}

/** After login/signup: create PENDING hospital from Auth metadata if needed. */
export async function ensureHospitalApplication() {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session?.user?.id) return;

  const { data: membership } = await supabase
    .from('hospital_members')
    .select('hospital_id')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (membership?.hospital_id) return;

  const meta = (session.user.user_metadata ?? {}) as HospitalApplyMeta;
  const applyFlag = String(meta.hospital_apply ?? '');
  const name = String(meta.hospital_name ?? '').trim();
  if (applyFlag !== 'true' && applyFlag !== '1') return;
  if (!name) return;

  await callApplyHospital({
    name,
    email: meta.hospital_email || session.user.email || null,
    phone: meta.hospital_phone || meta.phone || null,
    address: meta.hospital_address || null,
    description: meta.hospital_description || null,
    timezone: meta.hospital_timezone || null,
  });
}

export async function signUpHospital(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  hospitalName: string;
  hospitalAddress?: string;
  hospitalTimezone?: string;
  hospitalDescription?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        phone: params.phone ?? '',
        role: 'PATIENT',
        hospital_apply: 'true',
        hospital_name: params.hospitalName,
        hospital_email: params.email,
        hospital_phone: params.phone ?? '',
        hospital_address: params.hospitalAddress ?? '',
        hospital_timezone: params.hospitalTimezone ?? '',
        hospital_description: params.hospitalDescription ?? '',
      },
    },
  });
  if (error) throw error;
  if (data.session?.user?.id) {
    await callApplyHospital({
      name: params.hospitalName,
      email: params.email,
      phone: params.phone ?? null,
      address: params.hospitalAddress ?? null,
      description: params.hospitalDescription ?? null,
      timezone: params.hospitalTimezone || null,
    });
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchFullProfile(userId: string): Promise<FullUserProfile | null> {
  try {
    await ensureHospitalApplication();
  } catch (applyError) {
    console.warn('[Auth] ensureHospitalApplication failed:', applyError);
  }
  try {
    await ensurePatientHospital();
  } catch (patientError) {
    console.warn('[Auth] ensurePatientHospital failed:', patientError);
  }

  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  const user = normalizeUser(data as Record<string, unknown> | null);
  if (!user) return null;

  const [{ data: patient }, { data: doctor }, { data: membership }] = await Promise.all([
    supabase.from('patients').select('*, hospitals(*)').eq('user_id', userId).maybeSingle(),
    supabase.from('doctors').select('*, hospitals(*)').eq('user_id', userId).maybeSingle(),
    supabase.from('hospital_members').select('hospital_id').eq('user_id', userId).maybeSingle(),
  ]);

  const typedPatient = patient as Patient | null;
  const patientHospitalId = typedPatient?.hospital_id ?? null;
  const resolvedHospitalId =
    membership?.hospital_id ?? patientHospitalId ?? doctor?.hospital_id ?? null;

  let hospital: Hospital | null = typedPatient?.hospitals ?? doctor?.hospitals ?? null;
  if (resolvedHospitalId && hospital?.id !== resolvedHospitalId) {
    const { data: hospitalRow } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', resolvedHospitalId)
      .maybeSingle();
    hospital = (hospitalRow as Hospital | null) ?? hospital;
  }

  const effectiveRole: UserRole =
    user.role === 'ADMIN'
      ? 'ADMIN'
      : membership?.hospital_id
        ? 'HOSPITAL_ADMIN'
        : doctor
          ? 'DOCTOR'
          : patient
            ? 'PATIENT'
            : user.role === 'HOSPITAL_ADMIN'
              ? 'HOSPITAL_ADMIN'
              : user.role;

  return {
    ...user,
    role: effectiveRole,
    patient_id: patient?.id,
    patient: typedPatient,
    doctor_id: doctor?.id,
    doctor: doctor as Doctor | null,
    hospital_id: resolvedHospitalId,
    hospital_status: hospital?.status ?? null,
    hospital,
    profileComplete:
      effectiveRole === 'ADMIN' ||
      effectiveRole === 'HOSPITAL_ADMIN' ||
      (effectiveRole === 'PATIENT' && !!patientHospitalId) ||
      (effectiveRole === 'DOCTOR' && !!doctor),
  };
}
