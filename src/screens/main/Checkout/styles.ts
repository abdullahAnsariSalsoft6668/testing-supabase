import { nasalization } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export const CHECKOUT_BG = '#0A1210';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CHECKOUT_BG,
    },
    background: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(110),
    },
    summaryWrap: {
        marginTop: moderateScale(24),
    },
    sectionTitle: {
        fontFamily: nasalization.regular,
        fontSize: moderateScale(18),
        color: Colors.white,
        letterSpacing: moderateScale(0.8),
        marginBottom: moderateScale(8),
    },
    sectionSubtitle: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(13),
        color: Colors.gray300,
        lineHeight: moderateScale(20),
        marginBottom: moderateScale(20),
    },
    payButton: {
        marginTop: moderateScale(4),
    },
});

export default styles;
