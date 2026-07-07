import {createApi} from '@reduxjs/toolkit/query/react';
import {formatDateYear} from '@/utils/helperFunction';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

const DELIVERY_STATUS_META = {
  pending: {status: 'Pending', bgColor: '#FF9800'},
  completed: {status: 'Completed', bgColor: '#25C52B'},
  processing: {status: 'Processing', bgColor: '#2196F3'},
  unable_to_deliver: {status: 'Unable to Deliver', bgColor: '#FF0000'},
  delivered: {status: 'Completed', bgColor: '#25C52B'},
  cancelled: {status: 'Unable to Deliver', bgColor: '#FF0000'},
};

function normalizeDeliveryStatusKey(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function deliveryStatusMeta(raw) {
  const key = normalizeDeliveryStatusKey(raw);
  if (DELIVERY_STATUS_META[key]) {
    return DELIVERY_STATUS_META[key];
  }
  const label = String(raw ?? '').trim();
  if (!label) {
    return {status: 'Unknown', bgColor: '#9E9E9E'};
  }
  const pretty = label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return {status: pretty, bgColor: '#9E9E9E'};
}

/**
 * Maps GET `user/gift/orders` items to `CustomCard` type `gift_history`.
 */
function mapOrderToGiftHistory(order) {
  if (!order || typeof order !== 'object') {
    return null;
  }
  const gift =
    order.gift_id && typeof order.gift_id === 'object' ? order.gift_id : {};
  const user =
    order.user_id && typeof order.user_id === 'object' ? order.user_id : {};
  const meta = deliveryStatusMeta(order.delivery_status);
  const rawImage = typeof gift.image === 'string' ? gift.image.trim() : '';
  const desc = typeof gift.desc === 'string' ? gift.desc.trim() : '';

  return {
    id: order._id ?? order.id,
    title: gift.name ?? 'Gift',
    image: rawImage,
    emailTo: order.delivery_address || user.email || user.name || '—',
    message: desc || ' ',
    date: formatDateYear(order.createdAt),
    status: meta.status,
    bgColor: meta.bgColor,
    raw: order,
  };
}

/**
 * Maps GET `user/gift/list` items to `CustomCard` type `gift_card` (browse grid).
 */
function mapGiftToBrowseCard(g) {
  if (!g || typeof g !== 'object') {
    return null;
  }
  const id = g._id ?? g.id;
  const rawImage = typeof g.image === 'string' ? g.image.trim() : '';
  const price = g.price != null ? String(g.price).trim() : '';
  const desc = typeof g.desc === 'string' ? g.desc.trim() : '';
  const parts = [];
  if (price) {
    parts.push(price.startsWith('$') ? price : `$${price}`);
  }
  if (desc) {
    parts.push(desc);
  }
  const locationLine = parts.join(' · ') || undefined;

  return {
    id,
    name: g.name ?? 'Gift',
    profileImage: rawImage,
    location: locationLine,
    stock: g.stock,
    status: g.status,
    raw: g,
  };
}

function pickGiftListTotal(response, listLength) {
  const d = response?.data;
  if (typeof d?.total === 'number' && !Number.isNaN(d.total)) {
    return d.total;
  }
  if (typeof response?.total === 'number' && !Number.isNaN(response.total)) {
    return response.total;
  }
  return listLength;
}

/** `pi_xxx_secret_yyy` → `pi_xxx` */
export function paymentIntentIdFromClientSecret(clientSecret) {
  const s = String(clientSecret || '').trim();
  if (!s) {
    return '';
  }
  const parts = s.split('_secret_');
  return parts[0] || '';
}

/**
 * Parses `price` / `amount` as major currency units (e.g. dollars).
 * Handles `"20,03"` (EU decimal comma) — stripping non-digits would wrongly yield 2003.
 */
export function parseMajorCurrencyAmount(value) {
  if (value == null || value === '') {
    return NaN;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  let s = String(value)
    .trim()
    .replace(/[^\d.,-]/g, '');
  if (!s) {
    return NaN;
  }
  const comma = s.lastIndexOf(',');
  const dot = s.lastIndexOf('.');
  if (comma >= 0 && dot < 0) {
    s = s.replace(',', '.');
  } else if (comma >= 0 && dot >= 0) {
    if (comma > dot) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Amount in **major** currency units (e.g. USD dollars) for `user/gift/payment-intent`
 * when the backend expects dollars (`23.56`), not Stripe-style cents (`2356`).
 */
export function giftPriceMajorAmount(raw) {
  if (!raw || typeof raw !== 'object') {
    return 0;
  }
  const cents = raw.payment_amount ?? raw.amount_in_cents ?? raw.amountInCents;
  if (cents != null && cents !== '') {
    const v = Number(cents);
    if (Number.isFinite(v) && v > 0) {
      return Math.round(v) / 100;
    }
  }
  const n = parseMajorCurrencyAmount(raw.price ?? raw.amount);
  if (!Number.isFinite(n) || n <= 0) {
    return 0;
  }
  return Math.round(n * 100) / 100;
}

/**
 * Amount in **smallest** currency unit (e.g. USD cents) for Stripe-style APIs
 * (e.g. subscription payment-intent). Not used for `user/gift/payment-intent` body amount.
 */
export function giftPriceToPaymentAmount(raw) {
  if (!raw || typeof raw !== 'object') {
    return 0;
  }
  const cents = raw.payment_amount ?? raw.amount_in_cents ?? raw.amountInCents;
  if (cents != null && cents !== '') {
    const v = Number(cents);
    if (Number.isFinite(v) && v > 0) {
      return Math.round(v);
    }
  }
  const p = raw.price ?? raw.amount;
  const n = parseMajorCurrencyAmount(p);
  if (!Number.isFinite(n) || n <= 0) {
    return 0;
  }
  return Math.max(50, Math.round(n * 100));
}

export const giftApi = createApi({
  reducerPath: reducers.path.gift,
  baseQuery,
  tagTypes: ['GiftList', 'GiftOrders', 'GiftPurchases'],
  endpoints: builder => ({
    getGiftList: builder.query({
      query: () => ({
        url: endpoints.gift.list.url,
        method: endpoints.gift.list.method,
      }),
      providesTags: ['GiftList'],
      transformResponse: response => {
        const raw = response?.data?.gifts ?? response?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const gifts = list.map(mapGiftToBrowseCard).filter(Boolean);
        return {
          gifts,
          total: pickGiftListTotal(response, gifts.length),
        };
      },
    }),

    getGiftPurchases: builder.query({
      query: () => ({
        url: endpoints.gift.purchases.url,
        method: endpoints.gift.purchases.method,
      }),
      providesTags: ['GiftPurchases'],
      transformResponse: response => {
        const raw = response?.data?.purchases ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const total =
          typeof response?.data?.total === 'number' && !Number.isNaN(response.data.total)
            ? response.data.total
            : typeof response?.total === 'number' && !Number.isNaN(response.total)
              ? response.total
              : list.length;
        return {purchases: list, total};
      },
    }),

    getGiftOrders: builder.query({
      query: arg => {
        const deliveryStatus =
          arg && typeof arg === 'object' && arg.delivery_status
            ? String(arg.delivery_status).trim()
            : '';
        return {
          url: endpoints.gift.orders.url,
          method: endpoints.gift.orders.method,
          ...(deliveryStatus ? {params: {delivery_status: deliveryStatus}} : {}),
        };
      },
      providesTags: ['GiftOrders'],
      transformResponse: response => {
        const raw = response?.data?.orders ?? [];
        const list = Array.isArray(raw) ? raw : [];
        const orders = list.map(mapOrderToGiftHistory).filter(Boolean);
        const total =
          typeof response?.total === 'number' && !Number.isNaN(response.total)
            ? response.total
            : typeof response?.data?.total === 'number' &&
                !Number.isNaN(response.data.total)
              ? response.data.total
              : orders.length;
        return {orders, total};
      },
    }),

    getGiftStripeKeys: builder.query({
      query: () => ({
        url: endpoints.gift.stripeKeys.url,
        method: endpoints.gift.stripeKeys.method,
      }),
      transformResponse: response => {
        const d = response?.data ?? response;
        const publishableKey = String(
          d?.publishableKey ??
            d?.publishablekey ??
            d?.publishable_key ??
            d?.pk ??
            d?.stripePublishableKey ??
            '',
        ).trim();
        return {publishableKey};
      },
    }),

    createGiftPaymentIntent: builder.mutation({
      query: body => ({
        url: endpoints.gift.paymentIntent.url,
        method: endpoints.gift.paymentIntent.method,
        body,
      }),
      transformResponse: response => {
        const d = response?.data ?? response;
        const clientSecret = String(
          d?.client_secret ?? d?.clientSecret ?? d?.paymentIntent?.client_secret ?? '',
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

    createGiftOrder: builder.mutation({
      query: body => ({
        url: endpoints.gift.order.url,
        method: endpoints.gift.order.method,
        body,
      }),
      invalidatesTags: ['GiftList', 'GiftOrders', 'GiftPurchases'],
    }),

    sendGiftPurchase: builder.mutation({
      query: ({gift_purchase_id, recipient_user_id, delivery_address}) => ({
        url: endpoints.gift.sendPurchase.url,
        method: endpoints.gift.sendPurchase.method,
        body: {
          gift_purchase_id: String(gift_purchase_id ?? '').trim(),
          recipient_user_id: String(recipient_user_id ?? '').trim(),
          delivery_address: String(delivery_address ?? '').trim(),
        },
      }),
      transformResponse: response => {
        if (response?.status === false) {
          throw {
            status: 422,
            data: {message: response?.message ?? 'Request failed'},
          };
        }
        return response;
      },
      invalidatesTags: ['GiftPurchases', 'GiftOrders'],
    }),
  }),
});

export const {
  useGetGiftListQuery,
  useGetGiftPurchasesQuery,
  useGetGiftOrdersQuery,
  useGetGiftStripeKeysQuery,
  useLazyGetGiftStripeKeysQuery,
  useCreateGiftPaymentIntentMutation,
  useCreateGiftOrderMutation,
  useSendGiftPurchaseMutation,
} = giftApi;
