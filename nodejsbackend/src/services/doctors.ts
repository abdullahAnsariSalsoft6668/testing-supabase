import { getSupabase } from './supabase.js';
import { displayName } from '../utils/displayName.js';

export async function listApprovedDoctors(specialization?: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('doctors')
    .select('*, users(*), hospitals(*), departments(*)')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false });

  if (error) throw error;

  let rows = data ?? [];
  if (specialization?.trim()) {
    const q = specialization.trim().toLowerCase();
    rows = rows.filter(
      (d) =>
        displayName(d.users, '').toLowerCase().includes(q) ||
        (d.specialization ?? '').toLowerCase().includes(q) ||
        (d.departments?.name ?? '').toLowerCase().includes(q),
    );
  }

  return rows.slice(0, 8).map((d, i) => ({
    index: i + 1,
    id: d.id,
    name: displayName(d.users, 'Doctor'),
    specialization: d.specialization ?? '',
    hospital: d.hospitals?.name ?? '',
    department: d.departments?.name ?? '',
    label: `${displayName(d.users, 'Doctor')} — ${d.specialization ?? ''}`,
  }));
}
