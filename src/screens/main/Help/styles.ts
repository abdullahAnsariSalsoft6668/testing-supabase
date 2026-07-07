import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:spaces.medium,
    },
    headerTitle: {
        fontSize: moderateScale(20),
        fontFamily: fontFamily.bold,
        color: Colors.brandPurple,
    },
    content: {
        flex: 1,
        paddingHorizontal:spaces.small,
    },
    listContent: {
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(100),
    },
});

export default styles;
