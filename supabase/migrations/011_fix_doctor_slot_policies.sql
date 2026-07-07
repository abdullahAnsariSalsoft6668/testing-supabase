-- Fix doctor slot insert RLS helper functions
-- Run in Supabase SQL Editor if Add Slot fails with RLS error

CREATE OR REPLACE FUNCTION public.get_doctor_id_for_user(uid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.doctors WHERE user_id = uid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_patient_id_for_user(uid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.patients WHERE user_id = uid LIMIT 1;
$$;

ALTER FUNCTION public.get_doctor_id_for_user(UUID) OWNER TO postgres;
ALTER FUNCTION public.get_patient_id_for_user(UUID) OWNER TO postgres;

DROP POLICY IF EXISTS slots_doctor_insert ON public.doctor_slots;
CREATE POLICY slots_doctor_insert ON public.doctor_slots
  FOR INSERT TO authenticated
  WITH CHECK (doctor_id = public.get_doctor_id_for_user(auth.uid()));

DROP POLICY IF EXISTS slots_doctor_update ON public.doctor_slots;
CREATE POLICY slots_doctor_update ON public.doctor_slots
  FOR UPDATE TO authenticated
  USING (doctor_id = public.get_doctor_id_for_user(auth.uid()));

DROP POLICY IF EXISTS slots_doctor_delete ON public.doctor_slots;
CREATE POLICY slots_doctor_delete ON public.doctor_slots
  FOR DELETE TO authenticated
  USING (doctor_id = public.get_doctor_id_for_user(auth.uid()));

-- Doctors need a row + APPROVED status to manage slots
-- UPDATE public.doctors SET status = 'APPROVED' WHERE user_id = 'YOUR_DOCTOR_USER_UUID';
