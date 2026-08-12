import { getSupabase } from './supabase.js';

async function findPatientIdByUserId(userId: string): Promise<string | null> {
  const supabase = getSupabase();
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (patientError) throw patientError;
  return patient?.id ?? null;
}

/** Resolve auth user id from login email (public.users.email or auth.users). */
async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const supabase = getSupabase();

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalized)
    .maybeSingle();

  if (!userError && user?.id) return user.id;

  // Live DB may not have public.users.email — look up via Auth Admin API
  if (userError?.message?.includes('email') || userError?.code === '42703') {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authError) throw authError;

    const match = authData.users.find(
      (u) => u.email?.trim().toLowerCase() === normalized,
    );
    return match?.id ?? null;
  }

  if (userError) throw userError;
  return null;
}

/** Resolve patient row id from login email (for Retell dashboard Test Audio). */
export async function findPatientIdByEmail(email: string): Promise<string | null> {
  const userId = await findAuthUserIdByEmail(email);
  if (!userId) return null;
  return findPatientIdByUserId(userId);
}

/** True when patient id exists in public.patients. */
export async function patientExists(patientId: string): Promise<boolean> {
  const id = patientId.trim();
  if (!id) return false;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('patients')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data?.id);
}

/** First patient row (dev fallback when email/id env vars are wrong). */
export async function findAnyPatientId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('patients')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}
