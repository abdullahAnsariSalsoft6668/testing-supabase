import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import fontFamily from '@/styles/fontFamily';
import { height, moderateScale, width } from '@/styles/scaling';
import { borders, spaces } from '@/styles/sizes';
import { I18nManager, StyleSheet } from 'react-native';

const OPTION_GAP = moderateScale(8);
const OPTION_MIN_WIDTH = (width - moderateScale(48) - OPTION_GAP * 2) / 3;

const styles = StyleSheet.create({
    cardContainerTall: {
        minHeight: height * 0.78,
    },
    introCard: {
        backgroundColor: palette.teal.surface,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(20),
        borderWidth: 1,
        borderColor: palette.sky.border,
    },
    introTitle: {
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: palette.neutral.text,
        marginBottom: moderateScale(4),
    },
    introMeta: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: palette.neutral.textSecondary,
        lineHeight: moderateScale(20),
    },
    roleBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
        backgroundColor: palette.teal.main,
        marginBottom: moderateScale(10),
    },
    roleBadgeText: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.bold,
        color: palette.neutral.white,
        letterSpacing: 0.4,
    },
    sectionLabel: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: palette.neutral.text,
        marginBottom: spaces.small,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    sectionHint: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: palette.neutral.textMuted,
        marginBottom: moderateScale(12),
        lineHeight: moderateScale(18),
    },
    sectionDivider: {
        height: 1,
        backgroundColor: palette.neutral.border,
        marginVertical: moderateScale(18),
    },
    optionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: OPTION_GAP,
        marginBottom: moderateScale(16),
    },
    optionGridFour: {
        gap: moderateScale(6),
    },
    optionChip: {
        minWidth: OPTION_MIN_WIDTH,
        flexGrow: 1,
        paddingVertical: moderateScale(11),
        paddingHorizontal: moderateScale(10),
        borderRadius: borders.preferenceBox,
        backgroundColor: palette.neutral.gray50,
        borderWidth: 1,
        borderColor: palette.neutral.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionChipSelected: {
        backgroundColor: palette.teal.surface,
        borderColor: palette.teal.main,
    },
    optionChipText: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: palette.neutral.textSecondary,
    },
    optionChipTextSelected: {
        color: palette.teal.dark,
        fontFamily: fontFamily.bold,
    },
    chipScroll: {
        marginBottom: moderateScale(16),
        gap: moderateScale(8),
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(8),
    },
    listChip: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(14),
        borderRadius: moderateScale(12),
        backgroundColor: palette.neutral.gray50,
        borderWidth: 1,
        borderColor: palette.neutral.border,
    },
    listChipSelected: {
        backgroundColor: palette.teal.surface,
        borderColor: palette.teal.main,
    },
    listChipText: {
        fontSize: moderateScale(13),
        color: palette.neutral.textSecondary,
    },
    listChipTextSelected: {
        color: palette.teal.dark,
        fontWeight: '600',
    },
});

export default styles;
