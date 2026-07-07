import { lifeSavers, plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    itemCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(20),
        padding: moderateScale(14),
        marginBottom: moderateScale(12),
    
    },
    itemRow: {
        flexDirection: 'row',
    },
    imageWrap: {
        width: moderateScale(88),
        height: moderateScale(88),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.gray100,
        overflow: 'hidden',
        marginRight: moderateScale(14),
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    itemInfo: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'space-between',
    },
    itemHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    itemTextBlock: {
        flex: 1,
        paddingRight: moderateScale(4),
    },
    deleteBtn: {
        padding: moderateScale(4),
        marginTop: moderateScale(-2),
    },
    deleteGlyph: {
        fontSize: moderateScale(16),
        color: Colors.gray400,
        fontFamily: plusJakarta.regular,
    },
    itemTitle: {
        fontSize: moderateScale(16),
        color: Colors.text,
        fontFamily: lifeSavers.bold,
        lineHeight: moderateScale(22),
    },
    variantText: {
        marginTop: moderateScale(4),
        fontSize: moderateScale(13),
        color: Colors.gray400,
        fontFamily: plusJakarta.regular,
    },
    priceQtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: moderateScale(10),
    },
    itemPrice: {
        fontSize: moderateScale(16),
        color: Colors.text,
        fontFamily: plusJakarta.bold,
    },
});

export default styles;
