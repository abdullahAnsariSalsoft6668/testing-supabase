import { getSupabase } from './supabase.js';
import { parseDateInput } from '../utils/dates.js';

export async function listAvailableSlots(doctorId: string, dateInput: string) {
  const date = parseDateInput(dateInput);
  if (!date) {
    throw new Error('Invalid date. Use today, tomorrow, or YYYY-MM-DD.');
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('doctor_slots')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', date)
    .eq('status', 'AVAILABLE')
    .order('start_time');

  if (error) throw error;

  return {
    date,
    slots: (data ?? []).slice(0, 8).map((s, i) => ({
      index: i + 1,
      id: s.id,
      label: `${String(s.start_time).slice(0, 5)} – ${String(s.end_time).slice(0, 5)}`,
      start_time: s.start_time,
      end_time: s.end_time,
    })),
  };
}
