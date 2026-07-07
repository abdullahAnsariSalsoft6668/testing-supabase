import { WAGE_BG } from '@/components/wageOverview/constants';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { WAGE_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WAGE_BG,
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
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(12),
        justifyContent: 'space-between',
    },
});

export default styles;
