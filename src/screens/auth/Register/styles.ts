import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { height, moderateScale } from '@/styles/scaling';
import { I18nManager, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    cardContainerTall: {
        minHeight: height * 0.78,
    },
    termsRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        marginBottom: moderateScale(20),
    },
    checkboxOuter: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(6),
        borderWidth: 1.5,
        borderColor: palette.neutral.gray300,
        marginTop: moderateScale(2),
        marginEnd: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.neutral.white,
    },
    checkboxInner: {
        width: moderateScale(12),
        height: moderateScale(12),
        borderRadius: moderateScale(4),
        backgroundColor: palette.teal.main,
    },
    termsTextBlock: {
        flex: 1,
    },
    termsText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: palette.neutral.textSecondary,
        lineHeight: moderateScale(20),
    },
    termsLink: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: palette.teal.main,
        textDecorationLine: 'underline',
    },
    termsError: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: palette.status.error,
        marginBottom: moderateScale(8),
    },
});

export default styles;
