-- ==========================================================
-- HMS Backend: RLS, Policies, Triggers, Storage, Seed
-- Steps 5-9
-- ==========================================================

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_doctor_id_for_user(uid UUID)
RETURNS UUID AS $$
  SELECT id FROM public.doctors WHERE user_id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_patient_id_for_user(uid UUID)
RETURNS UUID AS $$
  SELECT id FROM public.patients WHERE user_id = uid LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- updated_at triggers
DO $$ DECLARE t TEXT; BEGIN
  FOREACH t IN ARRAY ARRAY['users','patients','doctors','hospitals','departments','doctor_slots','appointments'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_%I_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER set_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
  END LOOP;
END $$;

-- Step 7: Auth trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: RLS Policies — users
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users FOR SELECT USING (id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users FOR UPDATE USING (id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS users_insert_signup ON public.users;
CREATE POLICY users_insert_signup ON public.users FOR INSERT WITH CHECK (true);

-- patients
DROP POLICY IF EXISTS patients_select_own ON public.patients;
CREATE POLICY patients_select_own ON public.patients FOR SELECT USING (
  user_id = auth.uid()
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM appointments a
    JOIN doctors d ON d.id = a.doctor_id
    WHERE d.user_id = auth.uid() AND a.patient_id = patients.id
  )
);
DROP POLICY IF EXISTS patients_insert_own ON public.patients;
CREATE POLICY patients_insert_own ON public.patients FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS patients_update_own ON public.patients;
CREATE POLICY patients_update_own ON public.patients FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- doctors
DROP POLICY IF EXISTS doctors_select_own ON public.doctors;
CREATE POLICY doctors_select_own ON public.doctors FOR SELECT USING (
  user_id = auth.uid() OR status = 'APPROVED' OR public.is_admin()
);
DROP POLICY IF EXISTS doctors_insert_own ON public.doctors;
CREATE POLICY doctors_insert_own ON public.doctors FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS doctors_update_own ON public.doctors;
CREATE POLICY doctors_update_own ON public.doctors FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- hospitals
DROP POLICY IF EXISTS hospitals_select_all ON public.hospitals;
CREATE POLICY hospitals_select_all ON public.hospitals FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS hospitals_admin_all ON public.hospitals;
CREATE POLICY hospitals_admin_all ON public.hospitals FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- departments
DROP POLICY IF EXISTS departments_select_all ON public.departments;
CREATE POLICY departments_select_all ON public.departments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS departments_admin_all ON public.departments;
CREATE POLICY departments_admin_all ON public.departments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- doctor_slots
DROP POLICY IF EXISTS slots_select_all ON public.doctor_slots;
CREATE POLICY slots_select_all ON public.doctor_slots FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS slots_doctor_insert ON public.doctor_slots;
CREATE POLICY slots_doctor_insert ON public.doctor_slots FOR INSERT WITH CHECK (
  doctor_id = public.get_doctor_id_for_user(auth.uid())
);
DROP POLICY IF EXISTS slots_doctor_update ON public.doctor_slots;
CREATE POLICY slots_doctor_update ON public.doctor_slots FOR UPDATE USING (
  doctor_id = public.get_doctor_id_for_user(auth.uid())
);
DROP POLICY IF EXISTS slots_doctor_delete ON public.doctor_slots;
CREATE POLICY slots_doctor_delete ON public.doctor_slots FOR DELETE USING (
  doctor_id = public.get_doctor_id_for_user(auth.uid())
);

-- appointments
DROP POLICY IF EXISTS appointments_patient_select ON public.appointments;
CREATE POLICY appointments_patient_select ON public.appointments FOR SELECT USING (
  patient_id = public.get_patient_id_for_user(auth.uid())
  OR doctor_id = public.get_doctor_id_for_user(auth.uid())
  OR public.is_admin()
);
DROP POLICY IF EXISTS appointments_patient_insert ON public.appointments;
CREATE POLICY appointments_patient_insert ON public.appointments FOR INSERT WITH CHECK (
  patient_id = public.get_patient_id_for_user(auth.uid())
);
DROP POLICY IF EXISTS appointments_update ON public.appointments;
CREATE POLICY appointments_update ON public.appointments FOR UPDATE USING (
  patient_id = public.get_patient_id_for_user(auth.uid())
  OR doctor_id = public.get_doctor_id_for_user(auth.uid())
  OR public.is_admin()
);

-- medical_reports
DROP POLICY IF EXISTS reports_patient_select ON public.medical_reports;
CREATE POLICY reports_patient_select ON public.medical_reports FOR SELECT USING (
  patient_id = public.get_patient_id_for_user(auth.uid())
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM appointments a
    JOIN doctors d ON d.id = a.doctor_id
    WHERE d.user_id = auth.uid() AND a.patient_id = medical_reports.patient_id
  )
);
DROP POLICY IF EXISTS reports_patient_insert ON public.medical_reports;
CREATE POLICY reports_patient_insert ON public.medical_reports FOR INSERT WITH CHECK (
  patient_id = public.get_patient_id_for_user(auth.uid())
  OR EXISTS (
    SELECT 1 FROM appointments a
    JOIN doctors d ON d.id = a.doctor_id
    WHERE d.user_id = auth.uid() AND a.patient_id = medical_reports.patient_id
  )
);

-- Step 8: Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('hospital-logos', 'hospital-logos', true),
  ('medical-reports', 'medical-reports', false),
  ('doctor-certificates', 'doctor-certificates', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS profile_images_select ON storage.objects;
CREATE POLICY profile_images_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'profile-images');
DROP POLICY IF EXISTS profile_images_insert ON storage.objects;
CREATE POLICY profile_images_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS hospital_logos_select ON storage.objects;
CREATE POLICY hospital_logos_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'hospital-logos');
DROP POLICY IF EXISTS hospital_logos_admin ON storage.objects;
CREATE POLICY hospital_logos_admin ON storage.objects FOR ALL TO authenticated USING (
  bucket_id = 'hospital-logos' AND public.is_admin()
) WITH CHECK (bucket_id = 'hospital-logos' AND public.is_admin());

DROP POLICY IF EXISTS medical_reports_select ON storage.objects;
CREATE POLICY medical_reports_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'medical-reports');
DROP POLICY IF EXISTS medical_reports_insert ON storage.objects;
CREATE POLICY medical_reports_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'medical-reports');

DROP POLICY IF EXISTS doctor_certs_select ON storage.objects;
CREATE POLICY doctor_certs_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'doctor-certificates' AND (
    (storage.foldername(name))[1] = public.get_doctor_id_for_user(auth.uid())::text OR public.is_admin()
  )
);
DROP POLICY IF EXISTS doctor_certs_insert ON storage.objects;
CREATE POLICY doctor_certs_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'doctor-certificates' AND (storage.foldername(name))[1] = public.get_doctor_id_for_user(auth.uid())::text
);

-- Step 9: Seed data (hospitals, departments — admin/doctors via auth separately)
INSERT INTO public.hospitals (name, email, phone, address, description) VALUES
  ('City General Hospital', 'info@citygeneral.com', '+1-555-0100', '123 Health Ave, New York', 'Full-service community hospital'),
  ('Metro Care Center', 'contact@metrocare.com', '+1-555-0200', '456 Wellness Blvd, Chicago', 'Specialized outpatient care')
ON CONFLICT DO NOTHING;

INSERT INTO public.departments (hospital_id, name, description)
SELECT h.id, d.name, d.description FROM public.hospitals h
CROSS JOIN (VALUES
  ('Cardiology', 'Heart and cardiovascular care'),
  ('Pediatrics', 'Child and adolescent medicine'),
  ('Orthopedics', 'Bone and joint specialists'),
  ('General Medicine', 'Primary care and diagnostics')
) AS d(name, description)
WHERE h.name = 'City General Hospital'
ON CONFLICT DO NOTHING;

INSERT INTO public.departments (hospital_id, name, description)
SELECT h.id, d.name, d.description FROM public.hospitals h
CROSS JOIN (VALUES
  ('Neurology', 'Brain and nervous system'),
  ('Dermatology', 'Skin conditions and treatment')
) AS d(name, description)
WHERE h.name = 'Metro Care Center'
ON CONFLICT DO NOTHING;
