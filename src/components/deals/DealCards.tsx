import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import StoreAvatar from '@/components/grocery/StoreAvatar';
import TextComp from '@/components/TextComp';
import { getDealImage } from '@/components/deals/constants';
import type { DealItem } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type DealCardProps = {
    deal: DealItem;
    onPress?: (deal: DealItem) => void;
};

const DealBadge: React.FC<{ type: NonNullable<DealItem['badge']> }> = ({ type }) => {
    if (type === 'none') return null;

    const isBest = type === 'bestDeal';
    return (
        <View style={[styles.badge, isBest ? styles.badgeBest : styles.badgeLimited]}>
            <Text style={[styles.badgeText, isBest ? styles.badgeTextBest : styles.badgeTextLimited]}>
                {isBest ? '★ Best Deal' : '● Limited'}
            </Text>
        </View>
    );
};

export const DealCard: React.FC<DealCardProps> = ({ deal, onPress }) => (
    <Pressable
        onPress={() => onPress?.(deal)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
    >
        <View style={[styles.imageWrap, { backgroundColor: deal.imageBg }]}>
            {deal.badge && deal.badge !== 'none' ? <DealBadge type={deal.badge} /> : null}
            <Image source={getDealImage(deal.id)} style={styles.productImage} resizeMode="cover" />
        </View>
        <View style={styles.storeRow}>
            <StoreAvatar initials={deal.store.initials} color={deal.store.color} />
            <TextComp text={deal.store.name} style={styles.storeName} numberOfLines={1} />
        </View>
        <TextComp text={deal.title} style={styles.title} numberOfLines={2} />
        <View style={styles.priceRow}>
            <TextComp text={deal.price} style={styles.price} />
            <TextComp text={deal.originalPrice} style={styles.originalPrice} />
        </View>
        {deal.saveLabel ? (
            <View style={styles.savePill}>
                <TextComp text={deal.saveLabel} style={styles.saveText} />
            </View>
        ) : null}
    </Pressable>
);

type DealCardRowProps = {
    deals: DealItem[];
    onDealPress?: (deal: DealItem) => void;
};

export const DealCardRow: React.FC<DealCardRowProps> = ({ deals, onDealPress }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onPress={onDealPress} />
        ))}
    </ScrollView>
);

export const TopDiscountRow: React.FC<{ deal: DealItem; onPress?: (deal: DealItem) => void }> = ({
    deal,
    onPress,
}) => (
    <Pressable
        onPress={() => onPress?.(deal)}
        style={({ pressed }) => [styles.listCard, pressed && styles.cardPressed]}
        accessibilityRole="button"
    >
        <View style={[styles.listImage, { backgroundColor: deal.imageBg }]}>
            <Image source={getDealImage(deal.id)} style={styles.listProductImage} resizeMode="cover" />
        </View>
        <View style={styles.listBody}>
            <TextComp text={deal.title} style={styles.listTitle} numberOfLines={2} />
            <View style={styles.storeRow}>
                <StoreAvatar initials={deal.store.initials} color={deal.store.color} size={moderateScale(18)} />
                <TextComp text={deal.store.name} style={styles.listStore} />
            </View>
        </View>
        <View style={styles.listPrices}>
            <TextComp text={deal.price} style={styles.listPrice} />
            <TextComp text={deal.originalPrice} style={styles.listOriginal} />
            {deal.discountLabel ? (
                <View style={styles.discountPill}>
                    <TextComp text={deal.discountLabel} style={styles.discountText} />
                </View>
            ) : null}
        </View>
    </Pressable>
);

const CARD_WIDTH = moderateScale(168);

const styles = StyleSheet.create({
    row: {
        gap: moderateScale(12),
        paddingRight: spaces.medium,
        marginVertical: spaces.small,
        marginHorizontal: spaces.tiny,
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    cardPressed: {
        opacity: 0.9,
    },
    imageWrap: {
        height: moderateScale(110),
        position: 'relative',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: moderateScale(8),
        left: moderateScale(8),
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(3),
    },
    badgeBest: {
        backgroundColor: '#FCE7F3',
    },
    badgeLimited: {
        backgroundColor: '#DCFCE7',
    },
    badgeText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(10),
    },
    badgeTextBest: {
        color: palette.magenta.stat,
    },
    badgeTextLimited: {
        color: palette.green.dark,
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        paddingHorizontal: spaces.small,
        marginTop: spaces.small,
    },
    storeName: {
        flex: 1,
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
    },
    title: {
        paddingHorizontal: spaces.small,
        marginTop: moderateScale(4),
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(18),
        color: theme.colors.text.primary,
        minHeight: moderateScale(36),
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        paddingHorizontal: spaces.small,
        marginTop: moderateScale(6),
    },
    price: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        color: theme.colors.brand.primary,
    },
    originalPrice: {
        fontSize: moderateScale(12),
        color: theme.colors.text.muted,
        textDecorationLine: 'line-through',
    },
    savePill: {
        alignSelf: 'flex-start',
        marginHorizontal: spaces.small,
        marginTop: moderateScale(8),
        marginBottom: spaces.small,
        backgroundColor: palette.neutral.cream,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
    },
    saveText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: '#EA580C',
    },
    listCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.md,
        padding: spaces.small,
        marginBottom: spaces.small,
        ...theme.shadows.card,
    },
    listImage: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(12),
        overflow: 'hidden',
    },
    listProductImage: {
        width: '100%',
        height: '100%',
    },
    listBody: {
        flex: 1,
        paddingHorizontal: spaces.small,
    },
    listTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(4),
    },
    listStore: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
    },
    listPrices: {
        alignItems: 'flex-end',
        minWidth: moderateScale(64),
    },
    listPrice: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        color: theme.colors.brand.primary,
    },
    listOriginal: {
        fontSize: moderateScale(11),
        color: theme.colors.text.muted,
        textDecorationLine: 'line-through',
    },
    discountPill: {
        marginTop: moderateScale(4),
        backgroundColor: palette.neutral.cream,
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(2),
    },
    discountText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: '#EA580C',
    },
});
