import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

export const productApi = createApi({
  reducerPath: reducers.path.product,
  baseQuery,
  tagTypes: [],
  endpoints: builder => ({
    getMobilePublicCatalog: builder.query({
      query: (arg = {}) => {
        const raw = arg.categoryId;
        const categoryId =
          raw != null && String(raw).trim() !== ''
            ? String(raw).trim()
            : undefined;
        return {
          url: endpoints.mobile.publicCatalog.url,
          method: endpoints.mobile.publicCatalog.method,
          params: categoryId ? {categoryId} : {},
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
        const categories = Array.isArray(inner.categories)
          ? inner.categories
          : [];
        const products = Array.isArray(inner.products) ? inner.products : [];
        return {
          categories,
          products,
          message: response?.message,
        };
      },
    }),
    getProductById: builder.query({
      query: ({productId}) => ({
        url: `${endpoints.mobile.productById.url}/${encodeURIComponent(
          String(productId),
        )}`,
        method: endpoints.mobile.productById.method,
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
            : response;
        if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
          return {...inner, message: response?.message};
        }
        return {message: response?.message};
      },
    }),
  }),
});

export const {useGetMobilePublicCatalogQuery, useGetProductByIdQuery} = productApi;
