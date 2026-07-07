// import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {checkNetworkConnectivity} from '@utils/helperFunction';
// import {baseUrl} from './configs';

// const baseQuery = async (args, api, extraOptions) => {
//   // Check Internet
//   const isConnected = await checkNetworkConnectivity();

//   if (!isConnected) {
//     return {
//       error: {
//         status: 'NO_INTERNET',
//         data: {message: 'No internet connection'},
//       },
//     };
//   }

//   // Normal base query
//   const rawBaseQuery = fetchBaseQuery({
//     baseUrl,
//     prepareHeaders: (headers, {getState}) => {
//       const token = getState().auth.token;
//       const tempToken = getState().auth.tempToken;

//       if (token || tempToken) {
//         headers.set('authorization', `Bearer ${token || tempToken}`);
//       }

//       return headers;
//     },
//   });

//   return await rawBaseQuery(args, api, extraOptions);
// };

// export {baseQuery};



import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {EventRegister} from 'react-native-event-listeners';
import {checkNetworkConnectivity} from '@/utils/helperFunction';
import {baseUrl} from './configs';
import {normalizeFetchArgs, showGlobalApiToasts} from './apiToast';

/**
 * Ensures multipart requests do not send `Content-Type: application/json` so the
 * runtime can set the boundary. RTK usually handles this; this is an explicit safeguard.
 */
function requestArgsForFetch(args) {
  const normalized = normalizeFetchArgs(args);
  if (!(normalized.body instanceof FormData)) {
    return normalized;
  }
  const out = {...normalized};
  if (out.headers instanceof Headers) {
    const h = new Headers(out.headers);
    h.delete('Content-Type');
    h.delete('content-type');
    out.headers = h;
  } else if (out.headers && typeof out.headers === 'object') {
    out.headers = {...out.headers};
    delete out.headers['Content-Type'];
    delete out.headers['content-type'];
  }
  return out;
}

const baseQuery = async (args, api, extraOptions) => {

  console.log('args:::', args);
  console.log('api:::', api);
  console.log('extraOptions:::', extraOptions);
  // 🔹 Check Internet
  const isConnected = await checkNetworkConnectivity();

  if (!isConnected) {
    const offlineResult = {
      error: {
        status: 'NO_INTERNET',
        data: {message: 'No internet connection'},
      },
    };
    showGlobalApiToasts(offlineResult, args);
    return offlineResult;
  }

  // 🔹 Create normal base query
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState}) => {
      const s = getState().auth;
      const token = s?.auth_token ?? s?.token;
      const tempToken = s?.tempToken;

      if (token || tempToken) {
        headers.set('authorization', `Bearer ${token || tempToken}`);
      }

      return headers;
    },
  });

  // 🔹 Execute API request
  const result = await rawBaseQuery(requestArgsForFetch(args), api, extraOptions);

  showGlobalApiToasts(result, args);

  // 🔹 Session expired / forbidden (treat like logout when API uses 403 for invalid token)
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    EventRegister.emit('forcelogout');
  }

  return result;
};

export {baseQuery};
