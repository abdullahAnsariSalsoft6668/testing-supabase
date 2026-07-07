import { getSupabase } from '@/utils/supabase';
import type { DoctorSlot, SlotStatus } from '@/types/database';

export async function listSlots(doctorId: string, date?: string, status?: SlotStatus) {
    let query = getSupabase().from('doctor_slots').select('*').eq('doctor_id', doctorId);
    if (date) query = query.eq('appointment_date', date);
    if (status) query = query.eq('status', status);
    const { data, error } = await query.order('start_time');
    if (error) throw error;
    return (data ?? []) as DoctorSlot[];
}

export async function createSlot(data: {
    doctor_id: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status?: SlotStatus;
}) {
    const { data: row, error } = await getSupabase().from('doctor_slots').insert(data).select().single();
    if (error) throw error;
    return row as DoctorSlot;
}

export async function updateSlot(slotId: string, data: Partial<DoctorSlot>) {
    const { data: row, error } = await getSupabase().from('doctor_slots').update(data).eq('id', slotId).select().single();
    if (error) throw error;
    return row as DoctorSlot;
}

export async function deleteSlot(slotId: string) {
    const { error } = await getSupabase().from('doctor_slots').delete().eq('id', slotId);
    if (error) throw error;
}

export async function listAvailableSlots(doctorId: string, date: string) {
    return listSlots(doctorId, date, 'AVAILABLE');
}
