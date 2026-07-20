/** Local calendar YYYY-MM-DD (not UTC — avoids off-by-one for PKT/etc). */
export function localISODate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addLocalDays(base: Date, days: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + days);
  return d;
}

/** Voice-friendly label: "today (Wednesday July 15)", "tomorrow (...)", or "Saturday July 18". */
export function formatVoiceDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;

  const date = new Date(y, m - 1, d);
  const today = localISODate();
  const tomorrow = localISODate(addLocalDays(new Date(), 1));
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  if (iso === today) return `today (${weekday} ${monthDay})`;
  if (iso === tomorrow) return `tomorrow (${weekday} ${monthDay})`;
  return `${weekday} ${monthDay}`;
}

/** True when user/agent wants an open calendar, not one specific day. */
export function isOpenDateQuery(text: string | undefined | null): boolean {
  if (text == null) return true;
  const t = text.trim().toLowerCase();
  if (!t) return true;
  return [
    'any',
    'all',
    'available',
    'availability',
    'days',
    'which days',
    'what days',
    'konse',
    'kaunse',
    'open',
    'upcoming',
    'next',
    'schedule',
  ].some((w) => t === w || t.includes(w));
}

export function parseDateInput(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (!t || isOpenDateQuery(t)) return null;

  const now = new Date();

  if (t.includes('today')) {
    return localISODate(now);
  }

  if (t.includes('tomorrow')) {
    return localISODate(addLocalDays(now, 1));
  }

  const iso = text.trim().match(/\d{4}-\d{2}-\d{2}/);
  return iso ? iso[0] : null;
}
