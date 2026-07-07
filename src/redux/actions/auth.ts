import type { AuthUserProfile } from '@/models/auth.types';
import { fetchFullProfile, fetchUserById } from '@/services/userService';
import { getSession, signOut as supabaseSignOut } from '@/services/authService';
import { secureStorage } from '@/utils/secureStorage';
import {
    changeFirstTime,
    clearData,
    hydrateAuth,
    saveAuthToken,
    saveRefreshToken,
    saveUserData,
} from '../reducers/auth';

async function getDispatch() {
    const { default: store } = await import('../store');
    return store.dispatch;
}

export type LoginSessionPayload = {
    user: AuthUserProfile;
    accessToken: string;
    refreshToken?: string;
    setFirstTime?: boolean;
};

export const loginSessionAction = async ({
    user,
    accessToken,
    refreshToken = '',
    setFirstTime = false,
}: LoginSessionPayload) => {
    const dispatch = await getDispatch();
    const token = String(accessToken ?? '').trim();
    const refresh = String(refreshToken ?? '').trim();

    await secureStorage.setItem('USER_DATA', JSON.stringify(user));
    await secureStorage.setItem('AUTH_TOKEN', token);
    await secureStorage.setItem('REFRESH_TOKEN', refresh);

    if (setFirstTime) {
        await secureStorage.setItem('IS_FIRST_TIME', 'true');
        dispatch(changeFirstTime(true));
    }

    dispatch(saveUserData(user));
    dispatch(saveAuthToken(token));
    dispatch(saveRefreshToken(refresh));
};

export const syncAuthFromSupabase = async () => {
    try {
        const session = await getSession();
        if (!session?.user) {
            const dispatch = await getDispatch();
            dispatch(clearData());
            return null;
        }

        const metadata = session.user.user_metadata ?? {};
        let profile: Awaited<ReturnType<typeof fetchFullProfile>> = null;
        let userRow: Awaited<ReturnType<typeof fetchUserById>> = null;

        try {
            profile = await fetchFullProfile(session.user.id);
        } catch (profileError) {
            console.warn('[Auth] fetchFullProfile failed:', profileError);
        }

        if (!profile) {
            try {
                userRow = await fetchUserById(session.user.id);
            } catch (userError) {
                console.warn('[Auth] fetchUserById failed:', userError);
            }
        }

        const authUser: AuthUserProfile = profile
            ? {
                  id: profile.id,
                  full_name: profile.full_name,
                  email: profile.email ?? session.user.email ?? '',
                  phone: profile.phone ?? undefined,
                  role: profile.role,
                  profile_image: profile.profile_image ?? undefined,
                  patient_id: profile.patient_id,
                  doctor_id: profile.doctor_id,
                  doctor_status: profile.doctor?.status,
                  profileComplete: profile.profileComplete,
                  patient: profile.patient,
                  doctor: profile.doctor,
              }
            : userRow
              ? {
                    id: userRow.id,
                    full_name: userRow.full_name,
                    email: session.user.email ?? '',
                    phone: userRow.phone ?? undefined,
                    role: userRow.role,
                    profile_image: userRow.profile_image ?? undefined,
                    profileComplete: userRow.role === 'ADMIN',
                }
              : {
                    id: session.user.id,
                    full_name: String(metadata.full_name ?? metadata.name ?? ''),
                    email: session.user.email ?? '',
                    phone: metadata.phone ? String(metadata.phone) : undefined,
                    role: (metadata.role as AuthUserProfile['role']) ?? 'PATIENT',
                    profileComplete: false,
                };

        await loginSessionAction({
            user: authUser,
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
        });

        return authUser;
    } catch (error) {
        console.warn('[Auth] syncAuthFromSupabase failed:', error);
        return null;
    }
};

export const hydrateAuthFromSecureStorage = async () => {
    await syncAuthFromSupabase();
};

export const clearDataAction = async () => {
    try {
        await supabaseSignOut();
    } catch {
        // ignore sign-out errors during local cleanup
    }
    const dispatch = await getDispatch();
    await secureStorage.clearAll();
    await secureStorage.setItem('IS_FIRST_TIME', 'false');
    dispatch(clearData());
};

export const completeOnboardingAction = async () => {
    const dispatch = await getDispatch();
    await secureStorage.setItem('IS_FIRST_TIME', 'false');
    dispatch(changeFirstTime(false));
};

export const mergeAuthUserFromApi = async (partialUser: AuthUserProfile) => {
    const { default: store } = await import('../store');
    const dispatch = store.dispatch;
    const prev = store.getState().auth.userData as AuthUserProfile;
    const merged: AuthUserProfile = { ...prev, ...partialUser };
    await secureStorage.setItem('USER_DATA', JSON.stringify(merged));
    dispatch(saveUserData(merged));
};

/** Legacy RTK Query helper — persists token only when user payload is missing. */
export const persistAccessTokenOnly = async (accessToken: string) => {
    const dispatch = await getDispatch();
    const token = String(accessToken ?? '').trim();
    if (!token) return;
    await secureStorage.setItem('AUTH_TOKEN', token);
    dispatch(saveAuthToken(token));
};

export const changeFirstTimeState = (isFirstTime: boolean) => {
    secureStorage.setItem('IS_FIRST_TIME', isFirstTime.toString()).then(async () => {
        const dispatch = await getDispatch();
        dispatch(changeFirstTime(isFirstTime));
    });
};

/** @deprecated Prefer syncAuthFromSupabase. Restores legacy secure-storage hydration. */
export const hydrateAuthFromSecureStorageLegacy = async () => {
    const dispatch = await getDispatch();
    const token = await secureStorage.getItem('AUTH_TOKEN');
    if (!token) return;

    const userRaw = await secureStorage.getItem('USER_DATA');
    const refresh = (await secureStorage.getItem('REFRESH_TOKEN')) ?? '';

    let userData: AuthUserProfile = {} as AuthUserProfile;
    try {
        userData = userRaw ? (JSON.parse(userRaw) as AuthUserProfile) : ({} as AuthUserProfile);
    } catch {
        userData = {} as AuthUserProfile;
    }

    dispatch(
        hydrateAuth({
            userData,
            auth_token: token,
            refresh_token: refresh,
        }),
    );
};
