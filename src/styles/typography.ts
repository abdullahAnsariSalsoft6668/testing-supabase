import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';

/** Text style presets aligned with the homepage design system. */
export const typography = {
    display: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(32),
        lineHeight: moderateScale(38),
        letterSpacing: -0.5,
    },
    h1: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(28),
        lineHeight: moderateScale(34),
        letterSpacing: -0.3,
    },
    h2: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(22),
        lineHeight: moderateScale(28),
    },
    h3: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        lineHeight: moderateScale(24),
    },
    body: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
    },
    bodySmall: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
    },
    stat: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(24),
        lineHeight: moderateScale(30),
    },
    button: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        lineHeight: moderateScale(22),
    },
    tab: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(16),
    },
} as const;

export type Typography = typeof typography;
