import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spaces.medium,
    },
    headerTitle: {
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(20),
        color: Colors.text,
    },
    content: {
        flex: 1,
        paddingTop: moderateScale(10),
    },
    quickLinksRow: {
        flexDirection: 'row',
        gap: moderateScale(14),
    },
    quickLinkCard: {
        flex: 1,
        borderRadius: moderateScale(22),
        paddingHorizontal: moderateScale(18),
        paddingVertical: moderateScale(20),
        minHeight: moderateScale(138),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    faqCard: {
        backgroundColor: '#e7eaf5',
    },
    supportCard: {
        backgroundColor: '#efe4f0',
    },
    quickLinkIconWrap: {
        width: moderateScale(46),
        height: moderateScale(46),
        borderRadius: moderateScale(14),
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(18),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    quickLinkTitle: {
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(18),
        color: '#1E2430',
        marginBottom: moderateScale(8),
    },
    quickLinkSubtitle: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(15),
        lineHeight: moderateScale(22),
        color: '#5f6674',
    },
    trendingBlock: {
        marginTop: moderateScale(24),
        backgroundColor: Colors.white,
        borderRadius: moderateScale(22),
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(20),
    },
    trendingTitle: {
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(22),
        color: '#1E2430',
        marginBottom: moderateScale(10),
    },
    articleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScale(9),
    },
    articleText: {
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(18),
        color: '#3d4554',
    },
});

export default styles;
