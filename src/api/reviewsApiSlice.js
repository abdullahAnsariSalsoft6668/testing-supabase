import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './apiConfig';
import { endpoints, reducers } from './configs';

function throwIfFailed(response) {
  if (response?.success === false || response?.status === false) {
    throw {
      status: 422,
      data: { message: response?.message ?? 'Request failed' },
    };
  }
}

export const reviewsApi = createApi({
  reducerPath: reducers.path.reviews,
  baseQuery,
  tagTypes: ['MobileReviews'],
  endpoints: builder => ({
    createMobileReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: endpoints.mobile.reviews.url,
        method: endpoints.mobile.reviews.method,
        body: {
          productId: String(productId ?? '').trim(),
          rating: Math.min(5, Math.max(1, Math.round(Number(rating)))),
          comment: String(comment ?? '').trim(),
        },
      }),
      transformResponse: response => {
        throwIfFailed(response);
        const d = response?.data;
        if (d != null && typeof d === 'object') {
          return { data: d, message: response?.message };
        }
        return { message: response?.message };
      },
      invalidatesTags: (result, error, arg) => {
        const pid = arg?.productId;
        return pid
          ? [{type: 'MobileReviews', id: `PRODUCT_${String(pid)}`}]
          : ['MobileReviews'];
      },
    }),
    getProductReviews: builder.query({
      query: ({productId, page = 1, limit = 10}) => {
        const id = String(productId ?? '').trim();
        return {
          url: `${endpoints.mobile.reviewsByProduct.url}/${encodeURIComponent(id)}`,
          method: endpoints.mobile.reviewsByProduct.method,
          params: {
            page,
            limit,
          },
        };
      },
      transformResponse: response => {
        throwIfFailed(response);
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
      providesTags: (result, error, arg) =>
        arg?.productId
          ? [{type: 'MobileReviews', id: `PRODUCT_${String(arg.productId)}`}]
          : ['MobileReviews'],
    }),
  }),
});

export const {useCreateMobileReviewMutation, useGetProductReviewsQuery} =
  reviewsApi;
