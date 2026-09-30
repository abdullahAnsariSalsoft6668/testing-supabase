import { getSupabase } from '@/utils/supabase';
import type { Doctor, Hospital, HospitalStatus, Patient, User, UserRole } from '@/types/database';

export interface FullUserProfile extends User {
    patient_id?: string;
    patient?: Patient | null;
    doctor_id?: string;
    doctor?: Doctor | null;
    hospital_id?: string | null;
    hospital_status?: HospitalStatus | null;
    hospital?: Hospital | null;
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

    const [{ data: patient }, { data: doctor }, { data: membership }] = await Promise.all([
        getSupabase().from('patients').select('*, hospitals(*)').eq('user_id', userId).maybeSingle(),
        getSupabase().from('doctors').select('*, hospitals(*)').eq('user_id', userId).maybeSingle(),
        getSupabase().from('hospital_members').select('hospital_id').eq('user_id', userId).maybeSingle(),
    ]);

    const patientHospitalId = (patient as Patient | null)?.hospital_id ?? null;
    const resolvedHospitalId =
        membership?.hospital_id ?? patientHospitalId ?? doctor?.hospital_id ?? null;

    let hospital: Hospital | null = (patient as Patient | null)?.hospitals ?? doctor?.hospitals ?? null;
    if (resolvedHospitalId && hospital?.id !== resolvedHospitalId) {
        const { data: hospitalRow } = await getSupabase()
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

    const profileComplete =
        effectiveRole === 'ADMIN' ||
        effectiveRole === 'HOSPITAL_ADMIN' ||
        (effectiveRole === 'PATIENT' && !!patientHospitalId) ||
        (effectiveRole === 'DOCTOR' && !!doctor);

    return {
        ...user,
        role: effectiveRole,
        patient_id: patient?.id,
        patient,
        doctor_id: doctor?.id,
        doctor,
        hospital_id: resolvedHospitalId,
        hospital_status: hospital?.status ?? null,
        hospital,
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
