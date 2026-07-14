import { Router, type Request, type Response } from 'express';
import { config } from '../config';
import { handleRetellTool } from '../services/retellToolHandlers';
import { verifyRetellSignature } from '../utils/verifyRetell';

const router = Router();

type RetellToolBody = {
  name?: string;
  args?: Record<string, unknown>;
  call?: {
    metadata?: Record<string, unknown>;
    retell_llm_dynamic_variables?: Record<string, string>;
  };
};

async function runTool(req: Request, res: Response, toolName?: string) {
  try {
    const rawBody = (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
    const signature = req.headers['x-retell-signature'] as string | undefined;

    if (config.verifyRetellSignature && config.retellApiKey) {
      if (!verifyRetellSignature(rawBody, config.retellApiKey, signature)) {
        return res.status(401).json({ error: 'Invalid Retell signature' });
      }
    }

    const body = req.body as RetellToolBody;
    const payload: RetellToolBody = {
      ...body,
      name: toolName ?? body.name,
    };

    const result = await handleRetellTool(payload);
    return res.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tool execution failed';
    return res.status(200).json({ result: `Sorry, something went wrong: ${message}` });
  }
}

// Unified handler (Retell can POST here with name in body)
router.post('/', (req, res) => runTool(req, res));

// Per-tool endpoints (configure these URLs in Retell dashboard)
router.post('/list-doctors', (req, res) => runTool(req, res, 'list_doctors'));
router.post('/list-slots', (req, res) => runTool(req, res, 'list_slots'));
router.post('/book-appointment', (req, res) => runTool(req, res, 'book_appointment'));
router.post('/my-appointments', (req, res) => runTool(req, res, 'my_appointments'));
router.post('/cancel-appointment', (req, res) => runTool(req, res, 'cancel_appointment'));

export default router;
