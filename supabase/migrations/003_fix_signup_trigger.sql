-- ==========================================================
-- Fix: "Database error saving new user" on signup
-- Run this in Supabase SQL Editor AFTER 002_backend_policies.sql
-- ==========================================================

-- 1) Robust trigger function (SECURITY DEFINER + search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, phone, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'User'),
    NEW.email,
    NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'role'), '')::public.user_role,
      'PATIENT'::public.user_role
    ),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'handle_new_user failed: %', SQLERRM;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) RLS: allow signup trigger insert (RLS blocks INSERT with no policy)
DROP POLICY IF EXISTS users_insert_signup ON public.users;
CREATE POLICY users_insert_signup ON public.users
  FOR INSERT
  WITH CHECK (true);

-- 3) Ensure table owner is not forced through RLS
ALTER TABLE public.users NO FORCE ROW LEVEL SECURITY;

-- 4) Grants used by Supabase Auth internals
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO postgres, service_role;
