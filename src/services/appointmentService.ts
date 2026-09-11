import { EXPO_PUBLIC_NODE_API_BASE_URL } from '@env';
import { getSupabase } from '@/utils/supabase';
import { getLocalDateIso } from '@/utils/date';
import type { Appointment, AppointmentStatus, Patient } from '@/types/database';

function notifyBookingSms(appointmentId: string) {
    const baseUrl = EXPO_PUBLIC_NODE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';
    if (!baseUrl || !appointmentId) return;

    void fetch(`${baseUrl}/notify/booking-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
    }).catch((err) => {
        console.warn('[appointment] booking SMS notify failed:', err);
    });
}

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
        .select('*')
        .single();
    if (aptError) throw aptError;

    notifyBookingSms(String(appointment.id));

    return appointment as Appointment;
}

export async function cancelAppointment(appointmentId: string, _slotId?: string | null) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .update({ status: 'CANCELLED' })
        .eq('id', appointmentId)
        .select()
        .single();
    if (error) throw error;

    return data as Appointment;
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const { data, error } = await getSupabase()
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select('*')
        .single();
    if (error) throw error;
    return data as Appointment;
}

async function attachPatientsToAppointments(rows: Appointment[]): Promise<Appointment[]> {
    if (rows.length === 0) return rows;

    const patientIds = [...new Set(rows.map((r) => r.patient_id).filter(Boolean))];
    const { data: patients, error } = await getSupabase()
        .from('patients')
        .select('*, users(*)')
        .in('id', patientIds);
    if (error || !patients?.length) return rows;

    const byId = new Map(patients.map((p) => [p.id, p as Patient & { users?: unknown }]));
    return rows.map((row) => ({
        ...row,
        patients: byId.get(row.patient_id) ?? row.patients,
    }));
}

async function queryDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    const { data: rpcRows, error: rpcError } = await getSupabase().rpc('list_doctor_appointments', {
        p_doctor_id: doctorId,
    });

    if (!rpcError) {
        return (rpcRows ?? []) as Appointment[];
    }

    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Appointment[];
}

async function fetchPatientAppointments(patientId: string): Promise<Appointment[]> {
    const withRelations = await getSupabase()
        .from('appointments')
        .select('*, patients(*, users(*)), doctors(*, users(*))')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });

    if (!withRelations.error) {
        return (withRelations.data ?? []) as Appointment[];
    }

    const basic = await getSupabase()
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });
    if (basic.error) throw basic.error;
    return (basic.data ?? []) as Appointment[];
}

export async function listPatientAppointments(patientId: string) {
    return fetchPatientAppointments(patientId);
}

export async function listDoctorAppointments(doctorId: string) {
    const rows = await queryDoctorAppointments(doctorId);
    return attachPatientsToAppointments(rows);
}

export async function getAppointmentById(appointmentId: string) {
    const { data: rpcRow, error: rpcError } = await getSupabase().rpc('get_doctor_appointment', {
        p_appointment_id: appointmentId,
    });

    if (!rpcError && rpcRow) {
        const [enriched] = await attachPatientsToAppointments([rpcRow as Appointment]);
        return enriched ?? (rpcRow as Appointment);
    }

    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*, patients(*, users(*)), doctors(*, users(*))')
        .eq('id', appointmentId)
        .maybeSingle();
    if (error) throw error;
    if (data) return data as Appointment;

    const { data: basic, error: basicError } = await getSupabase()
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();
    if (basicError) throw basicError;
    return basic as Appointment | null;
}

export async function getUpcomingPatientAppointment(patientId: string) {
    const today = getLocalDateIso();
    const { data, error } = await getSupabase()
        .from('appointments')
        .select('*, doctors(*, users(*), hospitals(*))')
        .eq('patient_id', patientId)
        .gte('appointment_date', today)
        .in('status', ['PENDING', 'CONFIRMED'])
        .order('appointment_date')
        .limit(1)
        .maybeSingle();
    if (error) {
        const { data: basic, error: basicError } = await getSupabase()
            .from('appointments')
            .select('*')
            .eq('patient_id', patientId)
            .gte('appointment_date', today)
            .in('status', ['PENDING', 'CONFIRMED'])
            .order('appointment_date')
            .limit(1)
            .maybeSingle();
        if (basicError) throw basicError;
        return basic as Appointment | null;
    }
    return data as Appointment | null;
}

export async function countTodayDoctorAppointments(doctorId: string) {
    const today = getLocalDateIso();
    const rows = await queryDoctorAppointments(doctorId);
    return rows.filter(
        (r) => r.appointment_date === today && (r.status === 'PENDING' || r.status === 'CONFIRMED'),
    ).length;
}
