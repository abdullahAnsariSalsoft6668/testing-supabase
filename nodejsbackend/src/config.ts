import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve(process.cwd(), '../.env') });
loadEnv({ path: path.resolve(process.cwd(), '.env') });

function env(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

export const config = {
  port: Number(env('PORT', '3001')),
  corsOrigins: env('CORS_ORIGINS', '*'),
  retellApiKey: env('RETELL_API_KEY'),
  retellAgentId: env('RETELL_AGENT_ID'),
  supabaseUrl: env('SUPABASE_URL') || env('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseKey:
    env('SUPABASE_SERVICE_ROLE_KEY') ||
    env('SUPABASE_KEY') ||
    env('EXPO_PUBLIC_SUPABASE_KEY'),
  verifyRetellSignature: env('VERIFY_RETELL_SIGNATURE', 'true') !== 'false',
};
