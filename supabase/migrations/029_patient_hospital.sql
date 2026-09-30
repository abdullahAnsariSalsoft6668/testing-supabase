-- Multi-tenant patients: each patient belongs to one hospital.
-- Run in Supabase SQL Editor after 028_hospital_admin_doctor_names.sql

ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS hospital_id UUID REFERENCES public.hospitals(id);

CREATE INDEX IF NOT EXISTS patients_hospital_id_idx ON public.patients (hospital_id);

-- Backfill from the patient's most recent appointment's doctor hospital
UPDATE public.patients p
SET hospital_id = sub.hospital_id
FROM (
  SELECT DISTINCT ON (a.patient_id)
    a.patient_id,
    d.hospital_id
  FROM public.appointments a
  INNER JOIN public.doctors d ON d.id = a.doctor_id
  WHERE d.hospital_id IS NOT NULL
  ORDER BY a.patient_id, a.appointment_date DESC
) sub
WHERE p.id = sub.patient_id
  AND p.hospital_id IS NULL;

CREATE OR REPLACE FUNCTION public.my_patient_hospital_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT hospital_id
  FROM public.patients
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

ALTER FUNCTION public.my_patient_hospital_id() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.my_patient_hospital_id() TO authenticated;

CREATE OR REPLACE FUNCTION public.prevent_patient_hospital_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND OLD.hospital_id IS NOT NULL
     AND NEW.hospital_id IS DISTINCT FROM OLD.hospital_id
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Hospital cannot be changed once assigned';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS patients_lock_hospital ON public.patients;
CREATE TRIGGER patients_lock_hospital
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_patient_hospital_change();

-- Hospital admin can read names of patients registered to their clinic
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
    )
    OR EXISTS (
      SELECT 1
      FROM public.patients p
      WHERE p.user_id = target_user_id
        AND p.hospital_id IS NOT NULL
        AND public.is_hospital_admin(p.hospital_id)
    );
$$;

ALTER FUNCTION public.can_view_user_profile(UUID) OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.can_view_user_profile(UUID) TO authenticated;

DROP POLICY IF EXISTS patients_select_own ON public.patients;
DROP POLICY IF EXISTS patients_insert_own ON public.patients;
DROP POLICY IF EXISTS patients_update_own ON public.patients;

CREATE POLICY patients_select_own ON public.patients
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.doctor_can_view_patient(id)
    OR public.is_hospital_admin(hospital_id)
  );

CREATE POLICY patients_insert_own ON public.patients
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND auth.uid() IS NOT NULL
    AND hospital_id IS NOT NULL
    AND public.hospital_is_approved(hospital_id)
  );

CREATE POLICY patients_update_own ON public.patients
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.is_hospital_admin(hospital_id)
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.is_hospital_admin(hospital_id)
  );

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

-- Patients only see approved doctors at their own hospital
DROP POLICY IF EXISTS doctors_select_own ON public.doctors;
CREATE POLICY doctors_select_own ON public.doctors
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.is_hospital_admin(hospital_id)
    OR (
      status = 'APPROVED'::public.doctor_status
      AND hospital_id IS NOT NULL
      AND public.hospital_is_approved(hospital_id)
      AND hospital_id IS NOT DISTINCT FROM public.my_patient_hospital_id()
    )
  );

-- Booking: patient can only book a doctor at the same hospital
DROP POLICY IF EXISTS appointments_insert ON public.appointments;
CREATE POLICY appointments_insert ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (
    patient_id = public.get_patient_id_for_user(auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.doctors d
      INNER JOIN public.patients p ON p.id = appointments.patient_id
      WHERE d.id = appointments.doctor_id
        AND d.status = 'APPROVED'::public.doctor_status
        AND p.hospital_id IS NOT NULL
        AND d.hospital_id = p.hospital_id
        AND public.hospital_is_approved(d.hospital_id)
    )
  );

NOTIFY pgrst, 'reload schema';
