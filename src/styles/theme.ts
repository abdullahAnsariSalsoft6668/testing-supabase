import { Platform } from 'react-native';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import { typography } from '@/styles/typography';

const cardShadow = Platform.select({
    ios: {
        shadowColor: '#1A1D26',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {},
});

const buttonShadow = Platform.select({
    ios: {
        shadowColor: palette.lime.main,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
});

export const theme = {
    palette,
    colors: {
        brand: {
            primary: palette.lime.main,
            primaryDark: palette.lime.dark,
            accent: palette.lime.highlight,
            success: palette.medical.success,
            stat: palette.medical.stat,
        },
        background: {
            primary: palette.olive.dark,
            secondary: palette.olive.deeper,
            header: palette.olive.dark,
            step: palette.olive.deeper,
            footer: palette.olive.deeper,
            gradient: [palette.olive.deeper, palette.olive.dark] as const,
        },
        text: {
            primary: palette.cream,
            secondary: palette.onCard.textSecondary,
            muted: palette.onCard.textMuted,
            inverse: palette.ink,
            accent: palette.lime.main,
            stat: palette.medical.stat,
            onAccent: palette.ink,
        },
        border: {
            default: palette.onCard.border,
            focus: palette.lime.main,
            error: palette.medical.error,
        },
        tab: {
            background: palette.olive.card,
            active: palette.lime.main,
            inactive: palette.olive.muted,
        },
        button: {
            primaryBackground: palette.lime.main,
            primaryText: palette.ink,
            secondaryBackground: palette.olive.deeper,
            secondaryText: palette.cream,
            disabledBackground: palette.olive.main,
            disabledText: palette.olive.muted,
        },
        card: {
            background: palette.olive.card,
            stepBackground: palette.olive.deeper,
        },
        badge: {
            background: palette.lime.surface,
            text: palette.lime.main,
        },
        status: {
            success: palette.medical.success,
            error: palette.medical.error,
            warning: palette.medical.warning,
            info: palette.medical.info,
            emergency: palette.medical.emergency,
        },
        onCard: palette.onCard,
    },
    typography,
    spacing: spaces,
    radius: {
        sm: moderateScale(8),
        md: moderateScale(12),
        lg: moderateScale(16),
        xl: moderateScale(20),
        card: moderateScale(20),
        appointmentCard: moderateScale(28),
        button: moderateScale(16),
        input: moderateScale(16),
        pill: moderateScale(9999),
        sheet: moderateScale(28),
        iconWash: moderateScale(22),
    },
    shadows: {
        card: cardShadow,
        button: buttonShadow,
        pillRefresh: Platform.select({
            ios: {
                shadowColor: 'rgba(26, 29, 38, 0.22)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
            default: {},
        }),
    },
    gradients: {
        screen: [palette.olive.deeper, palette.olive.dark] as const,
        header: [palette.olive.deeper, palette.olive.dark] as const,
        primaryButton: [palette.lime.highlight, palette.lime.main, palette.lime.dark] as const,
        barUnselected: [palette.olive.light, palette.lime.main] as const,
        barSelected: [palette.lime.main, palette.lime.dark] as const,
    },
    iconWash: {
        size: moderateScale(44),
        radius: moderateScale(22),
        background: 'rgba(15, 23, 42, 0.06)',
        accentBackground: palette.lime.main,
        accentIcon: palette.ink,
        metricSize: moderateScale(32),
        metricRadius: moderateScale(12),
    },
    components: {
        header: {
            backgroundColor: palette.olive.dark,
            titleColor: palette.cream,
            subtitleColor: palette.onCard.textSecondary,
        },
        primaryButton: {
            backgroundColor: palette.lime.main,
            textColor: palette.ink,
            borderRadius: moderateScale(16),
        },
        card: {
            backgroundColor: palette.olive.card,
            borderRadius: moderateScale(20),
            borderColor: 'rgba(15, 23, 42, 0.06)',
            ...cardShadow,
        },
        tabBar: {
            backgroundColor: palette.olive.card,
            activeTint: palette.lime.main,
            inactiveTint: palette.olive.muted,
            inset: moderateScale(12),
            radius: moderateScale(28),
            borderColor: palette.onCard.border,
        },
        input: {
            backgroundColor: palette.olive.deeper,
            borderRadius: moderateScale(16),
            height: moderateScale(48),
            borderColor: palette.onCard.border,
            focusBorderColor: palette.lime.main,
            errorBorderColor: palette.medical.error,
        },
        chip: {
            minHeight: moderateScale(44),
            unselectedBackground: palette.olive.deeper,
            selectedBackground: palette.lime.main,
        },
        toast: {
            backgroundColor: palette.olive.card,
            borderRadius: moderateScale(14),
            borderColor: palette.onCard.border,
        },
        modal: {
            backgroundColor: palette.olive.card,
            titleSize: moderateScale(22),
            pillRadius: moderateScale(26),
            backdropOpacity: 0.55,
        },
    },
} as const;

export type AppTheme = typeof theme;
