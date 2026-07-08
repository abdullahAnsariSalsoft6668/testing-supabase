-- Fix users who have a doctors row but role is still PATIENT
UPDATE public.users u
SET role = 'DOCTOR'::public.user_role
FROM public.doctors d
WHERE d.user_id = u.id
  AND u.role = 'PATIENT'::public.user_role;

-- Allow users to update own role when completing doctor profile
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());
