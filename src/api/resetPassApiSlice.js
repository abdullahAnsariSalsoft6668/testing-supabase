import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints} from './configs';
import {LOG} from '@/utils/helperFunction';
import {syncAuthUserPartial} from '@/redux/syncAuthUser';

export const resetApi = createApi({
  reducerPath: 'resetApi',
  baseQuery,
  endpoints: builder => ({
    changePass: builder.mutation({
      query: (payload = {}) => {
        const currentPassword = String(
          payload.currentPassword ?? payload.oldPassword ?? '',
        ).trim();
        const password = String(
          payload.password ?? payload.newPassword ?? '',
        ).trim();
     
        return {
          url: endpoints.auth.changePassword.url,
          method: endpoints.auth.changePassword.method,
          body: {currentPassword, password},
        };
      },
      transformResponse: response => {
        if (response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        return response;
      },
    }),
    verifyEmail: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, email} = arg;
        return {
          url: endpoints.auth.forgotPassword.url,
          method: endpoints.auth.forgotPassword.method,
          body: {email},
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
        return {
          message: response?.message,
          data: response?.data,
        };
      },
    }),
    verifyCode: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, email, code, otp} = arg;
        const resolved = String(code ?? otp ?? '').trim();
        return {
          url: endpoints.auth.verifyOtp.url,
          method: endpoints.auth.verifyOtp.method,
          body: {email: String(email ?? '').trim(), otp: resolved},
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
            : {};
        return {
          message: response?.message,
          ...inner,
        };
      },
      async onQueryStarted(args, {queryFulfilled}) {
        if (args?.forgotPasswordFlow) {
          return;
        }
        try {
          const {data} = await queryFulfilled;
          if (args?.isLogin) {
            LOG('User is logging in with OTP');
          }
          if (data?.user || data?.token) {
            let token = data?.token;
            if (typeof token === 'string') {
              token = token.replace(/^Bearer\s+/i, '').trim();
            }
            await syncAuthUserPartial({user: data?.user, token});
          }
        } catch {
          // Error UI / RTK error path
        }
      },
    }),
    resetPass: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, email, password, otp, code} = arg;
        const resolvedOtp = String(otp ?? code ?? '').trim();
        return {
          url: endpoints.auth.resetPassword.url,
          method: endpoints.auth.resetPassword.method,
          body: {
            email: String(email ?? '').trim(),
            otp: resolvedOtp,
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
        return {
          message: response?.message,
          data: response?.data,
        };
      },
    }),
  }),
});

export const {
  useChangePassMutation,
  useVerifyEmailMutation,
  useVerifyCodeMutation,
  useResetPassMutation,
} = resetApi;
