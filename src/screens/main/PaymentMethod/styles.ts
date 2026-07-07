import { lifeSavers, plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { Platform, StyleSheet } from 'react-native';

export const PAYMENT_GRADIENT_BOTTOM = Colors.gradientPrimary[1];
/** Matches checkout / cart accent */
export const PAYMENT_ACCENT = '#B38646';

const styles = StyleSheet.create({
    gradientRoot: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerPad: {
        paddingHorizontal: spaces.medium,
    },
    headerTitle: {
        fontFamily: lifeSavers.bold,
        fontSize: moderateScale(20),
        color: Colors.text,
    },
    headerBackBtn: {
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bellWrap: {
        position: 'relative',
    },
    bellButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: moderateScale(40),
        height: moderateScale(40),
    },
    notificationDot: {
        position: 'absolute',
        top: moderateScale(6),
        right: moderateScale(6),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1.5,
        borderColor: PAYMENT_GRADIENT_BOTTOM,
    },
    content: {
        flex: 1,
        paddingHorizontal: spaces.medium,
    },
    listContent: {
        paddingTop: moderateScale(8),
        paddingBottom: moderateScale(32),
    },
    sectionSubtitle: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(13),
        color: Colors.gray400,
        marginBottom: moderateScale(14),
    },
    addCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(10),
        borderRadius: moderateScale(22),
        backgroundColor: Colors.white,
        marginTop: moderateScale(4),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(18),
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    addCardButtonText: {
        fontSize: moderateScale(15),
        fontFamily: plusJakarta.bold,
        color: PAYMENT_ACCENT,
    },
});

export default styles;
