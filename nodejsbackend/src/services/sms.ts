import twilio from 'twilio';
import { config } from '../config.js';
import { getSupabase } from './supabase.js';
import { displayName } from '../utils/displayName.js';
import { formatErrorMessage } from '../utils/errors.js';

export type SmsSendResult =
  | { status: 'sent'; to: string; sid?: string }
  | { status: 'skipped'; reason: string }
  | { status: 'error'; reason: string };

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `***${digits.slice(-4)}`;
}

function logSms(level: 'info' | 'warn' | 'error', title: string, extra?: Record<string, unknown>) {
  const line = extra ? `${title} ${JSON.stringify(extra)}` : title;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

/** Turn stored phones into E.164 (+…) for Twilio. */
export function normalizePhoneE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
  }

  let digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 8 || digits.length > 15) return null;

  // Pakistan local: 03XX XXXXXXX
  if (digits.length === 11 && digits.startsWith('03')) {
    return `+92${digits.slice(1)}`;
  }
  // Already has PK / US country code without +
  if (digits.startsWith('92') && digits.length >= 12) return `+${digits}`;
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;

  // 10-digit national number → default country (1 = US)
  if (digits.length === 10) {
    const cc = config.twilioDefaultCountry || '1';
    return `+${cc}${digits}`;
  }

  return null;
}

function formatSmsDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatSmsTime(time: string): string {
  return String(time ?? '').slice(0, 5) || time;
}

function buildBookingSmsBody(params: {
  doctorName: string;
  date: string;
  time: string;
  status: string;
}): string {
  return [
    'CareHub: Your appointment is booked.',
    `Doctor: ${params.doctorName}`,
    `Date: ${formatSmsDate(params.date)}`,
    `Time: ${formatSmsTime(params.time)}`,
    `Status: ${params.status}`,
    'Open the app → My Visits for details.',
  ].join('\n');
}

/** Closest Twilio trial template for a booking confirmation. Custom bodies are blocked on trial. */
const TWILIO_TRIAL_BOOKING_TEMPLATE = 'sms_appointment_reminders';

function isTwilioTrialTemplateError(reason: string): boolean {
  const lower = reason.toLowerCase();
  return (
    lower.includes('invalid template name') ||
    lower.includes('predefined sms templates') ||
    lower.includes('trial accounts can only use')
  );
}

function getTwilioClient() {
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber) {
    return null;
  }
  return twilio(config.twilioAccountSid, config.twilioAuthToken);
}

export async function sendSms(to: string, body: string): Promise<SmsSendResult> {
  const client = getTwilioClient();
  if (!client) {
    const missing = [
      !config.twilioAccountSid && 'TWILIO_ACCOUNT_SID',
      !config.twilioAuthToken && 'TWILIO_AUTH_TOKEN',
      !config.twilioFromNumber && 'TWILIO_FROM_NUMBER',
    ].filter(Boolean);
    return { status: 'skipped', reason: `Twilio not configured (missing ${missing.join(', ') || 'env'})` };
  }

  const normalized = normalizePhoneE164(to);
  if (!normalized) {
    return { status: 'skipped', reason: 'Phone missing or not E.164 (+…)' };
  }

  const sendOnce = async (text: string, trialTemplate: boolean) => {
    logSms('info', '[sms] Twilio create…', {
      to: maskPhone(normalized),
      from: maskPhone(config.twilioFromNumber),
      chars: text.length,
      trialTemplate: trialTemplate || undefined,
    });
    return client.messages.create({
      to: normalized,
      from: config.twilioFromNumber,
      body: text,
    });
  };

  try {
    let message;
    try {
      message = await sendOnce(body, false);
    } catch (err) {
      const reason = formatErrorMessage(err);
      if (!isTwilioTrialTemplateError(reason)) throw err;
      logSms('warn', '[sms] Trial blocks custom body — retrying with Twilio template', {
        to: maskPhone(normalized),
        template: TWILIO_TRIAL_BOOKING_TEMPLATE,
      });
      message = await sendOnce(TWILIO_TRIAL_BOOKING_TEMPLATE, true);
    }
    logSms('info', '[sms] Twilio accepted', {
      sid: message.sid,
      status: message.status,
      to: maskPhone(normalized),
    });
    return { status: 'sent', to: normalized, sid: message.sid };
  } catch (err) {
    const reason = formatErrorMessage(err);
    logSms('error', '[sms] Twilio rejected', { to: maskPhone(normalized), reason });
    return { status: 'error', reason };
  }
}

/**
 * Load appointment + doctor name + patient phone, then send confirmation SMS.
 * Never throws — booking flows must not fail on SMS errors.
 */
export async function sendBookingConfirmationSms(appointmentId: string): Promise<SmsSendResult> {
  const id = appointmentId?.trim();
  console.log('');
  console.log(`[sms] ---------- BOOKING SMS START ${id || '(no id)'} ----------`);

  if (!id) {
    logSms('warn', '[sms] RESULT: SKIPPED', { reason: 'Missing appointmentId' });
    return { status: 'skipped', reason: 'Missing appointmentId' };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('appointments')
      .select('id, patient_id, doctor_id, appointment_date, appointment_time, status')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      const reason = formatErrorMessage(error);
      logSms('error', '[sms] RESULT: FAILED (load appointment)', { appointmentId: id, reason });
      return { status: 'error', reason };
    }
    if (!data) {
      logSms('warn', '[sms] RESULT: SKIPPED', { appointmentId: id, reason: 'Appointment not found' });
      return { status: 'skipped', reason: 'Appointment not found' };
    }

    let phone: string | null = null;
    if (data.patient_id) {
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('user_id')
        .eq('id', data.patient_id)
        .maybeSingle();
      if (patientError) {
        logSms('warn', '[sms] patient lookup failed', { reason: formatErrorMessage(patientError) });
      } else if (patient?.user_id) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('phone')
          .eq('id', patient.user_id)
          .maybeSingle();
        if (userError) {
          logSms('warn', '[sms] user phone lookup failed', { reason: formatErrorMessage(userError) });
        } else {
          phone = user?.phone ?? null;
        }
      }
    }

    let doctorName = 'Doctor';
    if (data.doctor_id) {
      const { data: doctor } = await supabase
        .from('doctors')
        .select('user_id')
        .eq('id', data.doctor_id)
        .maybeSingle();
      if (doctor?.user_id) {
        const { data: doctorUser } = await supabase
          .from('users')
          .select('full_name, name')
          .eq('id', doctor.user_id)
          .maybeSingle();
        doctorName = displayName(doctorUser, 'Doctor');
      }
    }

    const body = buildBookingSmsBody({
      doctorName,
      date: String(data.appointment_date ?? ''),
      time: String(data.appointment_time ?? ''),
      status: String(data.status ?? 'PENDING'),
    });

    logSms('info', '[sms] Loaded appointment', {
      appointmentId: id,
      doctor: doctorName,
      date: data.appointment_date,
      time: String(data.appointment_time ?? '').slice(0, 5),
      patientPhone: phone ? maskPhone(phone) : null,
      e164: Boolean(normalizePhoneE164(phone)),
    });

    const result = await sendSms(phone ?? '', body);

    if (result.status === 'sent') {
      logSms('info', '[sms] RESULT: SUCCESS — text queued by Twilio', {
        appointmentId: id,
        to: maskPhone(result.to),
        sid: result.sid,
      });
    } else if (result.status === 'skipped') {
      logSms('warn', '[sms] RESULT: SKIPPED — no SMS sent', {
        appointmentId: id,
        to: phone ? maskPhone(phone) : null,
        reason: result.reason,
      });
    } else {
      logSms('error', '[sms] RESULT: FAILED — Twilio or send error', {
        appointmentId: id,
        to: phone ? maskPhone(phone) : null,
        reason: result.reason,
      });
    }

    console.log(`[sms] ---------- BOOKING SMS END ${id} ----------`);
    console.log('');
    return result;
  } catch (err) {
    const reason = formatErrorMessage(err);
    logSms('error', '[sms] RESULT: FAILED (unexpected)', { appointmentId: id, reason });
    console.log(`[sms] ---------- BOOKING SMS END ${id} ----------`);
    console.log('');
    return { status: 'error', reason };
  }
}
