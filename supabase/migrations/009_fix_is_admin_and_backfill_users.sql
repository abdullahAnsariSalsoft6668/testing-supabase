-- ==========================================================
-- Fix: is_admin() returns false even when role = ADMIN
-- Also backfills public.users for auth users missing a profile row
-- Run in Supabase SQL Editor
-- ==========================================================

-- 1) Backfill missing public.users rows (e.g. admin created in Auth dashboard)
INSERT INTO public.users (id, name, phone, role)
SELECT
  a.id,
  COALESCE(
    NULLIF(trim(a.raw_user_meta_data->>'full_name'), ''),
    NULLIF(split_part(a.email, '@', 1), ''),
    'User'
  ),
  NULLIF(trim(a.raw_user_meta_data->>'phone'), ''),
  COALESCE(
    NULLIF(trim(a.raw_user_meta_data->>'role'), '')::public.user_role,
    'PATIENT'::public.user_role
  )
FROM auth.users a
LEFT JOIN public.users u ON u.id = a.id
WHERE u.id IS NULL;

-- 2) is_admin() — SQL + SECURITY DEFINER (no SET LOCAL; STABLE functions cannot use SET)
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

-- 3) Users can always read their own row (app loads role on login)
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- 4) Set ADMIN — replace email, then run verify query below
-- UPDATE public.users u
-- SET role = 'ADMIN'::public.user_role
-- FROM auth.users a
-- WHERE u.id = a.id AND a.email = 'your-admin@email.com';

-- 5) Verify (should show role = ADMIN for your login email)
SELECT u.id, u.name, u.role, a.email
FROM public.users u
JOIN auth.users a ON a.id = u.id
ORDER BY u.created_at DESC;
