-- Align public.patients with app profile fields (Complete Profile, PatientProfile)
-- Fixes: PGRST204 "Could not find the 'allergies' column of 'patients'"

ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Optional: notify PostgREST to reload schema (Supabase usually picks this up automatically)
NOTIFY pgrst, 'reload schema';
