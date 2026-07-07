import { StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

export const privacyFirstStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: theme.colors.background.primary,
    },
    bodySheet: {
        marginTop: -moderateScale(22),
    },
});
