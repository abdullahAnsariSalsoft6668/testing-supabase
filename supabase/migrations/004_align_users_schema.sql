-- ==========================================================
-- Fix: column "full_name" of relation "users" does not exist
-- Your live public.users table schema differs from HMS schema.
-- Run this entire file in Supabase SQL Editor.
-- ==========================================================

-- 1) Ensure enums exist
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.doctor_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Rename common legacy column names -> full_name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN name TO full_name;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'display_name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN display_name TO full_name;
  END IF;
END $$;

-- Build full_name from first_name + last_name if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
    UPDATE public.users
    SET full_name = COALESCE(
      NULLIF(trim(full_name), ''),
      NULLIF(trim(concat_ws(' ', first_name, last_name)), ''),
      email,
      'User'
    )
    WHERE full_name IS NULL;
  END IF;
END $$;

-- 3) Add HMS columns if missing
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'PATIENT'::public.user_role;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Backfill required fields for any existing rows
UPDATE public.users
SET
  full_name = COALESCE(NULLIF(trim(full_name), ''), NULLIF(trim(email), ''), 'User'),
  role = COALESCE(role, 'PATIENT'::public.user_role),
  is_active = COALESCE(is_active, TRUE),
  created_at = COALESCE(created_at, now()),
  updated_at = COALESCE(updated_at, now())
WHERE full_name IS NULL OR role IS NULL OR is_active IS NULL OR created_at IS NULL OR updated_at IS NULL;

-- Enforce NOT NULL where HMS expects it (safe after backfill)
ALTER TABLE public.users ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN is_active SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.users ALTER COLUMN updated_at SET NOT NULL;

-- 4) Signup trigger (matches app metadata keys)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SET LOCAL row_security = off;

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

-- 5) RLS insert policy for signup
DROP POLICY IF EXISTS users_insert_signup ON public.users;
CREATE POLICY users_insert_signup ON public.users
  FOR INSERT
  WITH CHECK (true);

ALTER TABLE public.users NO FORCE ROW LEVEL SECURITY;
