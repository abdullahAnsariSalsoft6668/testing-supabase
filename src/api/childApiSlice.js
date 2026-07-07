import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';
import {childUserToFormData} from './formData/childUserToFormData';

const MOBILE_PROFILE_TAG = {type: 'MobileProfile', id: 'LIST'};

export const childApi = createApi({
  reducerPath: reducers.path.child,
  baseQuery,
  tagTypes: ['ChildUser', 'MobileProfile'],
  endpoints: builder => ({
    getMobileProfile: builder.query({
      query: () => ({
        url: endpoints.mobile.profile.url,
        method: endpoints.mobile.profile.method,
      }),
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
        return {...inner, message: response?.message};
      },
      providesTags: [MOBILE_PROFILE_TAG],
    }),
    getMobileNotifications: builder.query({
      query: (arg = {}) => {
        const page = arg.page ?? 1;
        const limit = arg.limit ?? 10;
        return {
          url: endpoints.mobile.notifications.url,
          method: endpoints.mobile.notifications.method,
          params: {page, limit},
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
        const docs = Array.isArray(inner.docs) ? inner.docs : [];
        return {
          docs,
          totalDocs:
            typeof inner.totalDocs === 'number' ? inner.totalDocs : docs.length,
          page: typeof inner.page === 'number' ? inner.page : 1,
          limit: typeof inner.limit === 'number' ? inner.limit : 10,
          totalPages:
            typeof inner.totalPages === 'number' ? inner.totalPages : 1,
          message: response?.message,
        };
      },
    }),
    getMobilePublicHome: builder.query({
      query: (arg = {}) => {
        const recommendedLimit = arg.recommendedLimit ?? 10;
        const featuredLimit = arg.featuredLimit ?? 5;
        return {
          url: endpoints.mobile.publicHome.url,
          method: endpoints.mobile.publicHome.method,
          params: {recommendedLimit, featuredLimit},
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
          recommended: Array.isArray(inner.recommended)
            ? inner.recommended
            : [],
          featured: Array.isArray(inner.featured) ? inner.featured : [],
          message: response?.message,
        };
      },
    }),
    createChildUser: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, name, age, image} = arg;
        return {
          url: endpoints.mobile.childUsers.url,
          method: endpoints.mobile.childUsers.method,
          body: childUserToFormData({name, age, image}),
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
        return {...inner, message: response?.message};
      },
      invalidatesTags: ['ChildUser', MOBILE_PROFILE_TAG],
    }),
  }),
});

export const {
  useGetMobileProfileQuery,
  useGetMobileNotificationsQuery,
  useGetMobilePublicHomeQuery,
  useCreateChildUserMutation,
} = childApi;
