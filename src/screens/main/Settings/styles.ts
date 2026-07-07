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
        fontSize: moderateScale(20),
        fontFamily: fontFamily.bold,
        color: Colors.text,
    },
    content: {
        flex: 1,
        paddingTop: moderateScale(8),
    },
    sectionTitle: {
        fontSize: moderateScale(22),
        fontFamily: fontFamily.bold,
        color: '#232323',
        marginBottom: moderateScale(14),
    },
    preferenceCard: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(18),
        minHeight: moderateScale(66),
        paddingHorizontal: moderateScale(16),
        marginBottom: moderateScale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrap: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: '#F8F8F8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(12),
        borderWidth: 1,
        borderColor: Colors.gray100,
    },
    preferenceText: {
        fontSize: moderateScale(16),
        fontFamily: fontFamily.regular,
        color: '#222B3A',
    },
});

export default styles;