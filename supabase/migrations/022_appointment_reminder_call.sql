-- Track outbound 24h reminder calls so Node never double-dials.
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS reminder_called_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_call_id TEXT;

COMMENT ON COLUMN public.appointments.reminder_called_at IS
  'Set when Node claims a reminder dial (before Retell createPhoneCall).';
COMMENT ON COLUMN public.appointments.reminder_call_id IS
  'Retell call_id after a successful outbound reminder.';
