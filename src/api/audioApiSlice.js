import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

function assertAudioSuccess(response) {
  if (response?.success === false || response?.status === false) {
    throw {
      status: 422,
      data: {message: response?.message ?? 'Request failed'},
    };
  }
}

export const audioApi = createApi({
  reducerPath: reducers.path.audio,
  baseQuery,
  tagTypes: [],
  endpoints: builder => ({
    getAudioList: builder.query({
      query: (arg = {}) => {
        const page = arg.page != null ? Number(arg.page) : 1;
        const limit = arg.limit != null ? Number(arg.limit) : 20;
        return {
          url: endpoints.audioList.url,
          method: endpoints.audioList.method,
          params: {page, limit},
        };
      },
      transformResponse: response => {
        assertAudioSuccess(response);
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : {};
        const docs = Array.isArray(inner.docs) ? inner.docs : [];
        return {
          docs,
          page: inner.page ?? 1,
          limit: inner.limit ?? 20,
          totalDocs: inner.totalDocs ?? 0,
          totalPages: inner.totalPages ?? 0,
          message: response?.message,
        };
      },
    }),
  }),
});

export const {useGetAudioListQuery} = audioApi;
