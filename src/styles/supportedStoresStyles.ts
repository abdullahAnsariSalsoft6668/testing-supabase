import { StyleSheet } from 'react-native';

import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

export const supportedStoresStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: theme.colors.background.secondary,
    },
    bodySheet: {
        backgroundColor: theme.colors.background.secondary,
        marginTop: -moderateScale(8),
    },
    sectionTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(4),
    },
    sectionSubtitle: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginBottom: spaces.medium,
        lineHeight: moderateScale(18),
    },
});
