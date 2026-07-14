import { Router, type Request, type Response } from 'express';
import Retell from 'retell-sdk';
import { config } from '../config';
import { verifyAccessToken } from '../services/supabase';

const router = Router();
const retell = new Retell({ apiKey: config.retellApiKey });

function bearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

router.post('/web', async (req: Request, res: Response) => {
  try {
    if (!config.retellApiKey || !config.retellAgentId) {
      return res.status(503).json({
        error: 'Retell is not configured. Set RETELL_API_KEY and RETELL_AGENT_ID.',
      });
    }

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

    const call = await retell.call.createWebCall({
      agent_id: config.retellAgentId,
      metadata: { patient_id: patientId },
      retell_llm_dynamic_variables: {
        patient_name: firstName,
        patient_id: patientId,
      },
    });

    return res.json({
      accessToken: call.access_token,
      callId: call.call_id,
      agentId: call.agent_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create web call';
    return res.status(500).json({ error: message });
  }
});

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    retellConfigured: Boolean(config.retellApiKey && config.retellAgentId),
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
  });
});

export default router;
