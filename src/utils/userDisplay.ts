/** DB column may be `name`; app model uses `full_name`. */
export function getUserDisplayName(
    user?: { full_name?: string | null; name?: string | null } | null,
    fallback = 'User',
): string {
    const value = user?.full_name ?? user?.name;
    return value?.trim() ? value.trim() : fallback;
}
