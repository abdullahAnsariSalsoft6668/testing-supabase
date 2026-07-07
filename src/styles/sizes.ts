import { moderateScale } from '@/styles/scaling';

export const borders = {
    button: moderateScale(12),
    card: moderateScale(20),
    cricle: 9999,
    input: moderateScale(14),
    preferenceBox: moderateScale(20),
    step: moderateScale(12),
} as const;

export const spaces = {
    tiny: moderateScale(4),
    small: moderateScale(8),
    medium: moderateScale(16),
    large: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(40),
} as const;

export const heights = {
    input: moderateScale(48),
    loginCard: moderateScale(240),
} as const;

export type Borders = typeof borders;
export type Spaces = typeof spaces;
