-- Quick fix if 009 failed with "SET is not allowed in a non-volatile function"
-- Run this alone in Supabase SQL Editor

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
