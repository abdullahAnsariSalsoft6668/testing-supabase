import { getSupabase } from '@/utils/supabase';
import type { Doctor, DoctorStatus } from '@/types/database';

export async function createDoctor(
    userId: string,
    data: {
        specialization: string;
        qualification?: string;
        experience?: number;
        consultation_fee?: number;
        bio?: string;
        license_number?: string;
        hospital_id?: string;
        department_id?: string;
    },
) {
    const { data: row, error } = await getSupabase()
        .from('doctors')
        .insert({ user_id: userId, status: 'PENDING', ...data })
        .select()
        .single();
    if (error) throw error;
    return row as Doctor;
}

export async function updateDoctor(doctorId: string, data: Partial<Doctor>) {
    const { data: row, error } = await getSupabase().from('doctors').update(data).eq('id', doctorId).select().single();
    if (error) throw error;
    return row as Doctor;
}

export async function getDoctorByUserId(userId: string) {
    const { data, error } = await getSupabase()
        .from('doctors')
        .select('*, hospitals(*), departments(*)')
        .eq('user_id', userId)
        .maybeSingle();
    if (error) throw error;
    return data as Doctor | null;
}

export async function listApprovedDoctors(filters?: { hospitalId?: string; departmentId?: string }) {
    let query = getSupabase()
        .from('doctors')
        .select('*, users(*), hospitals(*), departments(*)')
        .eq('status', 'APPROVED');

    if (filters?.hospitalId) query = query.eq('hospital_id', filters.hospitalId);
    if (filters?.departmentId) query = query.eq('department_id', filters.departmentId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Doctor[];
}

export async function listDoctorsByStatus(status?: DoctorStatus) {
    let query = getSupabase().from('doctors').select('*, users(*), hospitals(*), departments(*)');
    if (status) query = query.eq('status', status);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Doctor[];
}

export async function updateDoctorStatus(doctorId: string, status: DoctorStatus) {
    return updateDoctor(doctorId, { status });
}

export async function getDoctorById(doctorId: string) {
    const { data, error } = await getSupabase()
        .from('doctors')
        .select('*, users(*), hospitals(*), departments(*)')
        .eq('id', doctorId)
        .single();
    if (error) throw error;
    return data as Doctor;
}
