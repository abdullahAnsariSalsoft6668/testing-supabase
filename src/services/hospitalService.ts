import { getSupabase } from '@/utils/supabase';
import type { ClinicOption, ClinicOptionKind, Department, Hospital, HospitalStatus } from '@/types/database';

export type HospitalInput = Pick<
    Hospital,
    'name' | 'email' | 'phone' | 'address' | 'description' | 'logo_url' | 'timezone'
>;

export async function listHospitals(hospitalId?: string | null) {
    let query = getSupabase().from('hospitals').select('*').order('name');
    if (hospitalId) query = query.eq('id', hospitalId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Hospital[];
}

export async function listHospitalsByStatus(status: HospitalStatus) {
    const { data, error } = await getSupabase()
        .from('hospitals')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Hospital[];
}

export async function setHospitalStatus(id: string, status: HospitalStatus) {
    const { error } = await getSupabase().rpc('set_hospital_status', {
        p_hospital_id: id,
        p_status: status,
    });
    if (error) throw error;
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

export async function listClinicOptions(kind: ClinicOptionKind, hospitalId?: string | null) {
    let query = getSupabase().from('clinic_options').select('*').eq('kind', kind).order('name');
    if (hospitalId) {
        query = query.or(`hospital_id.is.null,hospital_id.eq.${hospitalId}`);
    } else {
        query = query.is('hospital_id', null);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as ClinicOption[];
}

export async function createClinicOption(payload: {
    kind: ClinicOptionKind;
    name: string;
    hospital_id?: string | null;
}) {
    const { data, error } = await getSupabase()
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
    const { error } = await getSupabase().from('clinic_options').delete().eq('id', id);
    if (error) throw new Error(error.message);
}
