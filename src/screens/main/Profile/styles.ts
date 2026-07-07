import { PROFILE_BG } from '@/components/profile/constants';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { PROFILE_BG };

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
        paddingBottom: moderateScale(12),
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
});

export default styles;
