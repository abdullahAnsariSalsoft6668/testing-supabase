/**
 * Multipart body for `POST mobile/child-users`.
 * Do not set `Content-Type`; RTK `fetchBaseQuery` sets the multipart boundary.
 *
 * @param {{ name?: string, age?: string | number, image?: { uri: string, type?: string, name?: string, fileName?: string } | null }} payload
 * @returns {FormData}
 */
export function childUserToFormData({name, age, image}) {
  const fd = new FormData();
  fd.append('name', String(name ?? '').trim());
  fd.append('age', String(age ?? '').trim());

  const uri = image?.uri;
  if (uri) {
    const file = {
      uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || image.name || 'child.jpg',
    };
    fd.append('image', file);
  }

  return fd;
}
