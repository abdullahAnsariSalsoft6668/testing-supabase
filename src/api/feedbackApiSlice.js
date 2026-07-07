import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

export const feedbackApi = createApi({
  reducerPath: reducers.path.feedback,
  baseQuery,
  endpoints: builder => ({
    contactUs: builder.mutation({
      query: ({name, email, phone, subject, message}) => ({
        url: endpoints.feedback.contactUs.url,
        method: endpoints.feedback.contactUs.method,
        body: {
          name,
          email,
          phone: phone ?? '',
          subject,
          message,
        },
      }),
    }),
  }),
});

export const {useContactUsMutation} = feedbackApi;
