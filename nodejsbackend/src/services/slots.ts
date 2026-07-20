import { getSupabase } from './supabase.js';
import { addLocalDays, localISODate, parseDateInput } from '../utils/dates.js';

export type SlotOption = {
  index: number;
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  appointment_date?: string;
};

function mapSlots(
  rows: {
    id: string;
    start_time: string;
    end_time: string;
    appointment_date?: string;
  }[],
): SlotOption[] {
  return rows.slice(0, 8).map((s, i) => ({
    index: i + 1,
    id: s.id,
    label: `${String(s.start_time).slice(0, 5)} – ${String(s.end_time).slice(0, 5)}`,
    start_time: s.start_time,
    end_time: s.end_time,
    appointment_date: s.appointment_date,
  }));
}

export async function listAvailableSlots(doctorId: string, dateInput: string) {
  const date = parseDateInput(dateInput);
  if (!date) {
    throw new Error('Invalid date. Use today, tomorrow, YYYY-MM-DD, or ask for available days.');
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
    slots: mapSlots(data ?? []),
  };
}

/** Next AVAILABLE slots for a doctor from today through the next `days` days. */
export async function listUpcomingAvailableSlots(doctorId: string, days = 21) {
  const from = localISODate();
  const to = localISODate(addLocalDays(new Date(), days));

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('doctor_slots')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('status', 'AVAILABLE')
    .gte('appointment_date', from)
    .lte('appointment_date', to)
    .order('appointment_date')
    .order('start_time')
    .limit(12);

  if (error) throw error;

  const rows = data ?? [];
  return {
    from,
    to,
    slots: mapSlots(rows),
    dates: [...new Set(rows.map((r) => r.appointment_date as string))],
  };
}

/**
 * If a doctor has no upcoming slots, create simple morning slots for tomorrow
 * and the day after (dev/demo convenience).
 */
export async function ensureUpcomingDemoSlots(doctorId: string) {
  const upcoming = await listUpcomingAvailableSlots(doctorId, 14);
  if (upcoming.slots.length > 0) return upcoming;

  const supabase = getSupabase();
  const days = [1, 2];
  const inserts = days.flatMap((offset) => {
    const date = localISODate(addLocalDays(new Date(), offset));
    return [
      {
        doctor_id: doctorId,
        appointment_date: date,
        start_time: '09:00:00',
        end_time: '09:30:00',
        status: 'AVAILABLE' as const,
      },
      {
        doctor_id: doctorId,
        appointment_date: date,
        start_time: '10:00:00',
        end_time: '10:30:00',
        status: 'AVAILABLE' as const,
      },
      {
        doctor_id: doctorId,
        appointment_date: date,
        start_time: '11:00:00',
        end_time: '11:30:00',
        status: 'AVAILABLE' as const,
      },
    ];
  });

  const { error } = await supabase.from('doctor_slots').insert(inserts);
  if (error) throw error;

  return listUpcomingAvailableSlots(doctorId, 14);
}
