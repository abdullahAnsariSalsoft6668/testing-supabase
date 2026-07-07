import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from './apiConfig';
import {endpoints, reducers} from './configs';

/** `user/home-page-data` — only `type`, `limit`, `page` (per product spec). */
export function buildHomePageDataUrl(arg = {}) {
  const {type = 'popular', limit = 10, page = 1} = arg;
  const p = new URLSearchParams();
  p.set('type', type);
  p.set('limit', String(limit));
  p.set('page', String(page));
  return `${endpoints.home.pageData.url}?${p.toString()}`;
}

/** API expects `interest=Travelling` style (title case slug). */
function interestToQueryValue(slug) {
  if (!slug || typeof slug !== 'string') {
    return '';
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * `user/matches` — limit, page, from_age, to_age, gender, repeated `interest`.
 * `type` is only for `user/home-page-data`; it is never sent here (stripped if passed).
 */
export function buildMatchesUrl(arg = {}) {
  const {type: _omitType, ...rest} = arg;
  const {
    limit = 20,
    page = 1,
    gender,
    from_age,
    to_age,
    interests,
  } = rest;

  const p = new URLSearchParams();
  p.set('limit', String(limit));
  p.set('page', String(page));

  if (from_age != null && String(from_age).trim() !== '') {
    p.set('from_age', String(from_age).trim());
  }
  if (to_age != null && String(to_age).trim() !== '') {
    p.set('to_age', String(to_age).trim());
  }
  if (gender) {
    p.set('gender', gender);
  }
  if (Array.isArray(interests)) {
    interests.forEach(i => {
      const v = interestToQueryValue(i);
      if (v) {
        p.append('interest', v);
      }
    });
  }

  return `${endpoints.home.matches.url}?${p.toString()}`;
}

/** Aligns with profile-details `readProfileLikeState` keys from feed `user` objects. */
function readFeedUserLikeFlag(u) {
  if (!u || typeof u !== 'object') {
    return false;
  }
  const keys = [
    'is_liked',
    'isLiked',
    'liked_by_me',
    'has_liked',
    'is_like',
    'liked',
  ];
  for (const k of keys) {
    const v = u[k];
    if (v === true || v === 1 || v === '1' || v === 'true') {
      return true;
    }
    if (v === false || v === 0 || v === '0' || v === 'false') {
      return false;
    }
  }
  return false;
}

function mapHomeUserToSocialItem(u, feedType) {

  if (!u || typeof u !== 'object') {
    return null;
  }
  const id = u._id ?? u.id;
  const addr =
    u?.location && typeof u.location === 'object' && u.location.address
      ? u.location.address
      : '';
  const cityLine = [u.city, u.state, u.country].filter(Boolean).join(', ');
  const location = addr || cityLine || '—';

  const paths = [];
  if (u.profile_image) {
    paths.push(u.profile_image);
  }
  if (u.image) {
    paths.push(u.image);
  }
  if (Array.isArray(u.images)) {
    paths.push(...u.images);
  }
  const seen = new Set();
  const images = paths.filter(p => p && !seen.has(p) && seen.add(p));

  const profileRouteParams = {
    _id: id,
    name: u.name,
    age: u.age,
    online: u.online,
    gender: u.gender,
    basicAge: u.age,
    basicGender: u.gender,
    liveIn: location,
    location,
    images: images.length ? images : undefined,
  };

  return {
    id,
    _id: id,
    name: u.name,
    age: u.age,
    location,
    images,
    isOnline: Boolean(u.online),
    isNew: feedType === 'new',
    isLiked: readFeedUserLikeFlag(u),
    profileRouteParams,
  };
}

function extractUsersList(response) {
  const d = response?.data;
  if (Array.isArray(d?.users)) {
    return d.users;
  }
  if (Array.isArray(d?.matches)) {
    return d.matches;
  }
  if (Array.isArray(response?.users)) {
    return response.users;
  }
  return [];
}

function pickFeedTotal(response) {
  const d = response?.data;
  if (typeof d?.total === 'number' && !Number.isNaN(d.total)) {
    return d.total;
  }
  if (typeof response?.total === 'number' && !Number.isNaN(response.total)) {
    return response.total;
  }
  return 0;
}

function normalizeFeedResponse(response, arg, feedTypeFallback) {
  const users = extractUsersList(response);
  const d = response?.data;
  const feedType = d?.type ?? arg?.type ?? feedTypeFallback ?? 'popular';
  return {
    users: users.map(u => mapHomeUserToSocialItem(u, feedType)).filter(Boolean),
    page: d?.page ?? arg?.page ?? 1,
    limit: d?.limit ?? arg?.limit ?? 10,
    total: pickFeedTotal(response),
    maxDistanceMeters: d?.maxDistanceMeters,
  };
}

export const homeApi = createApi({
  reducerPath: reducers.path.home,
  baseQuery,
  endpoints: builder => ({
    getHomePageData: builder.query({
      query: arg => ({
        url: buildHomePageDataUrl(arg),
        method: endpoints.home.pageData.method,
      }),
      transformResponse: (response, _meta, arg) =>
        normalizeFeedResponse(response, arg, arg?.type),
    }),
    getMatches: builder.query({
      query: arg => ({
        url: buildMatchesUrl(arg),
        method: endpoints.home.matches.method,
      }),
      transformResponse: (response, _meta, arg) =>
        normalizeFeedResponse(response, arg, 'popular'),
    }),
  }),
});

export const {
  useGetHomePageDataQuery,
  useLazyGetHomePageDataQuery,
  useLazyGetMatchesQuery,
} = homeApi;
