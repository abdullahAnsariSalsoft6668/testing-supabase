import { config } from '../config.js';
import { isReminderConfigured, runReminderTick } from './reminders.js';

let timer: ReturnType<typeof setInterval> | null = null;
let running = false;

export function startReminderJob() {
  if (!config.reminderEnabled) {
    console.log('[reminder] job off (REMINDER_ENABLED=false)');
    return;
  }
  if (!isReminderConfigured()) {
    console.warn(
      '[reminder] job not started — set RETELL_API_KEY, RETELL_REMINDER_AGENT_ID, RETELL_FROM_NUMBER',
    );
    return;
  }

  const pollMs = Math.max(5_000, config.reminderPollMs);
  console.log(
    `[reminder] job on — every ${pollMs}ms, lead=${config.reminderLeadMinutes}m ±${config.reminderWindowMinutes}m, fallback=${config.reminderTimezone} (per-hospital timezone)`,
  );

  const tick = async () => {
    if (running) {
      console.warn('[reminder] tick still running — skip overlap');
      return;
    }
    running = true;
    try {
      await runReminderTick();
    } catch (err) {
      console.error('[reminder] tick crashed', err);
    } finally {
      running = false;
    }
  };

  void tick();
  timer = setInterval(() => void tick(), pollMs);
}

export function stopReminderJob() {
  if (timer) clearInterval(timer);
  timer = null;
}
