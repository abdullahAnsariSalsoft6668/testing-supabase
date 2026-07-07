import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

function throwIfFailed(response) {
  if (response?.success === false || response?.status === false) {
    throw {
      status: 422,
      data: {message: response?.message ?? 'Request failed'},
    };
  }
}

const MOBILE_ORDERS_LIST_TAG = {type: 'MobileOrders', id: 'LIST'};

export const checkoutApi = createApi({
  reducerPath: reducers.path.checkout,
  baseQuery,
  tagTypes: ['MobileOrders'],
  endpoints: builder => ({
    getMobileStripeKeys: builder.query({
      query: () => ({
        url: endpoints.mobile.stripeKeys.url,
        method: endpoints.mobile.stripeKeys.method,
      }),
      transformResponse: response => {
        throwIfFailed(response);
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : {};
        const publishableKey = String(inner.publishableKey ?? '').trim();
        return {publishableKey, message: response?.message};
      },
    }),
    createMobilePaymentIntent: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, amount} = arg;
        const n = typeof amount === 'number' ? amount : Number(amount);
        return {
          url: endpoints.mobile.paymentIntent.url,
          method: endpoints.mobile.paymentIntent.method,
          body: {amount: Number.isFinite(n) ? Math.round(n * 100) / 100 : 0},
          meta: userMeta,
        };
      },
      transformResponse: response => {
        throwIfFailed(response);
        const cs =
          response?.client_secret ??
          response?.clientSecret ??
          response?.data?.client_secret ??
          response?.data?.clientSecret ??
          '';
        return {
          clientSecret: String(cs).trim(),
          message: response?.message,
        };
      },
    }),
    mobileOrdersCheckout: builder.mutation({
      query: (arg = {}) => {
        const {meta: userMeta = {}, shippingAddress, payment_intent_id} = arg;
        return {
          url: endpoints.mobile.ordersCheckout.url,
          method: endpoints.mobile.ordersCheckout.method,
          body: {
            shippingAddress: String(shippingAddress ?? '').trim(),
            payment_intent_id: String(payment_intent_id ?? '').trim(),
          },
          meta: userMeta,
        };
      },
      transformResponse: response => {
        throwIfFailed(response);
        const inner =
          response?.data != null && typeof response.data === 'object'
            ? response.data
            : {};
        return {...inner, message: response?.message};
      },
      invalidatesTags: [MOBILE_ORDERS_LIST_TAG],
    }),
    getMobileOrders: builder.query({
      query: (arg = {}) => {
        const page = arg.page ?? 1;
        const limit = arg.limit ?? 10;
        return {
          url: endpoints.mobile.orders.url,
          method: endpoints.mobile.orders.method,
          params: {page, limit},
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
      providesTags: [MOBILE_ORDERS_LIST_TAG],
    }),
    /** GET `mobile/orders/:orderId` — `data` is a single order doc (same shape as list items). */
    getMobileOrder: builder.query({
      query: orderId => ({
        url: `${endpoints.mobile.orders.url}/${encodeURIComponent(String(orderId ?? ''))}`,
        method: endpoints.mobile.orders.method,
      }),
      transformResponse: response => {
        throwIfFailed(response);
        const d = response?.data;
        if (d != null && typeof d === 'object' && !Array.isArray(d)) {
          return d;
        }
        const o = response?.order;
        if (o != null && typeof o === 'object' && !Array.isArray(o)) {
          return o;
        }
        return null;
      },
      providesTags: (result, error, orderId) =>
        orderId != null && String(orderId).trim() !== ''
          ? [{type: 'MobileOrders', id: String(orderId)}]
          : [],
    }),
  }),
});

export const {
  useGetMobileStripeKeysQuery,
  useLazyGetMobileStripeKeysQuery,
  useCreateMobilePaymentIntentMutation,
  useMobileOrdersCheckoutMutation,
  useGetMobileOrdersQuery,
  useGetMobileOrderQuery,
} = checkoutApi;
