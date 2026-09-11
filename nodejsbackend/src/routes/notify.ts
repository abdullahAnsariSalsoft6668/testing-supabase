import { Router, type Request, type Response } from 'express';
import { sendBookingConfirmationSms } from '../services/sms.js';

const router = Router();

/**
 * POST /notify/booking-sms
 * Body: { appointmentId }
 * Fire-and-forget friendly: returns sent/skipped/error without failing the book flow.
 * Optional Bearer is accepted but not required (mobile/web may omit).
 */
router.post('/booking-sms', async (req: Request, res: Response) => {
  const appointmentId = String(req.body?.appointmentId ?? req.body?.appointment_id ?? '').trim();

  if (!appointmentId) {
    return res.status(400).json({ sent: false, error: 'appointmentId is required' });
  }

  const result = await sendBookingConfirmationSms(appointmentId);

  if (result.status === 'sent') {
    return res.json({ sent: true, appointmentId });
  }

  return res.json({
    sent: false,
    skipped: result.status === 'skipped',
    reason: result.reason,
    appointmentId,
  });
});

export default router;
