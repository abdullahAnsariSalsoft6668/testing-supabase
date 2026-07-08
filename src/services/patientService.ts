import { getSupabase } from '@/utils/supabase';
import { getSession } from '@/services/authService';
import type { BloodGroup, Gender, Patient } from '@/types/database';

export async function createPatient(
    _userId: string,
    data: Partial<Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
) {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error('Not authenticated. Please sign in again.');
    }

    const existing = await getPatientByUserId(userId);
    if (existing) {
        return existing;
    }

    const { error: insertError } = await getSupabase().from('patients').insert({ user_id: userId, ...data });
    if (insertError) throw insertError;

    const row = await getPatientByUserId(userId);
    if (!row) {
        throw new Error('Patient profile was created but could not be loaded. Pull to refresh or sign in again.');
    }
    return row;
}

export async function updatePatient(patientId: string, data: Partial<Patient>) {
    const { data: row, error } = await getSupabase().from('patients').update(data).eq('id', patientId).select().single();
    if (error) throw error;
    return row as Patient;
}

export async function getPatientByUserId(userId: string) {
    const { data, error } = await getSupabase().from('patients').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data as Patient | null;
}

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const GENDERS: Gender[] = ['MALE', 'FEMALE', 'OTHER'];
