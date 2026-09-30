-- Hospital self-apply + super-admin approval.
-- Keep users.role ADMIN as platform admin only.
-- Hospital operators are identified by hospital_members (app role HOSPITAL_ADMIN).
-- HOSPITAL_ADMIN is added to user_role for future use but is not written in this file
-- (Postgres cannot use a new enum value in the same transaction as ADD VALUE).

ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'HOSPITAL_ADMIN';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hospital_status') THEN
    CREATE TYPE public.hospital_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hospital_member_role') THEN
    CREATE TYPE public.hospital_member_role AS ENUM ('HOSPITAL_ADMIN');
  END IF;
END $$;

ALTER TABLE public.hospitals
  ADD COLUMN IF NOT EXISTS status public.hospital_status NOT NULL DEFAULT 'APPROVED'::public.hospital_status;

UPDATE public.hospitals
SET status = 'APPROVED'::public.hospital_status
WHERE status IS NULL;

CREATE TABLE IF NOT EXISTS public.hospital_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role public.hospital_member_role NOT NULL DEFAULT 'HOSPITAL_ADMIN'::public.hospital_member_role,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (hospital_id, user_id)
);

CREATE INDEX IF NOT EXISTS hospital_members_user_id_idx ON public.hospital_members (user_id);
CREATE INDEX IF NOT EXISTS hospitals_status_idx ON public.hospitals (status);

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

CREATE OR REPLACE FUNCTION public.my_hospital_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT hospital_id
  FROM public.hospital_members
  WHERE user_id = auth.uid()
  ORDER BY created_at ASC
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_hospital_admin(hid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT hid IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.hospital_members
    WHERE user_id = auth.uid()
      AND hospital_id = hid
      AND role = 'HOSPITAL_ADMIN'::public.hospital_member_role
  );
$$;

CREATE OR REPLACE FUNCTION public.hospital_is_approved(hid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hospitals
    WHERE id = hid AND status = 'APPROVED'::public.hospital_status
  );
$$;

CREATE OR REPLACE FUNCTION public.my_hospital_is_approved()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.hospital_is_approved(public.my_hospital_id());
$$;

ALTER FUNCTION public.is_admin() OWNER TO postgres;
ALTER FUNCTION public.my_hospital_id() OWNER TO postgres;
ALTER FUNCTION public.is_hospital_admin(UUID) OWNER TO postgres;
ALTER FUNCTION public.hospital_is_approved(UUID) OWNER TO postgres;
ALTER FUNCTION public.my_hospital_is_approved() OWNER TO postgres;

-- Signup: only PATIENT or DOCTOR from metadata (never ADMIN).
-- Do not insert hospitals here — that aborts Auth ("Database error saving new user").
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

CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'ADMIN'::public.user_role
     AND (OLD.role IS DISTINCT FROM 'ADMIN'::public.user_role)
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Cannot self-promote to ADMIN';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_role ON public.users;
CREATE TRIGGER protect_user_role
  BEFORE UPDATE OF role ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();

CREATE OR REPLACE FUNCTION public.protect_hospital_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only platform admin can change hospital status';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_hospital_status ON public.hospitals;
CREATE TRIGGER protect_hospital_status
  BEFORE UPDATE OF status ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.protect_hospital_status();

CREATE OR REPLACE FUNCTION public.apply_hospital(
  p_name TEXT,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_timezone TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  hid UUID;
BEGIN
  SET LOCAL row_security = off;
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF COALESCE(trim(p_name), '') = '' THEN
    RAISE EXCEPTION 'Hospital name is required';
  END IF;
  IF EXISTS (SELECT 1 FROM public.hospital_members WHERE user_id = uid) THEN
    RAISE EXCEPTION 'You already have a hospital application';
  END IF;

  INSERT INTO public.hospitals (name, email, phone, address, description, timezone, status)
  VALUES (
    trim(p_name),
    NULLIF(trim(p_email), ''),
    NULLIF(trim(p_phone), ''),
    NULLIF(trim(p_address), ''),
    NULLIF(trim(p_description), ''),
    NULLIF(trim(p_timezone), ''),
    'PENDING'::public.hospital_status
  )
  RETURNING id INTO hid;

  INSERT INTO public.hospital_members (hospital_id, user_id, role)
  VALUES (hid, uid, 'HOSPITAL_ADMIN'::public.hospital_member_role);

  RETURN jsonb_build_object('hospital_id', hid, 'status', 'PENDING');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_hospital_status(
  p_hospital_id UUID,
  p_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only platform admin can approve hospitals';
  END IF;
  IF p_status NOT IN ('APPROVED', 'REJECTED', 'SUSPENDED', 'PENDING') THEN
    RAISE EXCEPTION 'Invalid hospital status';
  END IF;
  UPDATE public.hospitals
  SET status = p_status::public.hospital_status
  WHERE id = p_hospital_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Hospital not found';
  END IF;
END;
$$;

ALTER FUNCTION public.apply_hospital(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) OWNER TO postgres;
ALTER FUNCTION public.set_hospital_status(UUID, TEXT) OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.apply_hospital(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_hospital_status(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_hospital_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_hospital_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hospital_is_approved(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.my_hospital_is_approved() TO authenticated;

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
        AND public.is_hospital_admin(d.hospital_id)
    );
$$;

ALTER FUNCTION public.can_view_user_profile(UUID) OWNER TO postgres;

ALTER TABLE public.hospital_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS hospital_members_select ON public.hospital_members;
CREATE POLICY hospital_members_select ON public.hospital_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

GRANT SELECT ON public.hospital_members TO authenticated;

-- Hospitals
DROP POLICY IF EXISTS hospitals_select_all ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_all ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_insert ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_update ON public.hospitals;
DROP POLICY IF EXISTS hospitals_admin_delete ON public.hospitals;
DROP POLICY IF EXISTS hospitals_select_anon ON public.hospitals;

CREATE POLICY hospitals_select_all ON public.hospitals
  FOR SELECT TO authenticated
  USING (
    status = 'APPROVED'::public.hospital_status
    OR public.is_admin()
    OR public.is_hospital_admin(id)
  );

CREATE POLICY hospitals_select_anon ON public.hospitals
  FOR SELECT TO anon
  USING (status = 'APPROVED'::public.hospital_status);

CREATE POLICY hospitals_admin_insert ON public.hospitals
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY hospitals_admin_update ON public.hospitals
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_hospital_admin(id))
  WITH CHECK (public.is_admin() OR public.is_hospital_admin(id));

CREATE POLICY hospitals_admin_delete ON public.hospitals
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- Departments
DROP POLICY IF EXISTS departments_select_all ON public.departments;
DROP POLICY IF EXISTS departments_admin_all ON public.departments;
DROP POLICY IF EXISTS departments_admin_insert ON public.departments;
DROP POLICY IF EXISTS departments_admin_update ON public.departments;
DROP POLICY IF EXISTS departments_admin_delete ON public.departments;
DROP POLICY IF EXISTS departments_select_anon ON public.departments;

CREATE POLICY departments_select_all ON public.departments
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR public.is_hospital_admin(hospital_id)
    OR public.hospital_is_approved(hospital_id)
  );

CREATE POLICY departments_select_anon ON public.departments
  FOR SELECT TO anon
  USING (public.hospital_is_approved(hospital_id));

CREATE POLICY departments_admin_insert ON public.departments
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  );

CREATE POLICY departments_admin_update ON public.departments
  FOR UPDATE TO authenticated
  USING (
    public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  )
  WITH CHECK (
    public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  );

CREATE POLICY departments_admin_delete ON public.departments
  FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  );

-- Doctors: public catalog only if doctor AND hospital are approved
DROP POLICY IF EXISTS doctors_select_own ON public.doctors;
DROP POLICY IF EXISTS doctors_select_approved_anon ON public.doctors;
DROP POLICY IF EXISTS doctors_admin_manage ON public.doctors;
DROP POLICY IF EXISTS doctors_insert_own ON public.doctors;
DROP POLICY IF EXISTS doctors_update_own ON public.doctors;

CREATE POLICY doctors_select_own ON public.doctors
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR public.is_hospital_admin(hospital_id)
    OR (
      status = 'APPROVED'::public.doctor_status
      AND (hospital_id IS NULL OR public.hospital_is_approved(hospital_id))
    )
  );

CREATE POLICY doctors_select_approved_anon ON public.doctors
  FOR SELECT TO anon
  USING (
    status = 'APPROVED'::public.doctor_status
    AND (hospital_id IS NULL OR public.hospital_is_approved(hospital_id))
  );

CREATE POLICY doctors_insert_own ON public.doctors
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND (hospital_id IS NULL OR public.hospital_is_approved(hospital_id))
  );

CREATE POLICY doctors_update_own ON public.doctors
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
    OR (public.is_hospital_admin(hospital_id) AND public.hospital_is_approved(hospital_id))
  );

-- Appointments: hospital admin sees their clinic
DROP POLICY IF EXISTS appointments_select ON public.appointments;
DROP POLICY IF EXISTS appointments_insert ON public.appointments;
DROP POLICY IF EXISTS appointments_update ON public.appointments;

CREATE POLICY appointments_select ON public.appointments
  FOR SELECT TO authenticated
  USING (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = appointments.doctor_id
        AND public.is_hospital_admin(d.hospital_id)
    )
  );

CREATE POLICY appointments_insert ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (patient_id = public.get_patient_id_for_user(auth.uid()));

CREATE POLICY appointments_update ON public.appointments
  FOR UPDATE TO authenticated
  USING (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = appointments.doctor_id
        AND public.is_hospital_admin(d.hospital_id)
        AND public.hospital_is_approved(d.hospital_id)
    )
  )
  WITH CHECK (
    patient_id = public.get_patient_id_for_user(auth.uid())
    OR doctor_id = public.get_doctor_id_for_user(auth.uid())
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = appointments.doctor_id
        AND public.is_hospital_admin(d.hospital_id)
        AND public.hospital_is_approved(d.hospital_id)
    )
  );

-- Anon slots: only approved hospitals
DROP POLICY IF EXISTS slots_select_anon ON public.doctor_slots;
CREATE POLICY slots_select_anon ON public.doctor_slots
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.doctors d
      WHERE d.id = doctor_slots.doctor_id
        AND d.status = 'APPROVED'::public.doctor_status
        AND (d.hospital_id IS NULL OR public.hospital_is_approved(d.hospital_id))
    )
  );

NOTIFY pgrst, 'reload schema';
