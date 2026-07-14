export function parseDateInput(text: string): string | null {
  const t = text.trim().toLowerCase();
  const today = new Date();

  if (t.includes('today')) {
    return today.toISOString().split('T')[0];
  }

  if (t.includes('tomorrow')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  const iso = text.trim().match(/\d{4}-\d{2}-\d{2}/);
  return iso ? iso[0] : null;
}
