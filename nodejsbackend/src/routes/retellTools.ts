import { Router, type Request, type Response } from 'express';
import { config } from '../config';
import { handleRetellTool, type RetellToolPayload } from '../services/retellToolHandlers';
import { verifyRetellSignature } from '../utils/verifyRetell';
import { formatErrorMessage } from '../utils/errors';

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

// async function runTool(req: Request, res: Response, toolName?: string) {
//   try {
//     const rawBody = (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);
//     const signature = req.headers['x-retell-signature'] as string | undefined;

//     if (config.verifyRetellSignature && config.retellApiKey) {
//       if (!verifyRetellSignature(rawBody, config.retellApiKey, signature)) {
//         return res.status(401).json({ error: 'Invalid Retell signature' });
//       }
//     }

//     const payload = normalizeRetellBody((req.body ?? {}) as Record<string, unknown>, toolName);
//     const args = payload.args ?? {};

//     const metaPatient = (payload.call?.metadata as Record<string, unknown> | undefined)?.patient_id;
//     const varsPatient = payload.call?.retell_llm_dynamic_variables?.patient_id;

//     console.log(
//       '[retell/tools]',
//       payload.name,
//       'args=',
//       JSON.stringify(args),
//       'hasCall=',
//       Boolean(payload.call),
//       'meta.patient_id=',
//       metaPatient ? String(metaPatient).slice(0, 8) + '…' : '(none)',
//       'vars.patient_id=',
//       varsPatient ? String(varsPatient).slice(0, 8) + '…' : '(none)',
//     );

//     const result = await handleRetellTool(payload);
//     const preview = result.length > 160 ? `${result.slice(0, 160)}…` : result;
//     console.log('[retell/tools]', payload.name, 'result=', preview);
//     return res.json({ result });
//   } catch (err) {
//     const message = formatErrorMessage(err);
//     console.error('[retell/tools]', message);
//     return res.status(200).json({ result: `Sorry, something went wrong: ${message}` });
//   }
// }

async function runTool(
  req: Request,
  res: Response,
  toolName?: string,
) {
  console.log('');
  console.log('==================================================');
  console.log('🔥🔥🔥 RETELL TOOL ENDPOINT HIT 🔥🔥🔥');
  console.log('==================================================');

  console.log('[retell/tools] Method:', req.method);
  console.log('[retell/tools] URL:', req.originalUrl);
  console.log(
    '[retell/tools] toolName:',
    toolName ?? '(none)',
  );

  try {
    // --------------------------------------------------
    // RAW REQUEST
    // --------------------------------------------------

    const rawBody =
      (req as Request & { rawBody?: string }).rawBody ??
      JSON.stringify(req.body);

    console.log(
      '[retell/tools] Body received:',
      JSON.stringify(req.body),
    );

    console.log(
      '[retell/tools] Raw body length:',
      rawBody?.length ?? 0,
    );

    // --------------------------------------------------
    // RETELL SIGNATURE
    // --------------------------------------------------

    const signature =
      req.headers['x-retell-signature'] as
        | string
        | undefined;

    console.log(
      '[retell/tools] Signature present:',
      Boolean(signature),
    );

    console.log(
      '[retell/tools] Signature verification enabled:',
      config.verifyRetellSignature,
    );

    // --------------------------------------------------
    // VERIFY RETELL SIGNATURE
    // --------------------------------------------------

    if (
      config.verifyRetellSignature &&
      config.retellApiKey
    ) {
      console.log(
        '[retell/tools] Verifying Retell signature...',
      );

      const valid = verifyRetellSignature(
        rawBody,
        config.retellApiKey,
        signature,
      );

      console.log(
        '[retell/tools] Signature valid:',
        valid,
      );

      if (!valid) {
        console.error(
          '[retell/tools] ❌ INVALID RETELL SIGNATURE',
        );

        return res.status(401).json({
          error: 'Invalid Retell signature',
        });
      }

      console.log(
        '[retell/tools] ✅ Retell signature verified',
      );
    } else {
      console.log(
        '[retell/tools] Signature verification skipped',
      );
    }

    // --------------------------------------------------
    // NORMALIZE RETELL BODY
    // --------------------------------------------------

    console.log(
      '[retell/tools] Normalizing Retell body...',
    );

    const payload = normalizeRetellBody(
      (req.body ?? {}) as Record<string, unknown>,
      toolName,
    );

    console.log(
      '[retell/tools] Normalized tool name:',
      payload.name,
    );

    console.log(
      '[retell/tools] Normalized args:',
      JSON.stringify(payload.args ?? {}),
    );

    console.log(
      '[retell/tools] Call object exists:',
      Boolean(payload.call),
    );

    const args = payload.args ?? {};

    // --------------------------------------------------
    // PATIENT INFORMATION
    // --------------------------------------------------

    const metaPatient = (
      payload.call?.metadata as
        | Record<string, unknown>
        | undefined
    )?.patient_id;

    const varsPatient =
      payload.call
        ?.retell_llm_dynamic_variables
        ?.patient_id;

    console.log(
      '[retell/tools] meta.patient_id:',
      metaPatient
        ? String(metaPatient).slice(0, 8) + '…'
        : '(none)',
    );

    console.log(
      '[retell/tools] vars.patient_id:',
      varsPatient
        ? String(varsPatient).slice(0, 8) + '…'
        : '(none)',
    );

    // --------------------------------------------------
    // CALL MAIN TOOL HANDLER
    // --------------------------------------------------

    console.log(
      '[retell/tools] 🚀 Calling handleRetellTool...',
    );

    const result = await handleRetellTool(payload);

    console.log(
      '[retell/tools] ✅ handleRetellTool completed',
    );

    console.log(
      '[retell/tools] Result length:',
      result.length,
    );

    const preview =
      result.length > 160
        ? `${result.slice(0, 160)}…`
        : result;

    console.log(
      '[retell/tools] Result preview:',
      preview,
    );

    // --------------------------------------------------
    // RETURN TO RETELL
    // --------------------------------------------------

    console.log(
      '[retell/tools] Sending response to Retell...',
    );

    const response = {
      result,
    };

    console.log(
      '[retell/tools] Response:',
      JSON.stringify(response),
    );

    console.log(
      '[retell/tools] ✅ TOOL REQUEST COMPLETE',
    );

    return res.json(response);
  } catch (err) {
    const message = formatErrorMessage(err);

    console.error('');
    console.error(
      '[retell/tools] ❌ TOOL REQUEST FAILED',
    );
    console.error(
      '[retell/tools] Error:',
      err,
    );
    console.error(
      '[retell/tools] Message:',
      message,
    );

    // Important:
    // Retell receives HTTP 200 with an error message
    // so the agent can respond naturally.
    return res.status(200).json({
      result: `Sorry, something went wrong: ${message}`,
    });
  } finally {
    console.log(
      '[retell/tools] END',
    );
    console.log(
      '==================================================',
    );
    console.log('');
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
