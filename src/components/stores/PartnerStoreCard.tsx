import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import type { PartnerStore, StoreBadgeType } from './constants';
import { STORE_BADGE_LABELS } from './constants';

const TagIcon = () => (
    <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
            stroke={theme.colors.brand.primary}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M7 7h.01"
            stroke={theme.colors.brand.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
        />
    </Svg>
);

const BADGE_STYLES: Record<StoreBadgeType, { bg: string; text: string }> = {
    topPartner: { bg: '#DCFCE7', text: palette.green.dark },
    mostDeals: { bg: '#FEF3C7', text: '#B45309' },
    bestValue: { bg: '#FCE7F3', text: palette.magenta.stat },
};

type PartnerStoreCardProps = {
    store: PartnerStore;
};

const PartnerStoreCard: React.FC<PartnerStoreCardProps> = ({ store }) => {
    const badgeStyle = store.badge ? BADGE_STYLES[store.badge] : null;

    return (
        <View style={styles.card}>
            <View style={[styles.imageWrap, { backgroundColor: store.imageBg }]}>
                <Text style={styles.emoji}>{store.emoji}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <TextComp text={store.name} style={styles.name} numberOfLines={1} />
                    {store.badge && badgeStyle ? (
                        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                            <TextComp
                                text={STORE_BADGE_LABELS[store.badge]}
                                style={[styles.badgeText, { color: badgeStyle.text }]}
                            />
                        </View>
                    ) : null}
                </View>
                <View style={styles.dealsRow}>
                    <TagIcon />
                    <TextComp text={`${store.dealsCount} Deals`} style={styles.dealsText} />
                </View>
                <TextComp text={store.categories} style={styles.categories} numberOfLines={1} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    imageWrap: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    emoji: {
        fontSize: moderateScale(32),
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(6),
        gap: moderateScale(6),
    },
    name: {
        flex: 1,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.text.primary,
    },
    badge: {
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(3),
    },
    badgeText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(10),
    },
    dealsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        marginBottom: moderateScale(4),
    },
    dealsText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        color: theme.colors.brand.primary,
    },
    categories: {
        fontSize: moderateScale(11),
        color: theme.colors.text.muted,
    },
});

export default PartnerStoreCard;
