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
    listContent: {
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(100),
    },
});

export default styles;
