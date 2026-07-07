import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

/** `pi_xxx_secret_yyy` → `pi_xxx` (same logic as giftApiSlice; kept local to avoid import cycles). */
function paymentIntentIdFromClientSecret(clientSecret) {
  const s = String(clientSecret || '').trim();
  if (!s) {
    return '';
  }
  const parts = s.split('_secret_');
  return parts[0] || '';
}

/** Fallback if `endpoints.subscription` is missing during module init / HMR. */
const SUBSCRIPTION_PATHS = {
  list: {url: 'user/subscription/list', method: 'GET'},
  paymentIntent: {
    url: 'user/subscription/payment-intent',
    method: 'POST',
  },
  createSubscription: {
    url: 'user/subscription/create-subscription',
    method: 'POST',
  },
};

function subEp() {
  return endpoints.subscription ?? SUBSCRIPTION_PATHS;
}

export const subscriptionApi = createApi({
  reducerPath: reducers.path.subscription,
  baseQuery,
  tagTypes: ['Subscriptions', 'User'],
  endpoints: builder => ({
    listSubscriptions: builder.query({
      query: () => {
        const ep = subEp();
        return {
          url: ep.list.url,
          method: ep.list.method,
        };
      },
      providesTags: ['Subscriptions'],
      transformResponse: response => {
        const raw = response?.data?.subscriptions ?? response?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        return {
          subscriptions: list,
          total:
            typeof response?.total === 'number' && !Number.isNaN(response.total)
              ? response.total
              : typeof response?.data?.total === 'number'
                ? response.data.total
                : list.length,
        };
      },
    }),

    createSubscriptionPaymentIntent: builder.mutation({
      query: body => {
        const ep = subEp();
        return {
          url: ep.paymentIntent.url,
          method: ep.paymentIntent.method,
          body,
        };
      },
      transformResponse: response => {
        const d = response?.data ?? response;
        const clientSecret = String(
          d?.client_secret ??
            d?.clientSecret ??
            d?.paymentIntent?.client_secret ??
            '',
        ).trim();
        const id = String(
          d?.id ??
            d?.payment_intent_id ??
            d?.paymentIntentId ??
            paymentIntentIdFromClientSecret(clientSecret) ??
            '',
        ).trim();
        return {
          clientSecret,
          paymentIntentId: id || paymentIntentIdFromClientSecret(clientSecret),
        };
      },
    }),

    createSubscription: builder.mutation({
      query: body => {
        const ep = subEp();
        return {
          url: ep.createSubscription.url,
          method: ep.createSubscription.method,
          body,
        };
      },
      invalidatesTags: ['Subscriptions', 'User'],
    }),
  }),
});

export const {
  useListSubscriptionsQuery,
  useCreateSubscriptionPaymentIntentMutation,
  useCreateSubscriptionMutation,
} = subscriptionApi;
