export function displayUserName(
  user?: { full_name?: string | null; name?: string | null; email?: string | null } | null,
  fallback = 'Doctor',
) {
  const value = user?.full_name || user?.name;
  if (value?.trim()) return value.trim();
  if (user?.email?.trim()) return user.email.trim();
  return fallback;
}
