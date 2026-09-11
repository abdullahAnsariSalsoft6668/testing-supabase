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

/** Require E.164 (+…) for Twilio; skip otherwise. */
export function normalizePhoneE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) return null;
    return `+${digits}`;
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

function getTwilioClient() {
  if (!config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber) {
    return null;
  }
  return twilio(config.twilioAccountSid, config.twilioAuthToken);
}

export async function sendSms(to: string, body: string): Promise<SmsSendResult> {
  const client = getTwilioClient();
  if (!client) {
    return { status: 'skipped', reason: 'Twilio not configured' };
  }

  const normalized = normalizePhoneE164(to);
  if (!normalized) {
    return { status: 'skipped', reason: 'Phone missing or not E.164 (+…)' };
  }

  try {
    const message = await client.messages.create({
      to: normalized,
      from: config.twilioFromNumber,
      body,
    });
    return { status: 'sent', to: normalized, sid: message.sid };
  } catch (err) {
    return { status: 'error', reason: formatErrorMessage(err) };
  }
}

/**
 * Load appointment + doctor name + patient phone, then send confirmation SMS.
 * Never throws — booking flows must not fail on SMS errors.
 */
export async function sendBookingConfirmationSms(appointmentId: string): Promise<SmsSendResult> {
  const id = appointmentId?.trim();
  if (!id) {
    console.warn('[sms] booking skip: missing appointmentId');
    return { status: 'skipped', reason: 'Missing appointmentId' };
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('appointments')
      .select(
        `
        id,
        appointment_date,
        appointment_time,
        status,
        patients ( users ( phone ) ),
        doctors ( users ( full_name, name ) )
      `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[sms] booking load failed:', id, formatErrorMessage(error));
      return { status: 'error', reason: formatErrorMessage(error) };
    }
    if (!data) {
      console.warn('[sms] booking skip: appointment not found', id);
      return { status: 'skipped', reason: 'Appointment not found' };
    }

    const patientUser = (data as { patients?: { users?: { phone?: string | null } | null } | null })
      .patients?.users;
    const doctorUser = (
      data as { doctors?: { users?: { full_name?: string | null; name?: string | null } | null } | null }
    ).doctors?.users;

    const phone = patientUser?.phone ?? null;
    const doctorName = displayName(doctorUser, 'Doctor');
    const body = buildBookingSmsBody({
      doctorName,
      date: String(data.appointment_date ?? ''),
      time: String(data.appointment_time ?? ''),
      status: String(data.status ?? 'PENDING'),
    });

    const result = await sendSms(phone ?? '', body);

    if (result.status === 'sent') {
      console.log('[sms] booking sent', { appointmentId: id, to: maskPhone(result.to), sid: result.sid });
    } else if (result.status === 'skipped') {
      console.warn('[sms] booking skipped', {
        appointmentId: id,
        to: phone ? maskPhone(phone) : null,
        reason: result.reason,
      });
    } else {
      console.error('[sms] booking error', {
        appointmentId: id,
        to: phone ? maskPhone(phone) : null,
        reason: result.reason,
      });
    }

    return result;
  } catch (err) {
    const reason = formatErrorMessage(err);
    console.error('[sms] booking unexpected error', { appointmentId: id, reason });
    return { status: 'error', reason };
  }
}
