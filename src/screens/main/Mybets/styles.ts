import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { StyleSheet } from 'react-native';

export const MY_BETS_BG = '#0A1210';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MY_BETS_BG,
    },
    background: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(110),
    },
});

export default styles;
