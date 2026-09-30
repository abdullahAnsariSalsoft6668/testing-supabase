import { getSupabase } from '@/utils/supabase';
import type { UserRole } from '@/types/database';

export async function signUp(params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: UserRole;
}) {
    const { data, error } = await getSupabase().auth.signUp({
        email: params.email,
        password: params.password,
        options: {
            data: {
                full_name: params.fullName,
                phone: params.phone ?? '',
                role: params.role,
            },
        },
    });
    if (error) throw error;
    return data;
}

type HospitalApplyMeta = {
    hospital_name?: string;
    hospital_email?: string;
    hospital_phone?: string;
    hospital_address?: string;
    hospital_description?: string;
    hospital_timezone?: string;
    phone?: string;
    hospital_apply?: string | boolean;
};

async function callApplyHospital(params: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    description?: string | null;
    timezone?: string | null;
}) {
    const { error } = await getSupabase().rpc('apply_hospital', {
        p_name: params.name,
        p_email: params.email ?? null,
        p_phone: params.phone ?? null,
        p_address: params.address ?? null,
        p_description: params.description ?? null,
        p_timezone: params.timezone || null,
    });
    if (error && !/already|existing/i.test(error.message)) {
        throw error;
    }
}

export async function ensurePatientHospital() {
    const session = (await getSupabase().auth.getSession()).data.session;
    if (!session?.user?.id) return;

    const meta = (session.user.user_metadata ?? {}) as { role?: string; hospital_id?: string };
    if (String(meta.role ?? '').toUpperCase() === 'DOCTOR') return;

    const hospitalId = String(meta.hospital_id ?? '').trim();
    const { data: patient } = await getSupabase()
        .from('patients')
        .select('id, hospital_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

    if (patient?.hospital_id) return;
    if (!hospitalId) return;

    if (patient?.id) {
        const { error } = await getSupabase().from('patients').update({ hospital_id: hospitalId }).eq('id', patient.id);
        if (error && !/cannot be changed/i.test(error.message)) throw error;
        return;
    }

    const { error } = await getSupabase().from('patients').insert({
        user_id: session.user.id,
        hospital_id: hospitalId,
    });
    if (error && !/duplicate|unique/i.test(error.message)) throw error;
}

export async function ensureHospitalApplication() {
    const session = (await getSupabase().auth.getSession()).data.session;
    if (!session?.user?.id) return;

    const { data: membership } = await getSupabase()
        .from('hospital_members')
        .select('hospital_id')
        .eq('user_id', session.user.id)
        .maybeSingle();
    if (membership?.hospital_id) return;

    const meta = (session.user.user_metadata ?? {}) as HospitalApplyMeta;
    const applyFlag = String(meta.hospital_apply ?? '');
    const name = String(meta.hospital_name ?? '').trim();
    if (applyFlag !== 'true' && applyFlag !== '1') return;
    if (!name) return;

    await callApplyHospital({
        name,
        email: meta.hospital_email || session.user.email || null,
        phone: meta.hospital_phone || meta.phone || null,
        address: meta.hospital_address || null,
        description: meta.hospital_description || null,
        timezone: meta.hospital_timezone || null,
    });
}

export async function signUpHospital(params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    hospitalName: string;
    hospitalAddress?: string;
    hospitalTimezone?: string;
    hospitalDescription?: string;
}) {
    const { data, error } = await getSupabase().auth.signUp({
        email: params.email,
        password: params.password,
        options: {
            data: {
                full_name: params.fullName,
                phone: params.phone ?? '',
                role: 'PATIENT',
                hospital_apply: 'true',
                hospital_name: params.hospitalName,
                hospital_email: params.email,
                hospital_phone: params.phone ?? '',
                hospital_address: params.hospitalAddress ?? '',
                hospital_timezone: params.hospitalTimezone ?? '',
                hospital_description: params.hospitalDescription ?? '',
            },
        },
    });
    if (error) throw error;
    if (data.session?.user?.id) {
        await callApplyHospital({
            name: params.hospitalName,
            email: params.email,
            phone: params.phone ?? null,
            address: params.hospitalAddress ?? null,
            description: params.hospitalDescription ?? null,
            timezone: params.hospitalTimezone || null,
        });
    }
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
}

export async function resetPassword(email: string) {
    const { error } = await getSupabase().auth.resetPasswordForEmail(email);
    if (error) throw error;
}

export async function getSession() {
    const { data, error } = await getSupabase().auth.getSession();
    if (error) throw error;
    return data.session;
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return getSupabase().auth.onAuthStateChange(callback);
}
