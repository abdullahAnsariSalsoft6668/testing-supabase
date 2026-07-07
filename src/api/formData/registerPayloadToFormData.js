/**
 * Converts signup / CompleteProfile values into multipart `FormData` for `POST user/auth/create`.
 * Do not set `Content-Type` manually; the client must add the multipart boundary.
 */

/** API allows `man` | `women` (UI uses `woman`). */
export function apiGenderValue(raw) {
  if (raw == null || raw === '') {
    return '';
  }
  const s = String(raw).trim().toLowerCase();
  if (s === 'woman') {
    return 'women';
  }
  return s;
}

export function registerPayloadToFormData(values) {
  const fd = new FormData();

  const name = [values?.firstName, values?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
  if (name) {
    fd.append('name', name);
  }

  const appendText = (key, value) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    fd.append(key, typeof value === 'string' ? value : String(value));
  };

  appendText('email', values?.email);
  appendText('password', values?.password);
  appendText('phoneNo', values?.phoneNo ?? values?.phone);

  appendText('gender', apiGenderValue(values?.gender));
  appendText('looking_gender', apiGenderValue(values?.lookingFor));

  const ageNum = Number.parseInt(String(values?.age ?? '').trim(), 10);
  if (Number.isFinite(ageNum)) {
    fd.append('age', String(ageNum));
  }
  appendText('country', values?.country);
  appendText('state', values?.state);
  appendText('city', values?.city);

  if (Array.isArray(values?.region) && values.region.length) {
    fd.append('region', JSON.stringify(values.region));
  }

  const loc = values?.location;
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
          ? {address: String(loc.address)}
          : {}),
      }),
    );
  }

  if (Array.isArray(values?.relationshipType) && values.relationshipType.length) {
    fd.append('relationship', JSON.stringify(values.relationshipType));
  }

  const fromAge = Number.parseInt(String(values?.ageFrom ?? '').trim(), 10);
  if (Number.isFinite(fromAge)) {
    fd.append('from_age', String(fromAge));
  }
  const toAge = Number.parseInt(String(values?.ageTo ?? '').trim(), 10);
  if (Number.isFinite(toAge)) {
    fd.append('to_age', String(toAge));
  }
  appendText('ethnicity', values?.ethnicity);
  appendText('religion', values?.religion);
  appendText('alcohol', values?.alcohol);
  appendText('smoker', values?.smoking);
  appendText('children', values?.hasChildren);
  appendText('marital_status', values?.maritalStatus);

  const photos = Array.isArray(values?.photos) ? values.photos : [];
  photos.forEach((photo, index) => {
    const uri = photo?.uri ?? photo?.path;
    if (!uri) {
      return;
    }
    const imageObj = {
      uri,
      type: photo?.type || 'image/jpeg',
      name: photo?.fileName || photo?.name || `photo_${index}.jpg`,
    };
    // let convertIntoString = JSON.stringify(imageObj);
    fd.append('images', imageObj);
  });

  return fd;
}
