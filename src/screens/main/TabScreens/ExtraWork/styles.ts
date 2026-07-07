import { EXTRA_WORK_BG } from '@/components/extraWorkSubmit/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { EXTRA_WORK_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: EXTRA_WORK_BG,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        paddingBottom: moderateScale(120),
    },
    headerGradient: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.small,
    },
    formPanel: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: moderateScale(-18),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.large,
    },
    formRow: {
        flexDirection: 'row',
        gap: moderateScale(12),
    },
    formRowItem: {
        flex: 1,
    },
    submitButton: {
        width: '100%',
        marginTop: moderateScale(8),
    },
    submitButtonText: {
        color: Colors.white,
        fontFamily: plusJakarta.bold,
    },
    disclaimer: {
        marginTop: moderateScale(14),
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        textAlign: 'center',
        lineHeight: moderateScale(18),
    },
    documentsSection: {
        marginTop: moderateScale(8),
    },
});

export default styles;
