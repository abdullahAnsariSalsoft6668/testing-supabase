-- Dropdown options for doctor apply: specializations & qualifications.
-- Platform admin can add global rows (hospital_id NULL).
-- Hospital admin can add rows for their clinic.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clinic_option_kind') THEN
    CREATE TYPE public.clinic_option_kind AS ENUM ('specialization', 'qualification');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.clinic_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  kind public.clinic_option_kind NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS clinic_options_unique_idx
  ON public.clinic_options (
    COALESCE(hospital_id, '00000000-0000-0000-0000-000000000000'::uuid),
    kind,
    lower(trim(name))
  );

CREATE INDEX IF NOT EXISTS clinic_options_hospital_kind_idx
  ON public.clinic_options (hospital_id, kind);

ALTER TABLE public.clinic_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clinic_options_select ON public.clinic_options;
CREATE POLICY clinic_options_select ON public.clinic_options
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR hospital_id IS NULL
    OR public.is_hospital_admin(hospital_id)
    OR public.hospital_is_approved(hospital_id)
  );

DROP POLICY IF EXISTS clinic_options_insert ON public.clinic_options;
CREATE POLICY clinic_options_insert ON public.clinic_options
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin()
    OR (
      hospital_id IS NOT NULL
      AND public.is_hospital_admin(hospital_id)
      AND public.hospital_is_approved(hospital_id)
    )
  );

DROP POLICY IF EXISTS clinic_options_delete ON public.clinic_options;
CREATE POLICY clinic_options_delete ON public.clinic_options
  FOR DELETE TO authenticated
  USING (
    public.is_admin()
    OR public.is_hospital_admin(hospital_id)
  );

GRANT SELECT, INSERT, DELETE ON public.clinic_options TO authenticated;
GRANT USAGE ON TYPE public.clinic_option_kind TO authenticated;

INSERT INTO public.clinic_options (hospital_id, kind, name)
SELECT NULL, v.k::public.clinic_option_kind, v.n
FROM (VALUES
  ('specialization', 'Cardiology'),
  ('specialization', 'Pediatrics'),
  ('specialization', 'Orthopedics'),
  ('specialization', 'Neurology'),
  ('specialization', 'Dermatology'),
  ('specialization', 'General Medicine'),
  ('specialization', 'ENT'),
  ('specialization', 'Gynecology'),
  ('qualification', 'MBBS'),
  ('qualification', 'MD'),
  ('qualification', 'DO'),
  ('qualification', 'MS'),
  ('qualification', 'FCPS'),
  ('qualification', 'FRCS'),
  ('qualification', 'BDS')
) AS v(k, n)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.clinic_options o
  WHERE o.hospital_id IS NULL
    AND o.kind::text = v.k
    AND lower(trim(o.name)) = lower(v.n)
);

NOTIFY pgrst, 'reload schema';
