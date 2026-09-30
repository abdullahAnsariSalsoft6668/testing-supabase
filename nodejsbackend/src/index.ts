import express from 'express';
import cors from 'cors';
import { config } from './config';
import { patientExists } from './services/patients';
import callsRouter from './routes/calls';
import retellToolsRouter from './routes/retellTools';
import voiceRouter from './routes/voice';
import notifyRouter from './routes/notify';
import { startReminderJob } from './services/reminderJob';
import { isReminderConfigured } from './services/reminders';

const app = express();

const corsOrigins =
  config.corsOrigins === '*'
    ? true
    : config.corsOrigins.split(',').map((o) => o.trim()).filter(Boolean);

app.use(cors({ origin: corsOrigins }));

// Retell tool webhooks need raw body for signature verification
app.use(
  '/retell/tools',
  express.json({
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: string }).rawBody = buf.toString('utf8');
    },
  }),
  retellToolsRouter,
);

app.use(express.json());
app.use('/voice', voiceRouter);
app.use('/calls', callsRouter);
app.use('/notify', notifyRouter);

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    retellConfigured: Boolean(config.retellApiKey && config.retellAgentId),
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
    supabaseUsesServiceRole: config.supabaseUsesServiceRole,
    retellTestPatientId: Boolean(config.retellTestPatientId),
    retellTestPatientEmail: Boolean(config.retellTestPatientEmail),
    twilioConfigured: Boolean(
      config.twilioAccountSid && config.twilioAuthToken && config.twilioFromNumber,
    ),
    reminderConfigured: isReminderConfigured(),
    reminderEnabled: config.reminderEnabled,
    reminderLeadMinutes: config.reminderLeadMinutes,
    reminderWindowMinutes: config.reminderWindowMinutes,
    reminderTimezone: config.reminderTimezone,
  });
});

app.listen(config.port, '0.0.0.0', async () => {
  console.log(`Node backend running on http://0.0.0.0:${config.port}`);
  console.log(`Health: http://localhost:${config.port}/health`);
  const twilioOk = Boolean(
    config.twilioAccountSid && config.twilioAuthToken && config.twilioFromNumber,
  );
  if (twilioOk) {
    const from = config.twilioFromNumber;
    const masked = from.length > 4 ? `***${from.slice(-4)}` : '****';
    console.log(`[sms] Twilio ready (from ${masked}) — booking SMS enabled`);
  } else {
    const missing = [
      !config.twilioAccountSid && 'TWILIO_ACCOUNT_SID',
      !config.twilioAuthToken && 'TWILIO_AUTH_TOKEN',
      !config.twilioFromNumber && 'TWILIO_FROM_NUMBER',
    ].filter(Boolean);
    console.warn(`[sms] Twilio NOT ready — SMS will be skipped. Missing: ${missing.join(', ')}`);
  }
  if (config.retellTestPatientId) {
    try {
      const ok = await patientExists(config.retellTestPatientId);
      if (ok) {
        console.log(
          `[retell] Test Audio fallback patient OK (${config.retellTestPatientId.slice(0, 8)}…)`,
        );
      } else {
        console.warn(
          `[retell] RETELL_TEST_PATIENT_ID is NOT in patients table: ${config.retellTestPatientId}`,
        );
      }
    } catch (err) {
      console.warn('[retell] Could not verify test patient:', err);
    }
  } else if (config.retellTestPatientEmail) {
    console.log(
      `[retell] Test Audio fallback patient: email lookup → ${config.retellTestPatientEmail}`,
    );
  } else {
    console.log(
      '[retell] No test patient fallback — Retell Test Audio cannot book; use mobile app Talk to AI',
    );
  }
  startReminderJob();
  if (config.supabaseUrl && config.supabaseKey && !config.supabaseUsesServiceRole) {
    console.warn(
      '[warn] Supabase key is publishable/anon — RLS blocks most writes. ' +
        'Set SUPABASE_SERVICE_ROLE_KEY (secret) in nodejsbackend/.env for Retell booking. ' +
        'For list_doctors, run migration 021_retell_anon_read_approved_catalog.sql.',
    );
  }
});
