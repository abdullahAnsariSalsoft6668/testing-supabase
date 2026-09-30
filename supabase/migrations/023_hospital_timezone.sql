-- Per-hospital IANA timezone so reminder dials follow the clinic’s US state, not the Node server clock.
ALTER TABLE public.hospitals
  ADD COLUMN IF NOT EXISTS timezone TEXT;

COMMENT ON COLUMN public.hospitals.timezone IS
  'IANA zone (e.g. America/New_York, America/Chicago). Empty = infer from address or REMINDER_TIMEZONE.';
