import { Router, type Request, type Response } from 'express';
import { config } from '../config';
import { createVoiceSession } from '../services/voiceSession';
import { verifyAccessToken } from '../services/supabase';

const router = Router();

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

/** @deprecated Use POST /voice/session */
router.post('/web', async (req: Request, res: Response) => {
  console.log('createVoiceSession req -- new', req.body);
  try {
    const token = bearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Authorization Bearer token required' });
    }

    await verifyAccessToken(token);

    const patientId = String(req.body?.patientId ?? req.body?.patient_id ?? '').trim();
    const firstName = String(req.body?.firstName ?? req.body?.first_name ?? 'there').trim();

    if (!patientId) {
      console.log('createVoiceSession patientId -- new', patientId);
      return res.status(400).json({ error: 'patientId is required' });
    }

    console.log('createVoiceSession body -- new', patientId, firstName);
    const session = await createVoiceSession({ patientId, firstName });
    console.log('createVoiceSession session -- new', session);
    return res.json(session);
  } catch (err) {
    console.log('createVoiceSession err -- new', err);
    const message = err instanceof Error ? err.message : 'Failed to create web call';
    const status = message.includes('not configured') ? 503 : 500;
    return res.status(status).json({ error: message });
  }
});

router.get('/health', (_req, res) => {
  console.log('health -- new');
  res.json({
    status: 'ok',
    retellConfigured: Boolean(config.retellApiKey && config.retellAgentId),
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
  });
});

export default router;
