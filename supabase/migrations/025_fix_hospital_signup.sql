-- Run this ALONE in the SQL Editor (do not paste 024 with it).
-- Hospital signup was failing because handle_new_user ran extra inserts inside
-- Auth's user-create transaction. This function only writes public.users.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_raw TEXT;
  v_role public.user_role;
  v_name TEXT;
  v_phone TEXT;
  v_name_col TEXT;
  v_has_email BOOLEAN;
  v_has_updated BOOLEAN;
  v_sql TEXT;
BEGIN
  SET LOCAL row_security = off;

  v_raw := lower(COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'role'), ''), 'patient'));
  IF v_raw = 'doctor' THEN
    v_role := 'DOCTOR'::public.user_role;
  ELSE
    v_role := 'PATIENT'::public.user_role;
  END IF;

  v_name := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'User');
  v_phone := NULLIF(trim(NEW.raw_user_meta_data->>'phone'), '');

  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'full_name'
    ) THEN 'full_name'
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'name'
    ) THEN 'name'
    ELSE NULL
  END INTO v_name_col;

  IF v_name_col IS NULL THEN
    RAISE EXCEPTION 'public.users has neither full_name nor name';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'email'
  ) INTO v_has_email;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updated_at'
  ) INTO v_has_updated;

  IF v_has_email THEN
    v_sql := format(
      'INSERT INTO public.users (id, %I, email, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         %I = EXCLUDED.%I,
         email = EXCLUDED.email,
         phone = EXCLUDED.phone,
         role = CASE
           WHEN public.users.role = %L::public.user_role THEN public.users.role
           ELSE EXCLUDED.role
         END%s',
      v_name_col,
      v_name_col,
      v_name_col,
      'ADMIN',
      CASE WHEN v_has_updated THEN ', updated_at = now()' ELSE '' END
    );
    EXECUTE v_sql USING NEW.id, v_name, NEW.email, v_phone, v_role;
  ELSE
    v_sql := format(
      'INSERT INTO public.users (id, %I, phone, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         %I = EXCLUDED.%I,
         phone = EXCLUDED.phone,
         role = CASE
           WHEN public.users.role = %L::public.user_role THEN public.users.role
           ELSE EXCLUDED.role
         END%s',
      v_name_col,
      v_name_col,
      v_name_col,
      'ADMIN',
      CASE WHEN v_has_updated THEN ', updated_at = now()' ELSE '' END
    );
    EXECUTE v_sql USING NEW.id, v_name, v_phone, v_role;
  END IF;

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.users TO postgres, service_role;
