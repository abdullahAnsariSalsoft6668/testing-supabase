-- ==========================================================
-- Fix signup for YOUR current public.users schema
-- (id, created_at, name, phone, role, profile_image)
-- Run in Supabase SQL Editor
-- ==========================================================

-- 1) Rename name -> full_name (app + trigger use full_name)
ALTER TABLE public.users RENAME COLUMN name TO full_name;

-- 2) Optional HMS columns (safe if already exist)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 3) Signup trigger — reads full_name from auth metadata, writes to full_name column
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SET LOCAL row_security = off;

  INSERT INTO public.users (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'User'),
    NEW.email,
    NULLIF(trim(NEW.raw_user_meta_data->>'phone'), ''),
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data->>'role'), '')::public.user_role,
      'PATIENT'::public.user_role
    )
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

DROP POLICY IF EXISTS users_insert_signup ON public.users;
CREATE POLICY users_insert_signup ON public.users
  FOR INSERT
  WITH CHECK (true);
