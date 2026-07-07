import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { borders, heights, spaces } from '@/styles/sizes';
import { Platform, StyleSheet } from 'react-native';

export const AUTH_BG_BASE = palette.teal.main;

const inputShadow = Platform.select({
    ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    android: {
        elevation: 3,
    },
    default: {},
});

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerBand: {
        overflow: 'hidden',
        backgroundColor: AUTH_BG_BASE,
    },
    headerContent: {
        flex: 1,
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(24),
    },
    headerMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(6),
    },
    headerTitle: {
        fontSize: moderateScale(24),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.88)',
        textAlign: 'center',
        lineHeight: moderateScale(20),
        paddingHorizontal: moderateScale(12),
    },
    backButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(8),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitleContainer: {
        gap: moderateScale(10),
    },
    formIntro: {
        gap: moderateScale(10),
        marginBottom: moderateScale(22),
    },
    formTitle: {
        fontSize: moderateScale(26),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        letterSpacing: -0.3,
        lineHeight: moderateScale(32),
    },
    formSubtitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.textSecondary,
        lineHeight: moderateScale(22),
    },
    formNote: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.textSecondary,
        lineHeight: moderateScale(18),
        marginTop: moderateScale(2),
    },
    welcomeTitle: {
        fontSize: moderateScale(30),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        letterSpacing: -0.4,
        lineHeight: moderateScale(36),
    },
    welcomeSubtitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: moderateScale(22),
    },
    headerNote: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: moderateScale(18),
        marginTop: moderateScale(4),
    },
    formArea: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: -moderateScale(24),
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: moderateScale(40),
    },
    inputContainer: {
        marginBottom: moderateScale(18),
    },
    inputLabel: {
        color: Colors.text,
        marginLeft: 0,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        marginBottom: moderateScale(2),
    },
    inputField: {
        backgroundColor: Colors.white,
        borderColor: palette.neutral.border,
        borderRadius: moderateScale(14),
        borderWidth: 1,
        height: heights.input,
        ...inputShadow,
    },
    actionButton: {
        width: '100%',
        marginTop: moderateScale(12),
    },
    actionButtonText: {
        color: Colors.text,
        fontFamily: fontFamily.bold,
    },
    otpWrap: {
        alignItems: 'center',
        marginTop: moderateScale(8),
        marginBottom: moderateScale(8),
    },
    otpInputContainer: {
        justifyContent: 'center',
        gap: moderateScale(12),
        alignSelf: 'center',
        width: moderateScale(52 * 4 + 12 * 3),
    },
    otpError: {
        color: Colors.error,
        marginTop: moderateScale(10),
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        alignSelf: 'center',
    },
    resendPressable: {
        alignSelf: 'center',
        marginTop: moderateScale(18),
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(12),
    },
    resendText: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.bold,
        color: palette.teal.main,
        textDecorationLine: 'underline',
    },
});

export default styles;
