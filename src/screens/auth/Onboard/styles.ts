import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale, verticalScale } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import { I18nManager, Platform, StyleSheet } from 'react-native';

export const ONBOARD_ACTIVE = palette.yellow.main;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: palette.purple.main,
    },
    heroSection: {
        overflow: 'hidden',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    carouselLayer: {
        flex: 1,
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    heroFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: verticalScale(80),
    },
    skipWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        paddingHorizontal: moderateScale(20),
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(12),
    },
    heroLogo: {
        flexShrink: 1,
    },
    skipButton: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(6),
    },
    skipText: {
        color: Colors.white,
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(15),
    },
    bottomCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: borders.card,
        borderTopRightRadius: borders.card,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    bottomContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    textBlock: {
        flexShrink: 1,
    },
    title: {
        color: Colors.text,
        fontFamily: plusJakarta.bold,
        textAlign: 'left',
        marginBottom: verticalScale(8),
    },
    description: {
        color: Colors.textSecondary,
        fontFamily: plusJakarta.regular,
        textAlign: 'left',
        marginBottom: verticalScale(14),
    },
    footerControls: {
        gap: verticalScale(16),
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    progressBar: {
        flex: 1,
        height: moderateScale(4),
        borderRadius: moderateScale(2),
        backgroundColor: Colors.gray100,
    },
    progressBarActive: {
        backgroundColor: ONBOARD_ACTIVE,
    },
    ctaButton: {
        position: 'relative',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        borderRadius: moderateScale(14),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    ctaIconPanel: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    ctaIconRtl: {
        transform: [{ scaleX: -1 }],
    },
    ctaLabelWrap: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: moderateScale(50),
    },
    ctaLabel: {
        color: Colors.text,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        textAlign: 'center',
    },
});

export default styles;
