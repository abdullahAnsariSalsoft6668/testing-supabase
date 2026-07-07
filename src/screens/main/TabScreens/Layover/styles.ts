import { LAYOVER_BG } from '@/components/layoverReport/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { LAYOVER_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LAYOVER_BG,
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
    multilineField: {
        minHeight: moderateScale(120),
        alignItems: 'flex-start',
        paddingVertical: moderateScale(12),
    },
    multilineInput: {
        minHeight: moderateScale(96),
        textAlignVertical: 'top',
        paddingTop: moderateScale(2),
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
        marginTop: moderateScale(4),
    },
});

export default styles;
