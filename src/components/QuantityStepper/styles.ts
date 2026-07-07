import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    qtyStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(12),
    },
    qtyIconBtn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: moderateScale(16),
        color: '#000000',
        fontFamily: fontFamily.bold,
        minWidth: moderateScale(20),
        textAlign: 'center',
    },
});

export default styles;
