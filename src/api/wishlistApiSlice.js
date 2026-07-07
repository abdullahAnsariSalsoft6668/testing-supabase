import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

const MOBILE_WISHLIST_TAG = {type: 'MobileWishlist', id: 'LIST'};

function assertWishlistSuccess(response) {
  if (response?.success === false || response?.status === false) {
    throw {
      status: 422,
      data: {message: response?.message ?? 'Request failed'},
    };
  }
}

export const wishlistApi = createApi({
  reducerPath: reducers.path.wishlist,
  baseQuery,
  tagTypes: ['MobileWishlist'],
  endpoints: builder => ({
    getMobileWishlist: builder.query({
      query: () => ({
        url: endpoints.mobile.wishlist.url,
        method: endpoints.mobile.wishlist.method,
      }),
      transformResponse: response => {
        assertWishlistSuccess(response);
        const raw = response?.data;
        const items = Array.isArray(raw) ? raw : [];
        return {items, message: response?.message};
      },
      providesTags: [MOBILE_WISHLIST_TAG],
    }),
    addWishlistItem: builder.mutation({
      query: ({productId}) => ({
        url: endpoints.mobile.wishlist.url,
        method: 'POST',
        body: {product_id: String(productId)},
      }),
      transformResponse: response => {
        assertWishlistSuccess(response);
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : {};
        return {...inner, message: response?.message};
      },
      invalidatesTags: [MOBILE_WISHLIST_TAG],
    }),
    removeWishlistItem: builder.mutation({
      query: ({productId}) => ({
        url: `${endpoints.mobile.wishlist.url}/${encodeURIComponent(
          String(productId),
        )}`,
        method: 'DELETE',
      }),
      transformResponse: response => {
        assertWishlistSuccess(response);
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : {};
        return {...inner, message: response?.message};
      },
      invalidatesTags: [MOBILE_WISHLIST_TAG],
    }),
  }),
});

export const {
  useGetMobileWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = wishlistApi;
