-- ==========================================================
-- SIGNUP FIX — works with your CURRENT table (column is "name")
-- Copy ALL of this into Supabase → SQL Editor → Run
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_display_name TEXT;
  v_phone TEXT;
  v_role public.user_role;
BEGIN
  SET LOCAL row_security = off;

  v_display_name := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'User');
  v_phone := NULLIF(trim(NEW.raw_user_meta_data->>'phone'), '');
  v_role := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'role'), '')::public.user_role,
    'PATIENT'::public.user_role
  );

  -- Your table uses "name" (not full_name)
  INSERT INTO public.users (id, name, phone, role)
  VALUES (NEW.id, v_display_name, v_phone, v_role)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;

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
