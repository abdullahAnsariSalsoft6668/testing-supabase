import { getSupabase } from '@/utils/supabase';
import type { DoctorSlot, SlotStatus } from '@/types/database';

function normalizeTime(value: string): string {
    const trimmed = value.trim();
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
        const [h, m] = trimmed.split(':');
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
    }
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmed)) {
        const [h, m, s] = trimmed.split(':');
        return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
    }
    return trimmed;
}

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
    const payload = {
        ...data,
        start_time: normalizeTime(data.start_time),
        end_time: normalizeTime(data.end_time),
    };
    const { data: row, error } = await getSupabase().from('doctor_slots').insert(payload).select().single();
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
