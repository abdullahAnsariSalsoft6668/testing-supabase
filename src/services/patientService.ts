import { getSupabase } from '@/utils/supabase';
import type { BloodGroup, Gender, Patient } from '@/types/database';

export async function createPatient(userId: string, data: Partial<Omit<Patient, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: row, error } = await getSupabase()
        .from('patients')
        .insert({ user_id: userId, ...data })
        .select()
        .single();
    if (error) throw error;
    return row as Patient;
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
