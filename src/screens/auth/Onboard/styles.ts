import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { I18nManager, Platform, StyleSheet } from 'react-native';

export const ONBOARD_ACTIVE = palette.teal.main;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: palette.teal.dark,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    screenBody: {
        flex: 1,
        paddingHorizontal: moderateScale(20),
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(16),
    },
    brandWrap: {
        gap: moderateScale(2),
    },
    brandTitle: {
        color: palette.neutral.white,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        fontWeight: '700',
    },
    brandSubtitle: {
        color: 'rgba(255,255,255,0.78)',
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(12),
    },
    skipButton: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        paddingVertical: moderateScale(9),
        paddingHorizontal: moderateScale(14),
        borderRadius: moderateScale(22),
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.32)',
    },
    skipText: {
        color: palette.neutral.white,
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(14),
        fontWeight: '600',
    },
    mainCard: {
        flex: 1,
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(32),
        overflow: 'hidden',
        marginBottom: moderateScale(12),
        ...Platform.select({
            ios: {
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
            },
            android: { elevation: 8 },
        }),
    },
    slideCard: {
        flex: 1,
        overflow: 'hidden',
    },
    illustrationArea: {
        flex: 1,
        minHeight: moderateScale(260),
        overflow: 'hidden',
    },
    cardContent: {
        paddingHorizontal: moderateScale(28),
        paddingTop: moderateScale(24),
        paddingBottom: moderateScale(8),
        gap: moderateScale(22),
    },
    textBlock: {
        alignItems: 'center',
        gap: moderateScale(10),
    },
    rolePill: {
        alignSelf: 'center',
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(20),
        marginBottom: moderateScale(4),
    },
    rolePillText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    title: {
        color: theme.colors.text.primary,
        fontFamily: plusJakarta.bold,
        textAlign: 'center',
    },
    description: {
        color: theme.colors.text.secondary,
        fontFamily: plusJakarta.regular,
        textAlign: 'center',
        lineHeight: moderateScale(24),
        paddingHorizontal: moderateScale(4),
    },
    footerControls: {
        gap: verticalScale(16),
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    progressDot: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: palette.neutral.gray200,
    },
    progressDotActive: {
        width: moderateScale(28),
        backgroundColor: ONBOARD_ACTIVE,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.teal.main,
        borderRadius: moderateScale(16),
        ...Platform.select({
            ios: {
                shadowColor: palette.teal.dark,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.28,
                shadowRadius: 12,
            },
            android: { elevation: 5 },
        }),
    },
    ctaLabel: {
        color: palette.neutral.white,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        textAlign: 'center',
    },
});

export default styles;
