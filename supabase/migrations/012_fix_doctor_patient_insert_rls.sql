-- ==========================================================
-- Fix: "new row violates row-level security policy for table doctors"
-- (and patients) when completing profile
-- Run in Supabase SQL Editor
-- ==========================================================

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Doctors: read own + approved list + admin
DROP POLICY IF EXISTS doctors_select_own ON public.doctors;
CREATE POLICY doctors_select_own ON public.doctors
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR status = 'APPROVED'::public.doctor_status OR public.is_admin());

-- Doctors: create own profile on Complete Profile
DROP POLICY IF EXISTS doctors_insert_own ON public.doctors;
CREATE POLICY doctors_insert_own ON public.doctors
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Doctors: update own profile; admin can approve
DROP POLICY IF EXISTS doctors_update_own ON public.doctors;
CREATE POLICY doctors_update_own ON public.doctors
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Patients: read/update own
DROP POLICY IF EXISTS patients_select_own ON public.patients;
CREATE POLICY patients_select_own ON public.patients
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.appointments a
      JOIN public.doctors d ON d.id = a.doctor_id
      WHERE d.user_id = auth.uid() AND a.patient_id = patients.id
    )
  );

DROP POLICY IF EXISTS patients_insert_own ON public.patients;
CREATE POLICY patients_insert_own ON public.patients
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS patients_update_own ON public.patients;
CREATE POLICY patients_update_own ON public.patients
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Table grants (PostgREST uses authenticated role)
GRANT SELECT, INSERT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;
