import { ALERTS_BG } from '@/components/alerts/constants';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export { ALERTS_BG };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ALERTS_BG,
    },
    screen: {
        flex: 1,
    },
    headerBlock: {
        zIndex: 10,
        elevation: 10,
    },
    headerGradient: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.small,
        paddingBottom: spaces.small,
    },
    listWrapper: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        overflow: 'hidden',
    },
    list: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    listContent: {
        paddingTop: spaces.large,
        paddingBottom: moderateScale(110),
    },
    itemContainer: {
        paddingHorizontal: spaces.medium,
    },
    emptyState: {
        paddingVertical: moderateScale(40),
        alignItems: 'center',
        paddingHorizontal: spaces.medium,
    },
    emptyText: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
});

export default styles;
