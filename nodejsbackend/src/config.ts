import { config as loadEnv } from 'dotenv';
import path from 'node:path';

loadEnv({ path: path.resolve(process.cwd(), '../.env') });
// Backend-specific vars (Retell test patient, service role) must win over root .env
loadEnv({ path: path.resolve(process.cwd(), '.env'), override: true });

function env(key: string, fallback = ''): string {
  return process.env[key]?.trim() || fallback;
}

function envNumber(key: string, fallback: number): number {
  const raw = env(key);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
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

const reminderLeadMinutes = envNumber('REMINDER_LEAD_MINUTES', 1440);

/** OS IANA zone (e.g. Asia/Karachi). Used when REMINDER_TIMEZONE is empty, local, system, or auto. */
export function systemTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function resolveReminderTimezone(): string {
  const raw = env('REMINDER_TIMEZONE').toLowerCase();
  if (!raw || raw === 'local' || raw === 'system' || raw === 'auto') {
    return systemTimeZone();
  }
  return env('REMINDER_TIMEZONE');
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
  /** Fallback when Retell Test Audio does not send call.metadata (dashboard testing). */
  retellTestPatientId: env('RETELL_TEST_PATIENT_ID'),
  retellTestPatientEmail: env('RETELL_TEST_PATIENT_EMAIL', 'user1@mailinator.com'),
  twilioAccountSid: env('TWILIO_ACCOUNT_SID'),
  twilioAuthToken: env('TWILIO_AUTH_TOKEN'),
  twilioFromNumber: env('TWILIO_FROM_NUMBER'),
  /** Used when users.phone has no + (e.g. 10-digit US). Default 1. */
  twilioDefaultCountry: env('TWILIO_DEFAULT_COUNTRY', '1').replace(/^\+/, ''),
  /** CareHub Reminder agent — not the Talk to AI agent. */
  retellReminderAgentId: env('RETELL_REMINDER_AGENT_ID'),
  /** Retell-purchased From number for outbound reminder dials. */
  retellFromNumber: env('RETELL_FROM_NUMBER'),
  reminderEnabled: env('REMINDER_ENABLED', 'true') !== 'false',
  /** Fallback only when a hospital has no timezone and none can be inferred from its US address. */
  reminderTimezone: resolveReminderTimezone(),
  /** Minutes before visit start to dial. 1440 = 24h; use 1 or 5 for tests. */
  reminderLeadMinutes: reminderLeadMinutes,
  reminderWindowMinutes: envNumber(
    'REMINDER_WINDOW_MINUTES',
    reminderLeadMinutes >= 60 ? 60 : Math.max(1, reminderLeadMinutes),
  ),
  reminderPollMs: envNumber('REMINDER_POLL_MS', 600_000),
};
