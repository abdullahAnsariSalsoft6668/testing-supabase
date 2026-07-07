import { Platform, StyleSheet } from 'react-native';

import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

/** Reusable homepage layout + surface styles (Ultimate Grocery design). */
export const homeStyles = StyleSheet.create({
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
        paddingTop: spaces.medium,
        paddingBottom: moderateScale(32),
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
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: moderateScale(10),
    },
    heroTitle: {
        ...theme.typography.h1,
        color: theme.colors.text.inverse,
    },
    heroHighlight: {
        backgroundColor: theme.colors.brand.accent,
        borderRadius: theme.radius.sm,
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(2),
        marginHorizontal: moderateScale(4),
    },
    heroHighlightText: {
        ...theme.typography.h1,
        color: theme.colors.text.onAccent,
    },
    heroSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: moderateScale(18),
    },
    heroNote: {
        ...theme.typography.bodySmall,
        color: 'rgba(255, 255, 255, 0.75)',
        textAlign: 'center',
        marginTop: moderateScale(12),
    },
    bodySection: {
        backgroundColor: theme.colors.background.primary,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: -moderateScale(22),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.medium,
        ...theme.shadows.card,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginBottom: spaces.medium,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spaces.xl,
    },
    statCard: {
        width: '48%',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    statValue: {
        ...theme.typography.stat,
        color: theme.colors.text.stat,
        marginTop: moderateScale(8),
        marginBottom: moderateScale(4),
    },
    statLabel: {
        ...theme.typography.bodySmall,
        color: theme.colors.text.primary,
    },
    statIconWrap: {
        alignSelf: 'flex-start',
        marginBottom: moderateScale(2),
    },
    stepList: {
        marginBottom: spaces.xl,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: spaces.medium,
    },
    stepRail: {
        alignItems: 'center',
        width: moderateScale(36),
        marginRight: moderateScale(10),
    },
    stepDot: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        backgroundColor: theme.colors.brand.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotText: {
        ...theme.typography.label,
        color: theme.colors.text.onAccent,
    },
    stepLine: {
        flex: 1,
        width: moderateScale(2),
        backgroundColor: theme.colors.brand.accent,
        marginTop: moderateScale(4),
        opacity: 0.45,
    },
    stepCard: {
        flex: 1,
        backgroundColor: theme.colors.background.step,
        borderRadius: theme.radius.md,
        padding: spaces.medium,
    },
    stepTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: moderateScale(4),
    },
    stepDescription: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    testimonialCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    testimonialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spaces.small,
    },
    testimonialAvatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: theme.colors.background.step,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.small,
    },
    testimonialAvatarText: {
        ...theme.typography.label,
        color: theme.colors.brand.primary,
    },
    testimonialName: {
        ...theme.typography.label,
        color: theme.colors.text.primary,
    },
    testimonialStars: {
        ...theme.typography.bodySmall,
        color: theme.colors.brand.accent,
        marginTop: moderateScale(2),
    },
    testimonialQuote: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        fontStyle: 'italic',
    },
    footerCta: {
        backgroundColor: theme.colors.background.footer,
        borderRadius: theme.radius.xl,
        padding: spaces.large,
        alignItems: 'center',
        marginTop: spaces.small,
    },
    footerIconWrap: {
        marginBottom: spaces.small,
    },
    footerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.inverse,
        textAlign: 'center',
        marginBottom: spaces.small,
    },
    footerSubtitle: {
        ...theme.typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: spaces.large,
    },
});

export type HomeStyles = typeof homeStyles;
