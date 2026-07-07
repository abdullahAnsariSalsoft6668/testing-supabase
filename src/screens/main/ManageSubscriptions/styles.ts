import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontFamily: fontFamily.bold,
        color: Colors.brandPurple,
    },
    content: {
        flex: 1,
        paddingHorizontal: moderateScale(16),
    },
    scrollContent: {
        paddingBottom: moderateScale(100),
    },
    subscriptionCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
        marginTop: moderateScale(16),
        marginBottom: moderateScale(24),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    billingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(8),
    },
    nextBilling: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.regular,
        color: Colors.textSecondary,
    },
    price: {
        fontSize: moderateScale(18),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    planName: {
        fontSize: moderateScale(20),
        fontFamily: fontFamily.bold,
        color: Colors.text,
        marginBottom: moderateScale(20),
    },
    upgradeButton: {
        alignSelf: 'stretch',
        borderRadius: moderateScale(24),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: fontFamily.bold,
        color: Colors.text,
        marginBottom: moderateScale(16),
    },
});

export default styles;
