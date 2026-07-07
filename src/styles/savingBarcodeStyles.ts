import { StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

export const savingBarcodeStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: theme.colors.background.secondary,
    },
    bodySheet: {
        backgroundColor: theme.colors.background.secondary,
        marginTop: -moderateScale(22),
        paddingBottom: spaces.small,
    },
    footer: {
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.medium,
    },
    privacyBelowCard: {
        marginTop: spaces.small,
        marginBottom: spaces.medium,
    },
});
