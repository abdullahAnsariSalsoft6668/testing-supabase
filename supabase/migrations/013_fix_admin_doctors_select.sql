-- ==========================================================
-- Fix: Admin cannot see PENDING doctors in Admin → Doctors
-- Run in Supabase SQL Editor
-- ==========================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'ADMIN'::public.user_role
  );
$$;

ALTER FUNCTION public.is_admin() OWNER TO postgres;

-- Doctors: own + approved public list + admin sees ALL (including PENDING)
DROP POLICY IF EXISTS doctors_select_own ON public.doctors;
CREATE POLICY doctors_select_own ON public.doctors
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR status = 'APPROVED'::public.doctor_status
    OR public.is_admin()
  );

DROP POLICY IF EXISTS doctors_admin_manage ON public.doctors;
CREATE POLICY doctors_admin_manage ON public.doctors
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin must read linked user rows in doctors list (users(*) embed)
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT ON public.users TO authenticated;

-- Verify admin + pending doctors exist:
-- SELECT d.id, d.specialization, d.status, u.name, a.email
-- FROM public.doctors d
-- JOIN public.users u ON u.id = d.user_id
-- JOIN auth.users a ON a.id = u.id
-- WHERE d.status = 'PENDING';
