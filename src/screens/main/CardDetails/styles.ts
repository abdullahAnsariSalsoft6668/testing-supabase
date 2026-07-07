import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray100,
    },
    content: {
        flex: 1,
        paddingHorizontal: moderateScale(16),
    },
    scrollContent: {
        paddingTop: moderateScale(8),
        paddingBottom: moderateScale(140),
    },
    cardPreview: {
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        minHeight: moderateScale(168),
        marginBottom: moderateScale(16),
    },
    cardPreviewTop: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardMaskedNumber: {
        color: Colors.white,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(26),
        letterSpacing: moderateScale(1),
        marginTop: moderateScale(52),
    },
    cardPreviewBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardName: {
        color: Colors.white,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(34 / 2),
    },
    cardExpiry: {
        color: Colors.white,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(30 / 2),
    },
    inputSection: {
        marginBottom: moderateScale(16),
    },
    inputWrap: {
        marginBottom: moderateScale(10),
    },
    inputContainer: {
        height: moderateScale(50),
        borderWidth: 0,
        borderRadius: moderateScale(25),
        backgroundColor: Colors.surface,
        paddingHorizontal: moderateScale(14),
        paddingVertical: 0,
    },
    inputText: {
        color: Colors.gray700,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(16),
    },
    rowInputs: {
        flexDirection: 'row',
        gap: moderateScale(10),
    },
    rowInputLeft: {
        flex: 2,
    },
    rowInputRight: {
        flex: 1,
    },
    summarySection: {
        backgroundColor: Colors.surface,
        borderRadius: moderateScale(16),
        padding: moderateScale(14),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(10),
    },
    summaryLabel: {
        color: Colors.gray500,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(16),
    },
    summaryValue: {
        color: Colors.gray500,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(16),
    },
    summaryDivider: {
        height: 1,
        backgroundColor: Colors.gray200,
        marginVertical: moderateScale(4),
    },
    summaryTotalRow: {
        marginBottom: 0,
        marginTop: moderateScale(4),
    },
    summaryTotalLabel: {
        color: Colors.gray700,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
    },
    summaryTotalValue: {
        color: Colors.gray700,
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
    },
    bottomButtonWrap: {
        position: 'absolute',
        left: moderateScale(16),
        right: moderateScale(16),
        bottom: moderateScale(16),
    },
    bottomButton: {
        borderRadius: moderateScale(26),
    },
});

export default styles;
