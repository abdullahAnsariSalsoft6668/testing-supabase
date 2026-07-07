import { SETTINGS_BG } from '@/components/settings/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { SETTINGS_BG as PRIVACY_SETTINGS_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: SETTINGS_BG,
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
        marginBottom: moderateScale(6),
    },
    sectionSubtitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        marginBottom: moderateScale(20),
    },
});

export default styles;
