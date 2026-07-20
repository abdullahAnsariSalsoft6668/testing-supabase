import { supabase } from '@/lib/supabase';
import type { Doctor, FullUserProfile, Patient, User, UserRole } from '@/types/database';

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
}) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName,
        phone: params.phone ?? '',
        role: params.role,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function fetchFullProfile(userId: string): Promise<FullUserProfile | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  const user = normalizeUser(data as Record<string, unknown> | null);
  if (!user) return null;

  const [{ data: patient }, { data: doctor }] = await Promise.all([
    supabase.from('patients').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('doctors').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  const effectiveRole: UserRole =
    user.role === 'ADMIN' ? 'ADMIN' : doctor ? 'DOCTOR' : patient ? 'PATIENT' : user.role;

  return {
    ...user,
    role: effectiveRole,
    patient_id: patient?.id,
    patient: patient as Patient | null,
    doctor_id: doctor?.id,
    doctor: doctor as Doctor | null,
    profileComplete:
      effectiveRole === 'ADMIN' ||
      (effectiveRole === 'PATIENT' && !!patient) ||
      (effectiveRole === 'DOCTOR' && !!doctor),
  };
}
