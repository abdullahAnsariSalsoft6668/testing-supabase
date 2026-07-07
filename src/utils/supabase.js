import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_KEY } from '@env';

let supabaseClient = null;

/** Lazily create and return the Supabase client singleton. */
export function getSupabase() {
    if (!supabaseClient) {
        const url = EXPO_PUBLIC_SUPABASE_URL?.trim();
        const key = EXPO_PUBLIC_SUPABASE_KEY?.trim();

        if (!url || !key) {
            throw new Error(
                '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY in .env. Restart Metro with --reset-cache.',
            );
        }

        supabaseClient = createClient(url, key, {
            auth: {
                storage: AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });
    }

    return supabaseClient;
}
