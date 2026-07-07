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
