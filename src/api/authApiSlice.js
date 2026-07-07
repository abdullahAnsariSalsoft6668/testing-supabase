import {createApi} from '@reduxjs/toolkit/query/react';
import {Platform} from 'react-native';
import {baseQuery} from './apiConfig';
import {registerPayloadToFormData} from './formData';
import {endpoints, reducers} from './configs';
import {LOG} from '@/utils/helperFunction';
import { devLog } from '@/utils/logger';

/** API may return `Bearer <jwt>`; store raw JWT so prepareHeaders can prefix once. */
function normalizeAuthToken(raw) {
  if (raw == null || typeof raw !== 'string') {
    return raw;
  }
  return raw.replace(/^Bearer\s+/i, '').trim();
}

const syncAuthFromResponse = async (queryFulfilled, arg = {}) => {
  try {
    const {data} = await queryFulfilled;
    if (!data?.token && !data?.user) {
      return;
    }
    const {syncAuthUserPartial} = await import('@/redux/syncAuthUser');
    await syncAuthUserPartial({
      user: data.user,
      token: data?.token,
      refreshToken: data?.refreshToken,
      emailFallback: arg?.email ?? '',
    });
  } catch {
    // Handled by caller / RTK Query error state
  }
};

export const authApi = createApi({
  reducerPath: reducers.path.auth,
  baseQuery,
  tagTypes: ['User'],
  endpoints: builder => ({
    login: builder.mutation({
      query: (arg = {}) => {
        const {
          meta: userMeta = {},
          email,
          password,
          deviceType,
          deviceToken,
        } = arg;
        devLog('arg-login', arg);
        LOG('deviceToken-login', deviceToken);
        const resolvedDeviceType =
          deviceType ??
          (Platform.OS === 'ios'
            ? 'ios'
            : Platform.OS === 'android'
              ? 'android'
              : 'web');
        return {
          url: endpoints.auth.login.url,
          method: endpoints.auth.login.method,
          body: {
            email,
            password,
            deviceType: resolvedDeviceType,
            deviceToken: deviceToken ?? '',
          },
          meta: userMeta,
        };
      },
      transformResponse: response => {
        if (response?.success === false || response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : response;
        const token = normalizeAuthToken(
          inner?.token ?? inner?.accessToken ?? response?.token,
        );
        const refreshToken = normalizeAuthToken(inner?.refreshToken);
        const rawUser =
          inner?.user && typeof inner.user === 'object' ? inner.user : inner;
        return {
          user: rawUser,
          token,
          refreshToken: refreshToken || undefined,
          message: response?.message,
        };
      },
      async onQueryStarted(arg, {queryFulfilled}) {
        await syncAuthFromResponse(queryFulfilled, arg);
      },
    }),
    signUp: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, fullName, email, password} = arg;
        return {
          url: endpoints.auth.signup.url,
          method: endpoints.auth.signup.method,
          body: {
            fullName: String(fullName ?? '').trim(),
            email: String(email ?? '').trim(),
            password: String(password ?? ''),
          },
          meta: userMeta,
        };
      },
      transformResponse: response => {
        if (response?.success === false || response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : response;
        const token = normalizeAuthToken(
          inner?.accessToken ?? inner?.token ?? response?.accessToken,
        );
        const rawUser =
          inner?.user && typeof inner.user === 'object' ? inner.user : {};
        return {
          user: rawUser,
          token,
          refreshToken: normalizeAuthToken(inner?.refreshToken),
          message: response?.message,
        };
      },
      // async onQueryStarted(arg, {queryFulfilled}) {
      //   await syncAuthFromResponse(queryFulfilled, arg);
      // },
    }),
    register: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, ...values} = arg;
        console.log('auserMetarg:::', userMeta);

        console.log('values:::', values);
        const formData = registerPayloadToFormData(values);
        console.log('formData:::', formData);
        return {
          url: endpoints.auth.register.url,
          method: endpoints.auth.register.method,
          body: formData,
          meta: userMeta,
        };
      },
      transformResponse: response => {
        if (
          response?.success === false ||
          response?.status === false
        ) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        const inner = response?.data;
        return {
          user: inner,
          message: response?.message,
          token: normalizeAuthToken(inner?.token) ?? inner?.token,
        };
      },
      // async onQueryStarted(arg, {queryFulfilled}) {
      //   await syncAuthFromResponse(queryFulfilled, arg);
      // },
    }),

    fetchUserById: builder.query({
      query: id => {
        LOG('id', id);
        return {
          url: `${endpoints.auth.fetchUserById.url}/${id?.id}`,
          method: endpoints.auth.fetchUserById.method,
        };
      },
      transformResponse: response => response?.data,
      providesTags: (_result, _error, arg) => [
        {type: 'User', id: String(arg?.id ?? 'unknown')},
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useRegisterMutation,
  useFetchUserByIdQuery,
} = authApi;
