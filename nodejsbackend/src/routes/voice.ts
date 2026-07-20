import { Router, type Request, type Response } from 'express';
import { createVoiceSession } from '../services/voiceSession';
import { verifyAccessToken } from '../services/supabase';

const router = Router();

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

/** POST /voice/session — create Retell web call token for React Native WebRTC */
router.post('/session', async (req: Request, res: Response) => {
  try {
    const token = bearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authorization Bearer token required' });
    }

    await verifyAccessToken(token);

    const patientId = String(req.body?.patientId ?? req.body?.patient_id ?? '').trim();
    const firstName = String(req.body?.firstName ?? req.body?.first_name ?? 'there').trim();

    if (!patientId) {
      return res.status(400).json({ error: 'patientId is required' });
    }

    const session = await createVoiceSession({ patientId, firstName });

    return res.json(session);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create voice session';
    console.error('[voice/session]', message);
    const status =
      message.includes('not configured')
        ? 503
        : message.includes('Invalid or expired')
          ? 401
          : 500;
    return res.status(status).json({ error: message });
  }
});

export default router;
