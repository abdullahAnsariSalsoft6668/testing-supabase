import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

const MOBILE_CART_TAG = {type: 'MobileCart', id: 'CURRENT'};

function cartMutationTransform(response) {
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
  const items = Array.isArray(inner.items) ? inner.items : [];
  return {
    ...inner,
    items,
    message: response?.message,
  };
}

export const cartApi = createApi({
  reducerPath: reducers.path.cart,
  baseQuery,
  tagTypes: ['MobileCart'],
  endpoints: builder => ({
    getMobileCart: builder.query({
      query: () => ({
        url: endpoints.mobile.cart.url,
        method: endpoints.mobile.cart.method,
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
        const items = Array.isArray(inner.items) ? inner.items : [];
        return {
          ...inner,
          items,
          message: response?.message,
        };
      },
      providesTags: [MOBILE_CART_TAG],
    }),
    addCartItem: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, productId, quantity = 2} = arg;
        return {
          url: endpoints.mobile.cartItems.url,
          method: endpoints.mobile.cartItems.method,
          body: {
            productId: String(productId),
            quantity: Number(quantity),
          },
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
      invalidatesTags: [MOBILE_CART_TAG],
    }),
    updateCartItem: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, productId, quantity} = arg;
        return {
          url: `${endpoints.mobile.cartItemByProductId.url}/${encodeURIComponent(
            String(productId),
          )}`,
          method: endpoints.mobile.cartItemByProductId.method,
          body: {quantity: Number(quantity)},
          meta: userMeta,
        };
      },
      transformResponse: cartMutationTransform,
      invalidatesTags: [MOBILE_CART_TAG],
    }),
    removeCartItem: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, productId} = arg;
        return {
          url: `${endpoints.mobile.cartItemRemove.url}/${encodeURIComponent(
            String(productId),
          )}`,
          method: endpoints.mobile.cartItemRemove.method,
          meta: userMeta,
        };
      },
      transformResponse: cartMutationTransform,
      invalidatesTags: [MOBILE_CART_TAG],
    }),
  }),
});

export const {
  useGetMobileCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
