import { getSupabase } from '@/utils/supabase';
import type { Doctor, Patient, User, UserRole } from '@/types/database';

export interface FullUserProfile extends User {
    patient_id?: string;
    patient?: Patient | null;
    doctor_id?: string;
    doctor?: Doctor | null;
    profileComplete: boolean;
}

/** DB may use `name`; app uses `full_name`. */
export function normalizeUser(row: Record<string, unknown> | null): User | null {
    if (!row) return null;
    return {
        ...(row as unknown as User),
        full_name: String(row.full_name ?? row.name ?? ''),
        email: (row.email as string | null | undefined) ?? null,
    };
}

export async function fetchUserById(userId: string): Promise<User | null> {
    const { data, error } = await getSupabase().from('users').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return normalizeUser(data as Record<string, unknown> | null);
}

export async function fetchFullProfile(userId: string): Promise<FullUserProfile | null> {
    const user = await fetchUserById(userId);
    if (!user) return null;

    const [{ data: patient }, { data: doctor }] = await Promise.all([
        getSupabase().from('patients').select('*').eq('user_id', userId).maybeSingle(),
        getSupabase().from('doctors').select('*').eq('user_id', userId).maybeSingle(),
    ]);

    const effectiveRole: UserRole =
        user.role === 'ADMIN' ? 'ADMIN' : doctor ? 'DOCTOR' : patient ? 'PATIENT' : user.role;

    const profileComplete =
        effectiveRole === 'ADMIN' ||
        (effectiveRole === 'PATIENT' && !!patient) ||
        (effectiveRole === 'DOCTOR' && !!doctor);

    return {
        ...user,
        role: effectiveRole,
        patient_id: patient?.id,
        patient,
        doctor_id: doctor?.id,
        doctor,
        profileComplete,
    };
}

export async function updateUser(userId: string, updates: Partial<Pick<User, 'full_name' | 'phone' | 'profile_image'>>) {
    const { data, error } = await getSupabase().from('users').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return normalizeUser(data as Record<string, unknown>)!;
}

export function getRole(user: User | FullUserProfile): UserRole {
    return user.role;
}
