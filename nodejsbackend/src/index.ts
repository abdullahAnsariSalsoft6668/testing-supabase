import express from 'express';
import cors from 'cors';
import { config } from './config';
import callsRouter from './routes/calls';
import retellToolsRouter from './routes/retellTools';
import voiceRouter from './routes/voice';

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

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    retellConfigured: Boolean(config.retellApiKey && config.retellAgentId),
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
  });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Node backend running on http://0.0.0.0:${config.port}`);
  console.log(`Health: http://localhost:${config.port}/health`);
});
