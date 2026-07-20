import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve(process.cwd(), '../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

function env(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

const supabaseKey =
  env('SUPABASE_SERVICE_ROLE_KEY') ||
  env('SUPABASE_KEY') ||
  env('EXPO_PUBLIC_SUPABASE_KEY');

/** True when key looks like a secret/service key (bypasses RLS). Publishable/anon cannot. */
function looksLikeServiceRoleKey(key: string): boolean {
  if (!key) return false;
  if (key.startsWith('sb_secret_')) return true;
  if (key.startsWith('eyJ')) {
    try {
      const payload = JSON.parse(Buffer.from(key.split('.')[1] ?? '', 'base64url').toString('utf8')) as {
        role?: string;
      };
      return payload.role === 'service_role';
    } catch {
      return false;
    }
  }
  return false;
}

export const config = {
  port: Number(env('PORT', '3001')),
  corsOrigins: env('CORS_ORIGINS', '*'),
  retellApiKey: env('RETELL_API_KEY'),
  retellAgentId: env('RETELL_AGENT_ID'),
  supabaseUrl: env('SUPABASE_URL') || env('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseKey,
  supabaseUsesServiceRole: looksLikeServiceRoleKey(supabaseKey),
  verifyRetellSignature: env('VERIFY_RETELL_SIGNATURE', 'true') !== 'false',
};
