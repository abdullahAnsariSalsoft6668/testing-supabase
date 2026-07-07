import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';
import {LOG} from '@/utils/helperFunction';

export const ImageGenerateApi = createApi({
  reducerPath: reducers.path.imageGenerate,
  baseQuery,
  endpoints: builder => ({
    edit: builder.mutation({
      query: body => {
        LOG('body-vehicle', body);
        return {
          url: endpoints.imageGenerate?.edit.url,
          method: endpoints.imageGenerate?.edit.method,
          // headers: {'Content-Type': 'multipart/form-data'},
          body: body,
        };
      },
    }),
  }),
});

export const {useEditMutation} = ImageGenerateApi;
