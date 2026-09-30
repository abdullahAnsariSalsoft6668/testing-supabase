-- Patient "Choose your hospital" Continue button.
-- Run after 029_patient_hospital.sql (safe to re-run).

CREATE OR REPLACE FUNCTION public.join_patient_hospital(p_hospital_id UUID)
RETURNS public.patients
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  row public.patients;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_hospital_id IS NULL OR NOT public.hospital_is_approved(p_hospital_id) THEN
    RAISE EXCEPTION 'Choose an approved hospital';
  END IF;

  SELECT * INTO row FROM public.patients WHERE user_id = uid LIMIT 1;

  IF FOUND THEN
    IF row.hospital_id IS NOT NULL THEN
      IF row.hospital_id = p_hospital_id THEN
        RETURN row;
      END IF;
      RAISE EXCEPTION 'Hospital cannot be changed once assigned';
    END IF;
    UPDATE public.patients
    SET hospital_id = p_hospital_id
    WHERE id = row.id
    RETURNING * INTO row;
    RETURN row;
  END IF;

  INSERT INTO public.patients (user_id, hospital_id)
  VALUES (uid, p_hospital_id)
  RETURNING * INTO row;
  RETURN row;
END;
$$;

ALTER FUNCTION public.join_patient_hospital(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.join_patient_hospital(UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
