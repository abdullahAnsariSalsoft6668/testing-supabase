import { PROFILE_BG } from '@/components/profile/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { PROFILE_BG as EDIT_PROFILE_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PROFILE_BG,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        paddingBottom: moderateScale(110),
    },
    headerGradient: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.small,
        paddingBottom: moderateScale(24),
    },
    contentPanel: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(40),
        borderTopRightRadius: moderateScale(40),
        marginTop: moderateScale(-20),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.large,
        minHeight: moderateScale(420),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: plusJakarta.bold,
        color: '#001533',
        marginBottom: moderateScale(16),
    },
    formSection: {
        marginBottom: moderateScale(8),
    },
    updateButton: {
        width: '100%',
        marginTop: moderateScale(8),
    },
    updateButtonText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: Colors.white,
    },
});

export default styles;
