import { Router, type Request, type Response } from 'express';
import { config } from '../config';
import { handleRetellTool, type RetellToolPayload } from '../services/retellToolHandlers';
import { verifyRetellSignature } from '../utils/verifyRetell';

const router = Router();

/**
 * Retell sends either:
 * - { name, call, args }  (default)
 * - flat args only when "Payload: args only" is enabled
 */
function normalizeRetellBody(body: Record<string, unknown>, toolName?: string): RetellToolPayload {
  const hasWrapper = body.args != null || body.call != null || body.name != null;

  if (hasWrapper) {
    return {
      name: toolName ?? (typeof body.name === 'string' ? body.name : undefined),
      args: (body.args as Record<string, unknown>) ?? {},
      call: body.call as RetellToolPayload['call'],
    };
  }

  // Args-only payload: entire body is arguments
  const { name: _n, call: _c, args: _a, ...flatArgs } = body;
  return {
    name: toolName,
    args: flatArgs,
    call: undefined,
  };
}

async function runTool(req: Request, res: Response, toolName?: string) {
  try {
    const rawBody = (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
    const signature = req.headers['x-retell-signature'] as string | undefined;

    if (config.verifyRetellSignature && config.retellApiKey) {
      if (!verifyRetellSignature(rawBody, config.retellApiKey, signature)) {
        return res.status(401).json({ error: 'Invalid Retell signature' });
      }
    }

    const payload = normalizeRetellBody((req.body ?? {}) as Record<string, unknown>, toolName);
    console.log('[retell/tools]', payload.name, 'args=', JSON.stringify(payload.args ?? {}));

    const result = await handleRetellTool(payload);
    return res.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Tool execution failed';
    console.error('[retell/tools]', message);
    return res.status(200).json({ result: `Sorry, something went wrong: ${message}` });
  }
}

router.post('/', (req, res) => runTool(req, res));

router.post('/list-doctors', (req, res) => runTool(req, res, 'list_doctors'));
router.post('/list_doctors', (req, res) => runTool(req, res, 'list_doctors'));
router.post('/list-slots', (req, res) => runTool(req, res, 'list_slots'));
router.post('/list_slots', (req, res) => runTool(req, res, 'list_slots'));
router.post('/book-appointment', (req, res) => runTool(req, res, 'book_appointment'));
router.post('/book_appointment', (req, res) => runTool(req, res, 'book_appointment'));
router.post('/my-appointments', (req, res) => runTool(req, res, 'my_appointments'));
router.post('/my_appointments', (req, res) => runTool(req, res, 'my_appointments'));
router.post('/cancel-appointment', (req, res) => runTool(req, res, 'cancel_appointment'));
router.post('/cancel_appointment', (req, res) => runTool(req, res, 'cancel_appointment'));

export default router;
