import { Platform, StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

/** Shared layout styles for purple-header tab screens (Deals, Cashback, Insights). */
export const tabScreenStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: moderateScale(120),
    },
    hero: {
        backgroundColor: theme.colors.background.header,
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(28),
        overflow: 'hidden',
        position: 'relative',
    },
    heroGrid: {
        ...StyleSheet.absoluteFill,
        zIndex: 0,
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        ...Platform.select({
            android: { elevation: 2 },
            default: {},
        }),
    },
    heroTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: moderateScale(6),
    },
    heroTitleBlock: {
        flex: 1,
        paddingRight: spaces.small,
    },
    pageTitle: {
        ...theme.typography.h1,
        color: theme.colors.text.inverse,
        fontSize: moderateScale(26),
        lineHeight: moderateScale(32),
    },
    pageSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.88)',
        marginTop: moderateScale(4),
    },
    heroAction: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    heroActionIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodySheet: {
        backgroundColor: theme.colors.background.primary,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: -moderateScale(22),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.medium,
        // ...theme.shadows.card,
    },
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    sectionBlock: {
        marginBottom: spaces.large,
    },
});

export type TabScreenStyles = typeof tabScreenStyles;
