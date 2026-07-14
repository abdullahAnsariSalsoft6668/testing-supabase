import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error(
      'Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or EXPO_PUBLIC_* in root .env)',
    );
  }

  if (!client) {
    client = createClient(config.supabaseUrl, config.supabaseKey);
  }

  return client;
}

export async function verifyAccessToken(accessToken: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error('Invalid or expired access token');
  }
  return data.user;
}
