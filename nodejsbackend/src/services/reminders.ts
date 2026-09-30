import Retell from 'retell-sdk';
import { config } from '../config.js';
import { displayName } from '../utils/displayName.js';
import { formatErrorMessage } from '../utils/errors.js';
import { resolveClinicTimeZone } from '../utils/timezone.js';
import { getSupabase } from './supabase.js';
import { normalizePhoneE164 } from './sms.js';

export type ReminderDialResult =
  | { status: 'sent'; appointmentId: string; to: string; callId?: string }
  | { status: 'skipped'; appointmentId?: string; reason: string }
  | { status: 'error'; appointmentId?: string; reason: string };

const REMINDABLE_STATUSES = ['PENDING', 'CONFIRMED'] as const;

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `***${digits.slice(-4)}`;
}

function logReminder(level: 'info' | 'warn' | 'error', title: string, extra?: Record<string, unknown>) {
  const line = extra ? `${title} ${JSON.stringify(extra)}` : title;
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export function isReminderConfigured(): boolean {
  return Boolean(config.retellApiKey && config.retellReminderAgentId && config.retellFromNumber);
}

function getTzOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(instant);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  let hour = Number(map.hour);
  if (hour === 24) hour = 0;
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    hour,
    Number(map.minute),
    Number(map.second),
  );
  return asUtc - instant.getTime();
}

/** Instant for a civil date+time in an IANA zone. */
export function zonedDateTimeToUtcMs(dateYmd: string, timeHms: string, timeZone: string): number | null {
  const [y, mo, d] = dateYmd.split('-').map(Number);
  const [h = 0, min = 0, sec = 0] = String(timeHms).slice(0, 8).split(':').map(Number);
  if (!y || !mo || !d) return null;
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, min, sec);
  let utc = wallAsUtc - getTzOffsetMs(new Date(wallAsUtc), timeZone);
  utc = wallAsUtc - getTzOffsetMs(new Date(utc), timeZone);
  return utc;
}

function formatVoiceAppointmentDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatVoiceAppointmentTime(time: string): string {
  const [hStr, minStr] = String(time).split(':');
  let h = Number(hStr);
  const min = Number(minStr) || 0;
  if (!Number.isFinite(h)) return String(time).slice(0, 5);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
}

function ymdInTimeZone(ms: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms));
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

type AppointmentRow = {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reminder_called_at?: string | null;
};

type ReminderContext = {
  appointment: AppointmentRow;
  phone: string;
  patientName: string;
  doctorName: string;
};

async function loadTimeZonesForAppointments(rows: AppointmentRow[]): Promise<Map<string, string>> {
  const tzByAppointment = new Map<string, string>();
  const doctorIds = [...new Set(rows.map((r) => r.doctor_id).filter(Boolean))] as string[];
  if (doctorIds.length === 0) {
    for (const row of rows) tzByAppointment.set(row.id, config.reminderTimezone);
    return tzByAppointment;
  }

  const supabase = getSupabase();
  const { data: doctors, error: doctorsError } = await supabase
    .from('doctors')
    .select('id, hospital_id')
    .in('id', doctorIds);
  if (doctorsError) {
    logReminder('warn', '[reminder] could not load doctors for timezone', {
      reason: formatErrorMessage(doctorsError),
    });
    for (const row of rows) tzByAppointment.set(row.id, config.reminderTimezone);
    return tzByAppointment;
  }

  const hospitalIds = [
    ...new Set((doctors ?? []).map((d) => d.hospital_id).filter(Boolean)),
  ] as string[];
  const hospitalById = new Map<string, { timezone?: string | null; address?: string | null }>();
  if (hospitalIds.length > 0) {
    const { data: hospitals, error: hospitalsError } = await supabase
      .from('hospitals')
      .select('id, timezone, address')
      .in('id', hospitalIds);
    if (hospitalsError) {
      logReminder('warn', '[reminder] could not load hospital timezones (run migration 023?)', {
        reason: formatErrorMessage(hospitalsError),
      });
    } else {
      for (const h of hospitals ?? []) {
        hospitalById.set(h.id, { timezone: h.timezone, address: h.address });
      }
    }
  }

  const hospitalIdByDoctor = new Map(
    (doctors ?? []).map((d) => [d.id as string, d.hospital_id as string | null]),
  );
  for (const row of rows) {
    const hospitalId = row.doctor_id ? hospitalIdByDoctor.get(row.doctor_id) : null;
    const hospital = hospitalId ? hospitalById.get(hospitalId) : undefined;
    tzByAppointment.set(
      row.id,
      resolveClinicTimeZone({
        hospitalTimezone: hospital?.timezone,
        hospitalAddress: hospital?.address,
      }),
    );
  }
  return tzByAppointment;
}

async function loadReminderContext(appointmentId: string): Promise<
  { ok: true; ctx: ReminderContext } | { ok: false; reason: string; appointment?: AppointmentRow }
> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select(
      'id, patient_id, doctor_id, appointment_date, appointment_time, status, reminder_called_at',
    )
    .eq('id', appointmentId)
    .maybeSingle();

  if (error) return { ok: false, reason: formatErrorMessage(error) };
  if (!data) return { ok: false, reason: 'Appointment not found' };

  const appointment = data as AppointmentRow;
  if (!REMINDABLE_STATUSES.includes(appointment.status as (typeof REMINDABLE_STATUSES)[number])) {
    return { ok: false, reason: `Status ${appointment.status} is not remindable`, appointment };
  }

  let phone: string | null = null;
  let patientName = 'there';
  if (appointment.patient_id) {
    const { data: patient } = await supabase
      .from('patients')
      .select('user_id')
      .eq('id', appointment.patient_id)
      .maybeSingle();
    if (patient?.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('phone, full_name, name')
        .eq('id', patient.user_id)
        .maybeSingle();
      phone = user?.phone ?? null;
      patientName = displayName(user, 'there');
    }
  }

  const e164 = normalizePhoneE164(phone);
  if (!e164) {
    return { ok: false, reason: 'Phone missing or not E.164 (+…)', appointment };
  }

  let doctorName = 'Doctor';
  if (appointment.doctor_id) {
    const { data: doctor } = await supabase
      .from('doctors')
      .select('user_id')
      .eq('id', appointment.doctor_id)
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

  return {
    ok: true,
    ctx: { appointment, phone: e164, patientName, doctorName },
  };
}

async function claimReminder(appointmentId: string, force: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (force) {
    const { error } = await supabase
      .from('appointments')
      .update({ reminder_called_at: new Date().toISOString(), reminder_call_id: null })
      .eq('id', appointmentId);
    if (error) {
      logReminder('error', '[reminder] claim force failed', {
        appointmentId,
        reason: formatErrorMessage(error),
      });
      return false;
    }
    return true;
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({ reminder_called_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .is('reminder_called_at', null)
    .select('id')
    .maybeSingle();

  if (error) {
    logReminder('error', '[reminder] claim failed', {
      appointmentId,
      reason: formatErrorMessage(error),
    });
    return false;
  }
  return Boolean(data?.id);
}

async function storeCallId(appointmentId: string, callId: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('appointments')
    .update({ reminder_call_id: callId })
    .eq('id', appointmentId);
  if (error) {
    logReminder('warn', '[reminder] could not store reminder_call_id', {
      appointmentId,
      reason: formatErrorMessage(error),
    });
  }
}

async function dialReminder(ctx: ReminderContext): Promise<ReminderDialResult> {
  const { appointment, phone, patientName, doctorName } = ctx;
  const retell = new Retell({ apiKey: config.retellApiKey });
  const dateLabel = formatVoiceAppointmentDate(String(appointment.appointment_date ?? ''));
  const timeLabel = formatVoiceAppointmentTime(String(appointment.appointment_time ?? ''));

  logReminder('info', '[reminder] Retell createPhoneCall…', {
    appointmentId: appointment.id,
    to: maskPhone(phone),
    from: maskPhone(config.retellFromNumber),
    agent: config.retellReminderAgentId.slice(0, 12) + '…',
  });

  try {
    const call = await retell.call.createPhoneCall({
      from_number: config.retellFromNumber,
      to_number: phone,
      override_agent_id: config.retellReminderAgentId,
      metadata: {
        patient_id: appointment.patient_id,
        appointment_id: appointment.id,
      },
      retell_llm_dynamic_variables: {
        patient_name: patientName,
        patient_id: appointment.patient_id,
        doctor_name: doctorName,
        appointment_date: dateLabel,
        appointment_time: timeLabel,
        appointment_id: appointment.id,
      },
    });

    const callId = call.call_id;
    if (callId) await storeCallId(appointment.id, callId);

    logReminder('info', '[reminder] RESULT: SUCCESS — outbound queued', {
      appointmentId: appointment.id,
      to: maskPhone(phone),
      callId,
    });
    return { status: 'sent', appointmentId: appointment.id, to: phone, callId };
  } catch (err) {
    const reason = formatErrorMessage(err);
    logReminder('error', '[reminder] RESULT: FAILED — Retell dial error', {
      appointmentId: appointment.id,
      to: maskPhone(phone),
      reason,
    });
    return { status: 'error', appointmentId: appointment.id, reason };
  }
}

/**
 * Dial one appointment now. Ignores the lead-time window.
 * force=true reclaims a row that already has reminder_called_at.
 */
export async function sendReminderCall(
  appointmentId: string,
  opts?: { force?: boolean },
): Promise<ReminderDialResult> {
  const id = appointmentId?.trim();
  console.log('');
  console.log(`[reminder] ---------- REMINDER CALL START ${id || '(no id)'} ----------`);

  if (!id) {
    logReminder('warn', '[reminder] RESULT: SKIPPED', { reason: 'Missing appointmentId' });
    return { status: 'skipped', reason: 'Missing appointmentId' };
  }
  if (!isReminderConfigured()) {
    const reason =
      'Reminder not configured (need RETELL_API_KEY, RETELL_REMINDER_AGENT_ID, RETELL_FROM_NUMBER)';
    logReminder('warn', '[reminder] RESULT: SKIPPED', { appointmentId: id, reason });
    return { status: 'skipped', appointmentId: id, reason };
  }

  const loaded = await loadReminderContext(id);
  if (!loaded.ok) {
    logReminder('warn', '[reminder] RESULT: SKIPPED', { appointmentId: id, reason: loaded.reason });
    return { status: 'skipped', appointmentId: id, reason: loaded.reason };
  }

  const already = loaded.ctx.appointment.reminder_called_at;
  if (already && !opts?.force) {
    const reason = 'Already reminded (pass force=true to redial)';
    logReminder('warn', '[reminder] RESULT: SKIPPED', { appointmentId: id, reason });
    return { status: 'skipped', appointmentId: id, reason };
  }

  const claimed = await claimReminder(id, Boolean(opts?.force));
  if (!claimed) {
    const reason = 'Could not claim reminder (already claimed or DB error)';
    logReminder('warn', '[reminder] RESULT: SKIPPED', { appointmentId: id, reason });
    return { status: 'skipped', appointmentId: id, reason };
  }

  const result = await dialReminder(loaded.ctx);
  console.log(`[reminder] ---------- REMINDER CALL END ${id} ----------`);
  console.log('');
  return result;
}

export async function runReminderTick(): Promise<{
  scanned: number;
  due: number;
  results: ReminderDialResult[];
}> {
  if (!config.reminderEnabled) {
    logReminder('info', '[reminder] tick skipped — REMINDER_ENABLED=false');
    return { scanned: 0, due: 0, results: [] };
  }
  if (!isReminderConfigured()) {
    logReminder('warn', '[reminder] tick skipped — not configured');
    return { scanned: 0, due: 0, results: [] };
  }

  const now = Date.now();
  const leadMs = config.reminderLeadMinutes * 60_000;
  const windowMs = config.reminderWindowMinutes * 60_000;
  const windowStart = now + leadMs - windowMs;
  const windowEnd = now + leadMs + windowMs;
  // Wide civil-date band so NY vs HI clinics on the same tick are both scanned.
  const fromDate = ymdInTimeZone(windowStart - 48 * 3600_000, 'UTC');
  const toDate = ymdInTimeZone(windowEnd + 48 * 3600_000, 'UTC');

  logReminder('info', '[reminder] tick start', {
    leadMinutes: config.reminderLeadMinutes,
    windowMinutes: config.reminderWindowMinutes,
    fallbackTimezone: config.reminderTimezone,
    dateRange: `${fromDate}…${toDate}`,
  });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select(
      'id, patient_id, doctor_id, appointment_date, appointment_time, status, reminder_called_at',
    )
    .in('status', [...REMINDABLE_STATUSES])
    .is('reminder_called_at', null)
    .gte('appointment_date', fromDate)
    .lte('appointment_date', toDate)
    .limit(200);

  if (error) {
    logReminder('error', '[reminder] tick query failed', { reason: formatErrorMessage(error) });
    return { scanned: 0, due: 0, results: [{ status: 'error', reason: formatErrorMessage(error) }] };
  }

  const rows = (data ?? []) as AppointmentRow[];
  const tzByAppointment = await loadTimeZonesForAppointments(rows);
  const due = rows.filter((row) => {
    const tz = tzByAppointment.get(row.id) ?? config.reminderTimezone;
    const start = zonedDateTimeToUtcMs(String(row.appointment_date), String(row.appointment_time), tz);
    return start != null && start >= windowStart && start <= windowEnd;
  });

  logReminder('info', '[reminder] tick candidates', {
    scanned: rows.length,
    due: due.length,
    zones: due.map((row) => ({
      appointmentId: row.id,
      timezone: tzByAppointment.get(row.id) ?? config.reminderTimezone,
    })),
  });

  const results: ReminderDialResult[] = [];
  for (const row of due) {
    results.push(await sendReminderCall(row.id));
  }
  return { scanned: rows.length, due: due.length, results };
}
