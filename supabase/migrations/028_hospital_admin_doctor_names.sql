-- Hospital admin doctor requests: show the applicant's name.
-- doctors(*) loads, but users(*) was hidden because can_view_user_profile
-- only allowed self, platform admin, and appointment counterparties.

CREATE OR REPLACE FUNCTION public.can_view_user_profile(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    target_user_id = auth.uid()
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.appointments a
      INNER JOIN public.doctors d ON d.id = a.doctor_id
      INNER JOIN public.patients p ON p.id = a.patient_id
      WHERE (d.user_id = auth.uid() AND p.user_id = target_user_id)
         OR (p.user_id = auth.uid() AND d.user_id = target_user_id)
    )
    OR EXISTS (
      SELECT 1
      FROM public.doctors d
      WHERE d.user_id = target_user_id
        AND d.hospital_id IS NOT NULL
        AND public.is_hospital_admin(d.hospital_id)
    );
$$;

ALTER FUNCTION public.can_view_user_profile(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.can_view_user_profile(UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
