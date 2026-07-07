import { getSupabase } from '@/utils/supabase';
import type { Department, Hospital } from '@/types/database';

export type HospitalInput = Pick<Hospital, 'name' | 'email' | 'phone' | 'address' | 'description' | 'logo_url'>;

export async function listHospitals() {
    const { data, error } = await getSupabase().from('hospitals').select('*').order('name');
    if (error) throw error;
    return (data ?? []) as Hospital[];
}

export async function getHospital(id: string) {
    const { data, error } = await getSupabase().from('hospitals').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Hospital;
}

export async function createHospital(data: HospitalInput) {
    const { data: row, error } = await getSupabase().from('hospitals').insert(data).select().single();
    if (error) throw error;
    return row as Hospital;
}

export async function updateHospital(id: string, data: Partial<Hospital>) {
    const { data: row, error } = await getSupabase().from('hospitals').update(data).eq('id', id).select().single();
    if (error) throw error;
    return row as Hospital;
}

export async function deleteHospital(id: string) {
    const { error } = await getSupabase().from('hospitals').delete().eq('id', id);
    if (error) throw error;
}

export async function listDepartments(hospitalId?: string) {
    let query = getSupabase().from('departments').select('*, hospitals(*)');
    if (hospitalId) query = query.eq('hospital_id', hospitalId);
    const { data, error } = await query.order('name');
    if (error) throw error;
    return (data ?? []) as Department[];
}

export async function createDepartment(data: { hospital_id: string; name: string; description?: string }) {
    const { data: row, error } = await getSupabase().from('departments').insert(data).select().single();
    if (error) throw error;
    return row as Department;
}

export async function updateDepartment(id: string, data: Partial<Department>) {
    const { data: row, error } = await getSupabase().from('departments').update(data).eq('id', id).select().single();
    if (error) throw error;
    return row as Department;
}

export async function deleteDepartment(id: string) {
    const { error } = await getSupabase().from('departments').delete().eq('id', id);
    if (error) throw error;
}
