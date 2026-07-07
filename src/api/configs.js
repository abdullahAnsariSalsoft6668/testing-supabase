export const baseUrl = 'https://react.customdev.solutions:3050/api/v1';
export const imageServer = 'https://react.customdev.solutions:3050';

/** Origin for Socket.io (same host as REST, without `/api/`). */
export const socketBaseUrl = (() => {
  const raw = typeof baseUrl === 'string' ? baseUrl.trim() : '';
  if (!raw) {
    return '';
  }
  let u = raw.replace(/\/+$/, '');
  u = u.replace(/\/api\/?$/i, '');
  return u;
})();

/**
 * Google Maps Platform API key for `react-native-google-places-autocomplete`
 * (Places Autocomplete + Place Details HTTP). This is what the picker uses — not
 * `AndroidManifest` `com.google.android.geo.API_KEY` (that is only for native Map SDK).
 * Enable: Places API and Place Details (Autocomplete).
 */
export const googlePlacesApiKey = 'AIzaSyDm55sl0sToKVbxMRE_OFyhp0JFd4ajyx4';

export const endpoints = {
  auth: {
    login: {
      url: 'auth/login',
      method: 'POST',
    },
    /** JSON signup: `{ fullName, email, password }` */
    signup: {
      url: 'auth/signup',
      method: 'POST',
    },
    register: {
      url: 'user/auth/create',
      method: 'POST',
    },
    fetchUserById: {
      url: 'user/getUser',
      method: 'GET',
    },
    changePassword: {
      url: 'user/changepassword',
      method: 'PUT',
    },
    forgotPassword: {
      url: 'auth/forgot-password',
      method: 'POST',
    },
    verifyOtp: {
      url: 'auth/verify-otp',
      method: 'POST',
    },
    resetPassword: {
      url: 'auth/reset-password',
      method: 'POST',
    },
  },

  /** Mobile multipart routes (`baseUrl` already includes `/api/v1`). */
  mobile: {
    profile: {
      url: 'mobile/profile',
      method: 'GET',
    },
    childUsers: {
      url: 'mobile/child-users',
      method: 'POST',
    },
    publicHome: {
      url: 'mobile/public/home',
      method: 'GET',
    },
    /** GET catalog — optional query `categoryId`; omit for all categories’ products. */
    publicCatalog: {
      url: 'mobile/public/catalog',
      method: 'GET',
    },
    /** GET `products/:productId` — URL completed in `productApiSlice`. */
    productById: {
      url: 'products',
      method: 'GET',
    },
    /** POST body `{ productId, quantity }`. */
    cartItems: {
      url: 'mobile/cart/items',
      method: 'POST',
    },
    /** PATCH body `{ quantity }` — URL completed as `mobile/cart/items/:productId`. */
    cartItemByProductId: {
      url: 'mobile/cart/items',
      method: 'PATCH',
    },
    /** DELETE — URL completed as `mobile/cart/items/:productId`. */
    cartItemRemove: {
      url: 'mobile/cart/items',
      method: 'DELETE',
    },
    /** GET current cart (`data.items`, populated `productId`). */
    cart: {
      url: 'mobile/cart',
      method: 'GET',
    },
    /** GET wishlist (`data` = product[]); POST `{ product_id }`; DELETE `mobile/wishlist/:productId`. */
    wishlist: {
      url: 'mobile/wishlist',
      method: 'GET',
    },
    /** Stripe publishable key (`data.publishableKey`). */
    stripeKeys: {
      url: 'mobile/stripe-keys',
      method: 'GET',
    },
    /** PaymentIntent — body `{ amount }` major units; returns `client_secret`. */
    paymentIntent: {
      url: 'mobile/payment-intent',
      method: 'POST',
    },
    /** Finalize order — body `{ shippingAddress, payment_intent_id }`. */
    ordersCheckout: {
      url: 'mobile/orders/checkout',
      method: 'POST',
    },
    /** GET paginated orders — query `page`, `limit`. Single order: `GET mobile/orders/:orderId`. */
    orders: {
      url: 'mobile/orders',
      method: 'GET',
    },
    /** GET paginated notifications — query `page`, `limit`. */
    notifications: {
      url: 'mobile/notifications',
      method: 'GET',
    },
    /** POST body `{ productId, rating, comment }`. */
    reviews: {
      url: 'mobile/reviews',
      method: 'POST',
    },
    /** GET paginated reviews — `mobile/reviews/product/:productId?page=&limit=`. */
    reviewsByProduct: {
      url: 'mobile/reviews/product',
      method: 'GET',
    },
  },

  profile: {
    update: {
      url: 'profile/update-profile',
      method: 'PUT',
    },
    deleteAccount: {
      url: 'profile/delete-profile',
      method: 'DELETE',
    },
    /** Authenticated user profile for edit screen */
    userProfile: {
      url: 'user/profile',
      method: 'GET',
    },
    userEdit: {
      url: 'user/edit',
      method: 'PUT',
    },
    favouriteList: {
      url: 'user/favourite/list',
      method: 'GET',
    },
    likeAdd: {
      url: 'user/like/add',
      method: 'POST',
    },
    likeRemove: {
      url: 'user/like/remove',
      method: 'POST',
    },
    favouriteAdd: {
      url: 'user/favourite/add',
      method: 'POST',
    },
    favouriteRemove: {
      url: 'user/favourite/remove',
      method: 'POST',
    },
    reportUser: {
      url: 'user/report-user',
      method: 'POST',
    },
    blockUser: {
      url: 'user/block-user',
      method: 'POST',
    },
    /** GET blocked members (`data.users`, `data.total`). */
    listBlockUser: {
      url: 'user/list-block-user',
      method: 'GET',
    },
  },
  services: {
    getAllServices: {
      url: 'services',
      method: 'GET',
    },
    getServiceTitles: {
      url: 'services/titles',
      method: 'GET',
    },
    book: {
      url: 'bookings/',
      method: 'POST',
    },
  },

  home: {
    pageData: {
      url: 'user/home-page-data',
      method: 'GET',
    },
    matches: {
      url: 'user/matches',
      method: 'GET',
    },
  },

  subscription: {
    list: {
      url: 'user/subscription/list',
      method: 'GET',
    },
    /** Stripe PaymentIntent for in-app Payment Sheet (same idea as `user/gift/payment-intent`). */
    paymentIntent: {
      url: 'user/gift/payment-intent',
      method: 'POST',
    },
    createSubscription: {
      url: 'user/subscription/create-subscription',
      method: 'POST',
    },
  },

  gift: {
    list: {
      url: 'user/gift/list',
      method: 'GET',
    },
    stripeKeys: {
      url: 'user/gift/stripe-keys',
      method: 'GET',
    },
    paymentIntent: {
      url: 'user/gift/payment-intent',
      method: 'POST',
    },
    order: {
      url: 'user/gift/order',
      method: 'POST',
    },
    orders: {
      url: 'user/gift/orders',
      method: 'GET',
    },
    purchases: {
      url: 'user/gift/purchases',
      method: 'GET',
    },
    sendPurchase: {
      url: 'user/gift/send-purchase',
      method: 'POST',
    },
  },

  notification: {
    list: {
      url: 'user/notification',
      method: 'GET',
    },
  },

  chat: {
    /** GET `?sender_id=&reciever_id=` (param spelling matches backend) */
    getMessages: {
      url: 'user/chat/get-messages',
      method: 'GET',
    },
    /** GET `user/chat/get-chat-list/:user_id` */
    chatList: {
      url: 'user/chat/get-chat-list',
      method: 'GET',
    },
  },

  feedback: {
    contactUs: {
      url: 'user/contact-us/create',
      method: 'POST',
    },
  },

  imageGenerate: {
    edit: {
      url: 'image/edit-image',
      method: 'POST',
    },
  },

  /** GET `/audio` — paginated `data.docs` (tracks with `cover_image`, `audio` paths). */
  audioList: {
    url: 'audio',
    method: 'GET',
  },
};

export const reducers = {
  path: {
    auth: 'authApi',
    profile: 'profileApi',
    home: 'homeApi',
    subscription: 'subscriptionApi',
    notification: 'notificationApi',
    gift: 'giftApi',
    chat: 'chatApi',
    feedback: 'feedbackApi',
    services: 'servicesApi',
    imageGenerate: 'ImageGenerateApi',
    /** Mobile profile, child users, public home feed */
    child: 'childApi',
    /** Cart GET / mutations */
    cart: 'cartApi',
    /** Mobile product by id */
    product: 'productApi',
    /** Stripe keys, payment intent, orders checkout */
    checkout: 'checkoutApi',
    /** Mobile wishlist GET / POST / DELETE */
    wishlist: 'wishlistApi',
    /** Audio library list */
    audio: 'audioApi',
    /** Product reviews POST */
    reviews: 'reviewsApi',
  },
};
