import { plusJakarta, rufina } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';
import { palette } from '@/styles/palette';

/** Clinic type scale — Rufina display, Plus Jakarta Sans body. */
export const typography = {
    display: {
        fontFamily: rufina.bold,
        fontSize: moderateScale(32),
        lineHeight: moderateScale(38),
        letterSpacing: -0.4,
        color: palette.cream,
    },
    h1: {
        fontFamily: rufina.bold,
        fontSize: moderateScale(28),
        lineHeight: moderateScale(34),
        letterSpacing: -0.2,
        color: palette.cream,
    },
    h2: {
        fontFamily: rufina.bold,
        fontSize: moderateScale(22),
        lineHeight: moderateScale(28),
        color: palette.cream,
    },
    h3: {
        fontFamily: rufina.regular,
        fontSize: moderateScale(18),
        lineHeight: moderateScale(24),
        color: palette.cream,
    },
    body: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
        color: palette.cream,
    },
    bodySmall: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: palette.onCard.textSecondary,
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
        color: palette.cream,
    },
    stat: {
        fontFamily: plusJakarta.extraBold,
        fontSize: moderateScale(24),
        lineHeight: moderateScale(30),
        color: palette.cream,
    },
    button: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        lineHeight: moderateScale(22),
        letterSpacing: 1.2,
        textTransform: 'uppercase' as const,
        color: palette.ink,
    },
    tab: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(16),
    },
    homeGreeting: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
        color: palette.home.greeting,
    },
    homeName: {
        fontFamily: rufina.bold,
        fontSize: moderateScale(28),
        lineHeight: moderateScale(34),
        color: palette.cream,
    },
    seeAll: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
        color: palette.lime.main,
    },
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof typeof typography;
