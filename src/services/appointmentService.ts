import { getSupabase } from '@/utils/supabase';
import type { Appointment, AppointmentStatus } from '@/types/database';

export async function bookAppointment(params: {
    patient_id: string;
    doctor_id: string;
    slot_id: string;
    appointment_date: string;
    appointment_time: string;
    notes?: string;
}) {
    const { data: appointment, error: aptError } = await getSupabase()
        .from('appointments')
        .insert({ ...params, status: 'PENDING' })
        .select('*, doctors(*, users(*), hospitals(*)), patients(*, users(*))')
        .single();
    if (aptError) throw aptError;

    const { error: slotError } = await getSupabase()
        .from('doctor_slots')
        .update({ status: 'BOOKED' })
        .eq('id', params.slot_id);
    if (slotError) throw slotError;

    return appointment as Appointment;
}

export async function cancelAppointment(appointmentId: string, slotId?: string | null) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .update({ status: 'CANCELLED' })
        .eq('id', appointmentId)
        .select()
        .single();
    if (error) throw error;

    if (slotId) {
        await getSupabase().from('doctor_slots').update({ status: 'AVAILABLE' }).eq('id', slotId);
    }
    return data as Appointment;
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select('*, doctors(*, users(*)), patients(*, users(*))')
        .single();
    if (error) throw error;
    return data as Appointment;
}

export async function listPatientAppointments(patientId: string) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*, doctors(*, users(*), hospitals(*), departments(*))')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Appointment[];
}

export async function listDoctorAppointments(doctorId: string) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*, patients(*, users(*))')
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Appointment[];
}

export async function getUpcomingPatientAppointment(patientId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*, doctors(*, users(*), hospitals(*))')
        .eq('patient_id', patientId)
        .gte('appointment_date', today)
        .in('status', ['PENDING', 'CONFIRMED'])
        .order('appointment_date')
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    return data as Appointment | null;
}

export async function countTodayDoctorAppointments(doctorId: string) {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await getSupabase()
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('appointment_date', today)
        .in('status', ['PENDING', 'CONFIRMED']);
    if (error) throw error;
    return count ?? 0;
}
