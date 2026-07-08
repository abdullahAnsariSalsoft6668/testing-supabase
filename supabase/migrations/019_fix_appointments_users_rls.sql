-- Fix doctor/patient appointment lists (embed on users blocked by RLS)
-- Run in Supabase SQL Editor after 018_fix_patients_rls_recursion.sql

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

CREATE OR REPLACE FUNCTION public.can_view_user_profile(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    target_user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.appointments a
      INNER JOIN public.doctors d ON d.id = a.doctor_id
      INNER JOIN public.patients p ON p.id = a.patient_id
      WHERE (d.user_id = auth.uid() AND p.user_id = target_user_id)
         OR (p.user_id = auth.uid() AND d.user_id = target_user_id)
    );
$$;

ALTER FUNCTION public.get_doctor_id_for_user(UUID) OWNER TO postgres;
ALTER FUNCTION public.get_patient_id_for_user(UUID) OWNER TO postgres;
ALTER FUNCTION public.can_view_user_profile(UUID) OWNER TO postgres;

-- Users: allow reading profiles for appointment counterparties
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated
  USING (public.can_view_user_profile(id));

-- Appointments
DROP POLICY IF EXISTS appointments_patient_select ON public.appointments;
DROP POLICY IF EXISTS appointments_select ON public.appointments;
DROP POLICY IF EXISTS appointments_patient_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_update ON public.appointments;

CREATE POLICY appointments_select ON public.appointments
  FOR SELECT TO authenticated
  USING (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
  );

CREATE POLICY appointments_insert ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = public.get_patient_id_for_user(auth.uid()));

CREATE POLICY appointments_update ON public.appointments
  FOR UPDATE TO authenticated
  USING (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
  );

GRANT SELECT, INSERT, UPDATE ON public.appointments TO authenticated;

NOTIFY pgrst, 'reload schema';
