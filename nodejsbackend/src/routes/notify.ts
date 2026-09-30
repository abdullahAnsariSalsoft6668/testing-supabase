import { Router, type Request, type Response } from 'express';
import { sendBookingConfirmationSms } from '../services/sms.js';
import { runReminderTick, sendReminderCall } from '../services/reminders.js';

const router = Router();

/**
 * POST /notify/booking-sms
 * Body: { appointmentId }
 * Fire-and-forget friendly: returns sent/skipped/error without failing the book flow.
 * Optional Bearer is accepted but not required (mobile/web may omit).
 */
router.post('/booking-sms', async (req: Request, res: Response) => {
  const appointmentId = String(req.body?.appointmentId ?? req.body?.appointment_id ?? '').trim();
  console.log('[notify] POST /notify/booking-sms', { appointmentId: appointmentId || null });

  if (!appointmentId) {
    console.warn('[notify] RESULT: 400 missing appointmentId');
    return res.status(400).json({ sent: false, error: 'appointmentId is required' });
  }

  const result = await sendBookingConfirmationSms(appointmentId);

  if (result.status === 'sent') {
    console.log('[notify] RESULT: sent=true', { appointmentId });
    return res.json({ sent: true, appointmentId });
  }

  console.log('[notify] RESULT: sent=false', {
    appointmentId,
    skipped: result.status === 'skipped',
    reason: result.reason,
  });
  return res.json({
    sent: false,
    skipped: result.status === 'skipped',
    reason: result.reason,
    appointmentId,
  });
});

/**
 * POST /notify/reminder-tick
 * Run one due-window scan (same rules as the background job).
 */
router.post('/reminder-tick', async (_req: Request, res: Response) => {
  console.log('[notify] POST /notify/reminder-tick');
  const summary = await runReminderTick();
  console.log('[notify] reminder-tick', {
    scanned: summary.scanned,
    due: summary.due,
    results: summary.results.length,
  });
  return res.json(summary);
});

/**
 * POST /notify/reminder-call
 * Body: { appointmentId, force? }
 * Dial now — ignores lead-time window. force=true redials after reminder_called_at is set.
 */
router.post('/reminder-call', async (req: Request, res: Response) => {
  const appointmentId = String(req.body?.appointmentId ?? req.body?.appointment_id ?? '').trim();
  const force =
    req.body?.force === true ||
    req.body?.force === 'true' ||
    String(req.query?.force ?? '') === 'true';
  console.log('[notify] POST /notify/reminder-call', { appointmentId: appointmentId || null, force });

  if (!appointmentId) {
    console.warn('[notify] RESULT: 400 missing appointmentId');
    return res.status(400).json({ sent: false, error: 'appointmentId is required' });
  }

  const result = await sendReminderCall(appointmentId, { force });

  if (result.status === 'sent') {
    console.log('[notify] reminder RESULT: sent=true', { appointmentId, callId: result.callId });
    return res.json({ sent: true, appointmentId, callId: result.callId, to: result.to });
  }

  console.log('[notify] reminder RESULT: sent=false', {
    appointmentId,
    skipped: result.status === 'skipped',
    reason: result.reason,
  });
  return res.json({
    sent: false,
    skipped: result.status === 'skipped',
    reason: result.reason,
    appointmentId,
  });
});

export default router;
