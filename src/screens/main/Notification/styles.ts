import { nasalization } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export const NOTIFICATION_BG = '#000B09';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NOTIFICATION_BG,
    },
    background: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(40),
    },
    headerTitle: {
        fontFamily: nasalization.regular,
        fontSize: moderateScale(16),
        letterSpacing: moderateScale(1.2),
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontFamily: nasalization.regular,
        fontSize: moderateScale(18),
        color: Colors.white,
        letterSpacing: moderateScale(1),
        marginBottom: spaces.medium,
        marginTop: spaces.small,
    },
});

export default styles;
