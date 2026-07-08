-- Reliable doctor appointment reads (bypasses flaky RLS / embed issues)
-- Run in Supabase SQL Editor after 019_fix_appointments_users_rls.sql

CREATE OR REPLACE FUNCTION public.list_doctor_appointments(p_doctor_id UUID DEFAULT NULL)
RETURNS SETOF public.appointments
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT a.*
  FROM public.appointments a
  INNER JOIN public.doctors d ON d.id = a.doctor_id
  WHERE d.user_id = auth.uid()
    AND (p_doctor_id IS NULL OR a.doctor_id = p_doctor_id)
  ORDER BY a.appointment_date DESC, a.appointment_time DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_doctor_appointment(p_appointment_id UUID)
RETURNS public.appointments
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT a.*
  FROM public.appointments a
  INNER JOIN public.doctors d ON d.id = a.doctor_id
  WHERE a.id = p_appointment_id
    AND d.user_id = auth.uid()
  LIMIT 1;
$$;

ALTER FUNCTION public.list_doctor_appointments(UUID) OWNER TO postgres;
ALTER FUNCTION public.get_doctor_appointment(UUID) OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.list_doctor_appointments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_doctor_appointment(UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
