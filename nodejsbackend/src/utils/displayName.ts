export function displayName(
  user: { full_name?: string | null; name?: string | null } | null | undefined,
  fallback = '',
): string {
  if (!user) return fallback;
  return user.full_name || user.name || fallback;
}
