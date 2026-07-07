-- ==========================================================
-- Set ADMIN role using login email (auth.users has email;
-- public.users uses: id, name, phone, role, profile_image, created_at)
-- ==========================================================

-- 1) List all users with login email
SELECT u.id, u.name, u.phone, u.role, a.email
FROM public.users u
JOIN auth.users a ON a.id = u.id
ORDER BY u.created_at DESC;

-- 2) Promote to ADMIN — replace email below
UPDATE public.users u
SET role = 'ADMIN'
FROM auth.users a
WHERE u.id = a.id
  AND a.email = 'admin@yourdomain.com';

-- 3) Confirm
SELECT u.id, u.name, u.role, a.email
FROM public.users u
JOIN auth.users a ON a.id = u.id
WHERE a.email = 'admin@yourdomain.com';
