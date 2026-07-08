-- Fix: 42501 "new row violates row-level security policy for table patients"
-- Run in Supabase SQL Editor after 016_add_patient_profile_columns.sql
-- NOTE: If you see 42P17 infinite recursion, run 018_fix_patients_rls_recursion.sql instead.

-- Helper (used by appointments RLS)
CREATE OR REPLACE FUNCTION public.get_patient_id_for_user(uid UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id FROM public.patients WHERE user_id = uid LIMIT 1;
$$;

ALTER FUNCTION public.get_patient_id_for_user(UUID) OWNER TO postgres;

-- One patient profile per auth user
CREATE UNIQUE INDEX IF NOT EXISTS patients_user_id_unique ON public.patients (user_id);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Remove any legacy / conflicting policies
DROP POLICY IF EXISTS "Patients can view own profile" ON public.patients;
DROP POLICY IF EXISTS "Patients can update own profile" ON public.patients;
DROP POLICY IF EXISTS patients_select_own ON public.patients;
DROP POLICY IF EXISTS patients_insert_own ON public.patients;
DROP POLICY IF EXISTS patients_update_own ON public.patients;
DROP POLICY IF EXISTS patients_delete_own ON public.patients;
DROP POLICY IF EXISTS patients_admin_all ON public.patients;

-- SELECT: use SECURITY DEFINER helper (avoids recursion with appointments RLS)
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

ALTER FUNCTION public.doctor_can_view_patient(UUID) OWNER TO postgres;

CREATE POLICY patients_select_own ON public.patients
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.doctor_can_view_patient(id)
  );

-- INSERT: authenticated user creates own profile only
CREATE POLICY patients_insert_own ON public.patients
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND auth.uid() IS NOT NULL
  );

-- UPDATE: own row or admin
CREATE POLICY patients_update_own ON public.patients
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;

NOTIFY pgrst, 'reload schema';
