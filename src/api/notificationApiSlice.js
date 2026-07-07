import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

function normalizeNotificationsResponse(response) {
  const payload =
    response && typeof response === 'object' && response.data != null
      ? response.data
      : response;
  const raw = payload && typeof payload === 'object' ? payload : {};
  const list = Array.isArray(raw.newNotifications)
    ? raw.newNotifications
    : Array.isArray(raw.notifications)
      ? raw.notifications
      : [];
  const unreadCount =
    typeof raw.unreadCount === 'number' && Number.isFinite(raw.unreadCount)
      ? raw.unreadCount
      : 0;
  return {newNotifications: list, unreadCount};
}

export const notificationApi = createApi({
  reducerPath: reducers.path.notification,
  baseQuery,
  tagTypes: ['Notifications'],
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => ({
        url: endpoints.notification.list.url,
        method: endpoints.notification.list.method,
      }),
      transformResponse: normalizeNotificationsResponse,
      providesTags: ['Notifications'],
    }),
  }),
});

export const {useGetNotificationsQuery} = notificationApi;
