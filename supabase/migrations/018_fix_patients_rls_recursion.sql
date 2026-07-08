-- Fix: 42P17 "infinite recursion detected in policy for relation patients"
-- Cause: patients SELECT policy subquery on appointments → appointments RLS → patients again
-- Run in Supabase SQL Editor

-- SECURITY DEFINER helpers bypass RLS (no recursion)
CREATE OR REPLACE FUNCTION public.get_patient_id_for_user(uid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.patients WHERE user_id = uid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_doctor_id_for_user(uid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.doctors WHERE user_id = uid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.doctor_can_view_patient(p_patient_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.appointments a
    INNER JOIN public.doctors d ON d.id = a.doctor_id
    WHERE a.patient_id = p_patient_id
      AND d.user_id = auth.uid()
  );
$$;

ALTER FUNCTION public.get_patient_id_for_user(UUID) OWNER TO postgres;
ALTER FUNCTION public.get_doctor_id_for_user(UUID) OWNER TO postgres;
ALTER FUNCTION public.doctor_can_view_patient(UUID) OWNER TO postgres;

-- Drop ALL patients policies (including Supabase dashboard duplicates)
DROP POLICY IF EXISTS "Patients can view own profile" ON public.patients;
DROP POLICY IF EXISTS "Patients can update own profile" ON public.patients;
DROP POLICY IF EXISTS patients_select_own ON public.patients;
DROP POLICY IF EXISTS patients_insert_own ON public.patients;
DROP POLICY IF EXISTS patients_update_own ON public.patients;
DROP POLICY IF EXISTS patients_delete_own ON public.patients;
DROP POLICY IF EXISTS patients_admin_all ON public.patients;

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- SELECT: no direct subqueries on other RLS tables
CREATE POLICY patients_select_own ON public.patients
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.doctor_can_view_patient(id)
  );

CREATE POLICY patients_insert_own ON public.patients
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY patients_update_own ON public.patients
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;

NOTIFY pgrst, 'reload schema';
