import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { StyleSheet, I18nManager } from 'react-native';

const styles = StyleSheet.create({
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    rememberRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    checkbox: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(6),
        borderWidth: 1.5,
        borderColor: palette.neutral.gray300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.neutral.white,
    },
    checkboxChecked: {
        backgroundColor: palette.teal.main,
        borderColor: palette.teal.main,
    },
    rememberText: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: palette.neutral.textSecondary,
    },
    forgotLink: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: palette.teal.main,
    },
});

export default styles;
