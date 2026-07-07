import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { height, moderateScale, width } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import { I18nManager, StyleSheet } from 'react-native';

const PREFERENCE_GAP = spaces.small;
const PREFERENCE_BOX_MIN_WIDTH = (width - moderateScale(48) - PREFERENCE_GAP) / 2;

const styles = StyleSheet.create({
    cardContainerTall: {
        minHeight: height * 0.72,
    },
    sectionLabel: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: palette.neutral.text,
        marginBottom: spaces.small,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    preferenceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -PREFERENCE_GAP / 2,
        marginBottom: spaces.medium,
    },
    preferenceBox: {
        width: PREFERENCE_BOX_MIN_WIDTH,
        minHeight: moderateScale(48),
        margin: PREFERENCE_GAP / 2,
        paddingVertical: spaces.small,
        paddingHorizontal: spaces.medium,
        borderRadius: borders.preferenceBox,
        backgroundColor: palette.neutral.cream,
        borderWidth: 1,
        borderColor: palette.neutral.gray100,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: spaces.small,
    },
    preferenceBoxSelected: {
        backgroundColor: palette.purple.surface,
        borderColor: palette.purple.main,
    },
    preferenceCheck: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(6),
        backgroundColor: palette.neutral.white,
        borderWidth: 1.5,
        borderColor: palette.neutral.gray300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    preferenceCheckSelected: {
        backgroundColor: palette.purple.main,
        borderColor: palette.purple.main,
    },
    preferenceCheckMark: {
        fontSize: moderateScale(12),
        color: palette.neutral.white,
        fontWeight: 'bold',
    },
    preferenceLabel: {
        flex: 1,
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: palette.neutral.text,
    },
});

export default styles;
