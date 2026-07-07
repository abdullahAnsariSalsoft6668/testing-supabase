-- ==========================================================
-- Fix: Admin cannot insert hospitals (RLS policy)
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

ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Hospitals: everyone reads, admin writes
DROP POLICY IF EXISTS hospitals_select_all ON public.hospitals;
CREATE POLICY hospitals_select_all ON public.hospitals
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS hospitals_admin_all ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_insert ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_update ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_delete ON public.hospitals;

CREATE POLICY hospitals_admin_insert ON public.hospitals
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY hospitals_admin_update ON public.hospitals
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY hospitals_admin_delete ON public.hospitals
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Departments: everyone reads, admin writes
DROP POLICY IF EXISTS departments_select_all ON public.departments;
CREATE POLICY departments_select_all ON public.departments
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS departments_admin_all ON public.departments;
DROP POLICY IF EXISTS departments_admin_insert ON public.departments;
DROP POLICY IF EXISTS departments_admin_update ON public.departments;
DROP POLICY IF EXISTS departments_admin_delete ON public.departments;

CREATE POLICY departments_admin_insert ON public.departments
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY departments_admin_update ON public.departments
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY departments_admin_delete ON public.departments
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Verify admin user — public.users has NO email column (use auth.users join):
-- SELECT u.id, u.name, u.phone, u.role, a.email
-- FROM public.users u
-- JOIN auth.users a ON a.id = u.id;

-- Set ADMIN by login email (from Supabase Authentication):
-- UPDATE public.users u
-- SET role = 'ADMIN'
-- FROM auth.users a
-- WHERE u.id = a.id AND a.email = 'admin@yourdomain.com';
