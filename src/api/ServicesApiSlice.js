import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';
import {LOG} from '@/utils/helperFunction';

export const servicesApi = createApi({
  reducerPath: reducers.path.services,
  baseQuery,
  tagTypes: ['Service'],
  endpoints: builder => ({
    getAllServices: builder.query({
      query: () => {
        return {
          url: endpoints.services.getAllServices.url,
          method: endpoints.services.getAllServices.method,
        };
      },
      providesTags: ['Service'],
      transformResponse: response => response,
    }),
    getServiceTitles: builder.query({
      query: () => {
        return {
          url: endpoints.services.getServiceTitles.url,
          method: endpoints.services.getServiceTitles.method,
        };
      },
      providesTags: ['Service'],
      transformResponse: response => response,
    }),

    book: builder.mutation({
      query: body => {
        LOG('body-vehicle', body);
        return {
          url: endpoints.services.book.url,
          method: endpoints.services.book.method,
          body: body,
        };
      },
      invalidatesTags: ['Service'],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceTitlesQuery,
  useBookMutation,
} = servicesApi;
