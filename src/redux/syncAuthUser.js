/**
 * Persists auth user + tokens (secureStorage + Redux) without importing `store` at module load
 * (avoids circular deps with RTK Query slices).
 *
 * @param {{ user?: Record<string, unknown>, token?: string, refreshToken?: string, emailFallback?: string }} payload
 */
export async function syncAuthUserPartial({
  user,
  token,
  refreshToken,
  emailFallback = '',
}) {
  const explicitToken =
    typeof token === 'string' ? token.replace(/^Bearer\s+/i, '').trim() : '';

  const hasRefresh =
    typeof refreshToken === 'string' &&
    refreshToken.replace(/^Bearer\s+/i, '').trim().length > 0;

  if (!user && !explicitToken && !hasRefresh) {
    return;
  }

  if (explicitToken && (!user || typeof user !== 'object' || Array.isArray(user))) {
    const {persistAccessTokenOnly} = await import('./actions/auth');
    await persistAccessTokenOnly(explicitToken);
    return;
  }

  if (explicitToken && user && typeof user === 'object' && !Array.isArray(user)) {
    const {loginSessionAction} = await import('./actions/auth');
    const refresh =
      typeof refreshToken === 'string'
        ? refreshToken.replace(/^Bearer\s+/i, '').trim()
        : '';

    const fullUser = {...user};
    if (emailFallback && !fullUser.email) {
      fullUser.email = emailFallback;
    }

    await loginSessionAction({
      user: fullUser,
      accessToken: explicitToken,
      refreshToken: refresh,
      selectedChild: null,
      setFirstTime: true,
    });
    return;
  }

  if (user && typeof user === 'object' && !Array.isArray(user)) {
    const {mergeAuthUserFromApi} = await import('./actions/auth');
    const u = {...user};
    if (emailFallback && !u.email) {
      u.email = emailFallback;
    }
    await mergeAuthUserFromApi(u);
  }
}
