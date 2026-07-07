import { StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

export const insightsStyles = StyleSheet.create({
    scrollView: {
        backgroundColor: theme.colors.background.secondary,
    },
    bodySheet: {
        backgroundColor: theme.colors.background.secondary,
    },
    summaryCard: {
        marginTop: -moderateScale(4),
    },
});
