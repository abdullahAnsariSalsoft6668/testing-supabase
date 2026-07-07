import { Platform } from 'react-native';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import { typography } from '@/styles/typography';

const cardShadow = Platform.select({
    ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
    },
    android: { elevation: 3 },
    default: {},
});

export const theme = {
    palette,
    colors: {
        brand: {
            primary: palette.teal.main,
            primaryDark: palette.teal.dark,
            accent: palette.sky.main,
            success: palette.green.main,
            stat: palette.sky.accent,
        },
        background: {
            primary: palette.neutral.background,
            secondary: palette.neutral.screen,
            header: palette.teal.main,
            step: palette.sky.main,
            footer: palette.teal.dark,
        },
        text: {
            primary: palette.neutral.text,
            secondary: palette.neutral.textSecondary,
            muted: palette.neutral.textMuted,
            inverse: palette.neutral.white,
            accent: palette.teal.main,
            stat: palette.sky.accent,
            onAccent: palette.neutral.white,
        },
        border: {
            default: palette.neutral.border,
            focus: palette.teal.main,
        },
        tab: {
            background: palette.neutral.white,
            active: palette.teal.main,
            inactive: palette.neutral.textSecondary,
        },
        button: {
            primaryBackground: palette.teal.main,
            primaryText: palette.neutral.white,
            secondaryBackground: palette.neutral.white,
            secondaryText: palette.teal.main,
            disabledBackground: palette.neutral.gray200,
            disabledText: palette.neutral.textMuted,
        },
        card: {
            background: palette.neutral.card,
            stepBackground: palette.sky.main,
        },
        badge: {
            background: palette.teal.surface,
            text: palette.teal.dark,
        },
        status: {
            success: palette.status.confirmed,
            error: palette.status.error,
            warning: palette.status.warning,
            info: palette.status.info,
        },
    },
    typography,
    spacing: spaces,
    radius: {
        sm: moderateScale(8),
        md: moderateScale(12),
        lg: moderateScale(20),
        xl: moderateScale(24),
        pill: borders.cricle,
        button: moderateScale(12),
        card: moderateScale(16),
        input: borders.input,
    },
    shadows: { card: cardShadow },
    gradients: {
        header: [palette.teal.dark, palette.teal.main] as const,
        footer: [palette.teal.main, palette.teal.light] as const,
        highlight: [palette.sky.main, palette.teal.surface] as const,
    },
    components: {
        header: {
            backgroundColor: palette.teal.main,
            titleColor: palette.neutral.white,
            subtitleColor: 'rgba(255, 255, 255, 0.88)',
        },
        primaryButton: {
            backgroundColor: palette.teal.main,
            textColor: palette.neutral.white,
            borderRadius: moderateScale(12),
        },
        card: {
            backgroundColor: palette.neutral.card,
            borderRadius: moderateScale(16),
            ...cardShadow,
        },
        tabBar: {
            backgroundColor: palette.neutral.white,
            activeTint: palette.teal.main,
            inactiveTint: palette.neutral.textSecondary,
        },
    },
} as const;

export type AppTheme = typeof theme;
