import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './apiConfig';
import { endpoints, reducers } from './configs';
import { getImageUrl, LOG } from '@/utils/helperFunction';
import {syncAuthUserPartial} from '@/redux/syncAuthUser';
import { authApi } from './authApiSlice';

/**
 * API envelopes used in this app:
 * - `{ data: { _id, email, ...userFields }, status: true, message }` (GET profile / PUT edit)
 * - `{ data: { user: {...} } }` (legacy)
 */
function extractUserFromApiEnvelope(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  if ('_id' in payload || 'id' in payload || 'email' in payload) {
    return payload;
  }
  const nested = payload.data;
  if (nested && typeof nested === 'object') {
    if ('_id' in nested || 'id' in nested || 'email' in nested) {
      return nested;
    }
    if (nested.user && typeof nested.user === 'object') {
      return nested.user;
    }
  }
  if (payload.user && typeof payload.user === 'object') {
    return payload.user;
  }
  if (payload.profile && typeof payload.profile === 'object') {
    return payload.profile;
  }
  return null;
}

function sanitizeUserForRedux(user) {
  if (!user || typeof user !== 'object') {
    return user;
  }
  const { hashed_password, salt, ...rest } = user;
  return rest;
}

function normalizeUserProfileResponse(response) {
  const user = extractUserFromApiEnvelope(response);
  return user ? sanitizeUserForRedux(user) : {};
}

function locationAddressFromUser(user) {
  const loc = user?.location;
  if (!loc) {
    return '';
  }
  if (typeof loc === 'string') {
    return loc;
  }
  if (typeof loc === 'object' && typeof loc.address === 'string') {
    return loc.address;
  }
  return '';
}

function collectProfileImagePaths(user) {
  const paths = [];
  if (user?.profile_image) {
    paths.push(user.profile_image);
  }
  if (user?.image && user.image !== user?.profile_image) {
    paths.push(user.image);
  }
  if (Array.isArray(user?.images)) {
    for (const img of user.images) {
      if (img && !paths.includes(img)) {
        paths.push(img);
      }
    }
  }
  return paths;
}

/** Maps GET `user/favourite/list` user objects to `CustomCard` type `gift_card` + profile route params. */
function mapFavouriteUserToGiftCard(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }
  const id = user._id ?? user.id;
  const imagePaths = collectProfileImagePaths(user);
  const profileImage = imagePaths[0] || '';
  const locationStr = locationAddressFromUser(user);
  const isVerified = Boolean(
    user.isVerified ?? user.verified ?? user.is_verified,
  );

  return {
    id,
    name: user.name,
    profileImage,
    isOnline: Boolean(user.online),
    isVerified,
    ...(locationStr ? { location: locationStr } : {}),
    profileRouteParams: {
      _id: id,
      name: user.name,
      age: user.age,
      online: user.online,
      gender: user.gender,
      basicAge: user.age,
      basicGender: user.gender,
      liveIn: locationStr,
      location: locationStr,
      images: imagePaths.length ? imagePaths : undefined,
    },
  };
}

function resolveListAvatarSource(image) {
  if (image == null || image === '') {
    return null;
  }
  const resolved = getImageUrl(image);
  if (typeof resolved === 'number') {
    return resolved;
  }
  if (resolved && typeof resolved === 'object' && resolved.uri) {
    return {uri: resolved.uri};
  }
  return null;
}

/** Maps GET `user/list-block-user` rows for the Block screen + `CustomProfileView`. */
function mapBlockedListUser(u) {
  if (!u || typeof u !== 'object') {
    return null;
  }
  const id = u._id ?? u.id;
  if (id == null || String(id).trim() === '') {
    return null;
  }
  const name = String(u.name ?? '').trim();
  const parts = name.split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  const displayName =
    name || [firstName, lastName].filter(Boolean).join(' ').trim() || 'User';

  return {
    id: String(id),
    firstName,
    lastName,
    displayName,
    source: resolveListAvatarSource(u.profile_image),
    blockedDate: u.blockedDate ?? u.blocked_at ?? u.createdAt ?? u.updatedAt,
    reason: u.reason,
  };
}

export const profileApi = createApi({
  reducerPath: reducers.path.profile,
  baseQuery,
  tagTypes: ['User', 'Favourites', 'BlockedUsers'],
  endpoints: builder => ({
    getUserProfile: builder.query({
      query: () => ({
        url: endpoints.profile.userProfile.url,
        method: endpoints.profile.userProfile.method,
      }),
      providesTags: ['User'],
      transformResponse: response => normalizeUserProfileResponse(response),
    }),
    /**
     * GET `user/profile` (self) or `user/profile/:otherUserId` when viewing another member.
     * Pass empty string for the authenticated user's profile.
     */
    getProfileDetails: builder.query({
      query: userId => {
        const id =
          typeof userId === 'string' ? userId.trim() : userId != null ? String(userId).trim() : '';
        const base = endpoints.profile.userProfile.url;
        return {
          url: id ? `${base}/${encodeURIComponent(id)}` : base,
          method: endpoints.profile.userProfile.method,
        };
      },
      providesTags: (result, error, userId) => {
        const id =
          typeof userId === 'string' ? userId.trim() : userId != null ? String(userId).trim() : '';
        return id ? [{type: 'User', id}] : ['User'];
      },
      transformResponse: response => normalizeUserProfileResponse(response),
    }),
    getFavouriteList: builder.query({
      query: () => {
        return (
          {
            url: endpoints.profile.favouriteList.url,
            method: endpoints.profile.favouriteList.method,
          })
      },
      providesTags: ['Favourites'],
      transformResponse: response => {
        const d = response?.data;
        const list = Array.isArray(d?.favourites)
          ? d.favourites
          : Array.isArray(d?.favorites)
            ? d.favorites
            : Array.isArray(response?.favourites)
              ? response.favourites
              : Array.isArray(response?.favorites)
                ? response.favorites
                : Array.isArray(d)
                  ? d
                  : [];
        return list.map(mapFavouriteUserToGiftCard).filter(Boolean);
      },
    }),
    getBlockedUsersList: builder.query({
      query: () => ({
        url: endpoints.profile.listBlockUser.url,
        method: endpoints.profile.listBlockUser.method,
      }),
      providesTags: ['BlockedUsers'],
      transformResponse: response => {
        const d = response?.data;
        const raw = Array.isArray(d?.users) ? d.users : [];
        const mapped = raw.map(mapBlockedListUser).filter(Boolean);
        const seen = new Set();
        const users = [];
        for (const row of mapped) {
          if (seen.has(row.id)) {
            continue;
          }
          seen.add(row.id);
          users.push(row);
        }
        const total =
          typeof d?.total === 'number' ? d.total : users.length;
        return {users, total};
      },
    }),
    addLike: builder.mutation({
      query: ({user_id}) => ({
        url: endpoints.profile.likeAdd.url,
        method: endpoints.profile.likeAdd.method,
        body: {user_id: String(user_id ?? '').trim()},
      }),
      invalidatesTags: (result, error, arg) => {
        const id = String(arg?.user_id ?? '').trim();
        return id ? [{type: 'User', id}] : ['User'];
      },
    }),
    removeLike: builder.mutation({
      query: ({user_id}) => ({
        url: endpoints.profile.likeRemove.url,
        method: endpoints.profile.likeRemove.method,
        body: {user_id: String(user_id ?? '').trim()},
      }),
      invalidatesTags: (result, error, arg) => {
        const id = String(arg?.user_id ?? '').trim();
        return id ? [{type: 'User', id}] : ['User'];
      },
    }),
    addFavourite: builder.mutation({
      query: ({user_id}) => ({
        url: endpoints.profile.favouriteAdd.url,
        method: endpoints.profile.favouriteAdd.method,
        body: {user_id: String(user_id ?? '').trim()},
      }),
      invalidatesTags: ['Favourites'],
    }),
    removeFavourite: builder.mutation({
      query: ({user_id}) => ({
        url: endpoints.profile.favouriteRemove.url,
        method: endpoints.profile.favouriteRemove.method,
        body: {user_id: String(user_id ?? '').trim()},
      }),
      invalidatesTags: ['Favourites'],
    }),
    reportUser: builder.mutation({
      query: ({user_id, reason, comment}) => ({
        url: endpoints.profile.reportUser.url,
        method: endpoints.profile.reportUser.method,
        body: {
          user_id: String(user_id ?? '').trim(),
          reason: String(reason ?? '').trim() || 'other',
          comment: String(comment ?? '').trim(),
        },
      }),
    }),
    blockUser: builder.mutation({
      query: ({blockedUserId}) => ({
        url: endpoints.profile.blockUser.url,
        method: endpoints.profile.blockUser.method,
        body: {
          blockedUserId: String(blockedUserId ?? '').trim(),
        },
      }),
      transformResponse: response => {
        if (response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        return response;
      },
      invalidatesTags: (result, error, arg) => {
        const id = String(arg?.blockedUserId ?? '').trim();
        return id
          ? [{type: 'User', id}, 'Favourites', 'BlockedUsers']
          : ['User', 'Favourites', 'BlockedUsers'];
      },
    }),
    /** Same URL as `blockUser`; body uses `blockedUSerId` + `unblock: true` per API. */
    unblockUser: builder.mutation({
      query: ({blockedUserId}) => ({
        url: endpoints.profile.blockUser.url,
        method: endpoints.profile.blockUser.method,
        body: {
          blockedUSerId: String(blockedUserId ?? '').trim(),
          unblock: true,
        },
      }),
      transformResponse: response => {
        if (response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        return response;
      },
      invalidatesTags: (result, error, arg) => {
        const id = String(arg?.blockedUserId ?? '').trim();
        return id
          ? [{type: 'User', id}, 'Favourites', 'BlockedUsers']
          : ['User', 'Favourites', 'BlockedUsers'];
      },
    }),
    editUserProfile: builder.mutation({
      query: (arg = {}) => {
        const { meta: userMeta = {}, body } = arg;
        const formBody =
          body instanceof FormData
            ? body
            : arg instanceof FormData
              ? arg
              : null;

        LOG('formBodyhdhd', formBody);
        return {
          url: endpoints.profile.userEdit.url,
          method: endpoints.profile.userEdit.method,
          body: formBody ?? new FormData(),
          meta: userMeta,
        };
      },
      transformResponse: response =>
        sanitizeUserForRedux(extractUserFromApiEnvelope(response) ?? {}),
      invalidatesTags: ['User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data: user } = await queryFulfilled;
          if (
            user &&
            typeof user === 'object' &&
            !Array.isArray(user) &&
            Object.keys(user).length &&
            ('_id' in user || 'id' in user || 'email' in user || 'name' in user)
          ) {
            await syncAuthUserPartial({user});
          }
          dispatch(authApi.util.invalidateTags(['User']));
        } catch {
          // surfaced by global toasts
        }
      },
    }),
    update: builder.mutation({
      query: body => {
        LOG('body', body);
        return {
          url: endpoints.profile.update.url,
          method: endpoints.profile.update.method,
          body: body,
        };
      },
      invalidatesTags: ['User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          LOG('PROFILE_DATA_SUCCESS:', data);
          await syncAuthUserPartial({user: data?.user});
          dispatch(authApi.util.invalidateTags(['User']));
        } catch (error) {
          LOG('PROFILE_DATA_REJECT', error);
        }
      },
    }),
    deleteAccount: builder.mutation({
      query: ({ id }) => {
        console.log('idasdasdas: ', id);
        return {
          url: `${endpoints.profile.deleteAccount.url}?id=${id}`,

          method: endpoints.profile.deleteAccount.method,
        };
      },
      invalidatesTags: ['User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(['User']));
        } catch {
          // no-op
        }
      },
      transformResponse: response => response,
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetProfileDetailsQuery,
  useLazyGetUserProfileQuery,
  useGetFavouriteListQuery,
  useGetBlockedUsersListQuery,
  useAddLikeMutation,
  useRemoveLikeMutation,
  useAddFavouriteMutation,
  useRemoveFavouriteMutation,
  useReportUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useEditUserProfileMutation,
  useUpdateMutation,
  useDeleteAccountMutation,
} = profileApi;
