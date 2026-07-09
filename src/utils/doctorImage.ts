import { ImageSourcePropType } from 'react-native';

import { localImages } from '@/assets/images';

/** Dummy doctor photos from src/assets/images/index.ts (doctor1–doctor4). */
export const DOCTOR_PLACEHOLDER_IMAGES = [
    localImages.doctor1,
    localImages.doctor2,
    localImages.doctor3,
    localImages.doctor4,
] as const;

const hashId = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const isRemoteImage = (url: string) => /^https?:\/\//i.test(url);

/**
 * Returns a doctor avatar source.
 * - Uses remote profile_image only when it is a valid http(s) URL.
 * - Otherwise picks a stable placeholder from doctor-1.png … doctor-4.png.
 */
export function getDoctorImageSource(
    doctorId: string,
    profileImage?: string | null,
): ImageSourcePropType {
    const trimmed = profileImage?.trim();
    if (trimmed && isRemoteImage(trimmed)) return { uri: trimmed };
    return DOCTOR_PLACEHOLDER_IMAGES[hashId(doctorId) % DOCTOR_PLACEHOLDER_IMAGES.length];
}
