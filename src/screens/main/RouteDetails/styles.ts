import { ROUTE_DETAILS_BG } from '@/components/routeDetails/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { ROUTE_DETAILS_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ROUTE_DETAILS_BG,
    },
    screen: {
        flex: 1,
    },
    headerGradient: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.small,
        paddingBottom: moderateScale(28),
    },
    contentPanel: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: moderateScale(-18),
        overflow: 'hidden',
    },
    list: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    listContent: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: moderateScale(120),
    },
    listHeader: {
        gap: moderateScale(14),
    },
    stopItem: {
        marginBottom: moderateScale(2),
    },
});

export default styles;
