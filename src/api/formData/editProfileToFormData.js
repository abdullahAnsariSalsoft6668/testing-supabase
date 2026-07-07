/**
 * Builds multipart FormData for `PUT user/edit` from a partial patch.
 * Only keys present on `patch` are appended (partial updates).
 */

import { LOG } from '@/utils/helperFunction';
import { apiGenderValue } from './registerPayloadToFormData';

function appendLocation(fd, loc) {
  if (
    loc &&
    typeof loc === 'object' &&
    loc.type === 'Point' &&
    Array.isArray(loc.coordinates) &&
    loc.coordinates.length === 2
  ) {
    fd.append(
      'location',
      JSON.stringify({
        type: 'Point',
        coordinates: [Number(loc.coordinates[0]), Number(loc.coordinates[1])],
        ...(loc.address != null && loc.address !== ''
          ? { address: String(loc.address) }
          : {}),
      }),
    );
  }
}

/**
 * @param {Record<string, unknown>} patch API field names -> values
 * @returns {FormData}
 */
export function editProfilePatchToFormData(patch) {
  const fd = new FormData();
  if (!patch || typeof patch !== 'object') {
    return fd;
  }

  const appendText = (key, value) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    fd.append(key, typeof value === 'string' ? value : String(value));
  };

  for (const [key, raw] of Object.entries(patch)) {
    if (raw === undefined) {
      continue;
    }

    if (key === 'location') {
      appendLocation(fd, raw);
      continue;
    }

    if (key === 'gender' || key === 'looking_gender') {
      const v = apiGenderValue(raw);
      if (v) {
        fd.append(key, v);
      }
      continue;
    }

    if (typeof raw === 'boolean') {
      fd.append(key, raw ? 'true' : 'false');
      continue;
    }

    if (Array.isArray(raw)) {
      if (raw.length === 0) {
        continue;
      }
      fd.append(key, JSON.stringify(raw));
      continue;
    }

    if (raw === null) {
      appendText(key, '');
      continue;
    }

    appendText(key, raw);
  }

  return fd;
}

/**
 * Multipart `PUT user/edit` with **only** new gallery files — same `images` parts as signup
 * (`registerPayloadToFormData`). Omit other profile fields.
 *
 * @param {Array<{uri?: string, path?: string, type?: string, fileName?: string, name?: string}>} photos
 * @returns {FormData}
 */
export function editProfileImagesOnlyFormData(photos) {
  const fd = new FormData();
  const list = Array.isArray(photos) ? photos.filter(Boolean) : [];
  list.forEach((photo, index) => {
    const uri = photo?.uri ?? photo?.path;
    if (!uri) {
      return;
    }
    fd.append('image', {
      uri,
      type: photo?.type || 'image/jpeg',
      name: photo?.fileName || photo?.name || `photo_${index}.jpg`,
    });
    LOG('fdfdfdfd', fd)
  });
  return fd;
}
