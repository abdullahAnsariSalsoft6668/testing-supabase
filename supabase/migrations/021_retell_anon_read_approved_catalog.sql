-- ==========================================================
-- Fix: Retell / Node backend uses publishable (anon) key → 0 doctors
-- Dashboard shows APPROVED rows (service role); anon had no SELECT policy
-- (doctors_select is TO authenticated only after 012/013).
-- Run in Supabase SQL Editor if you don't apply migrations via CLI.
-- ==========================================================

-- Approved doctors: readable by anon (voice backend) + keep authenticated policy
DROP POLICY IF EXISTS doctors_select_approved_anon ON public.doctors;
CREATE POLICY doctors_select_approved_anon ON public.doctors
  FOR SELECT TO anon
  USING (status = 'APPROVED'::public.doctor_status);

GRANT SELECT ON public.doctors TO anon;

-- Hospitals / departments for list_doctors embeds
DROP POLICY IF EXISTS hospitals_select_anon ON public.hospitals;
CREATE POLICY hospitals_select_anon ON public.hospitals
  FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS departments_select_anon ON public.departments;
CREATE POLICY departments_select_anon ON public.departments
  FOR SELECT TO anon
  USING (true);

GRANT SELECT ON public.hospitals TO anon;
GRANT SELECT ON public.departments TO anon;

-- Slots for list_slots tool
DROP POLICY IF EXISTS slots_select_anon ON public.doctor_slots;
CREATE POLICY slots_select_anon ON public.doctor_slots
  FOR SELECT TO anon
  USING (true);

GRANT SELECT ON public.doctor_slots TO anon;

-- Doctor display names (users embed) for approved doctors
DROP POLICY IF EXISTS users_select_approved_doctors ON public.users;
CREATE POLICY users_select_approved_doctors ON public.users
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.doctors d
      WHERE d.user_id = users.id
        AND d.status = 'APPROVED'::public.doctor_status
    )
  );

GRANT SELECT ON public.users TO anon;

NOTIFY pgrst, 'reload schema';
