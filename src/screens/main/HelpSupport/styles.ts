import { HELP_SUPPORT_BG } from '@/components/helpSupport/constants';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HELP_SUPPORT_BG,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        paddingBottom: moderateScale(40),
    },
    headerGradient: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.small,
    },
    contentPanel: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: moderateScale(-18),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.large,
    },
});

export default styles;
