import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import StoreAvatar from '@/components/grocery/StoreAvatar';
import TextComp from '@/components/TextComp';
import type { ProductDetail } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import SavingsBreakdown from './SavingsBreakdown';
import SavingsSummaryBox from './SavingsSummaryBox';

type ProductDetailsContentProps = {
    product: ProductDetail;
};

const TagIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
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

const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ product }) => (
    <View style={styles.sheet}>
        <View style={styles.storeRow}>
            <StoreAvatar initials={product.store.initials} color={product.store.color} />
            <TextComp text={product.store.name} style={styles.storeName} />
        </View>

        <TextComp text={product.title} style={styles.title} />
        <TextComp text={product.description} style={styles.description} />

        <View style={styles.breakdownHeader}>
            <TagIcon />
            <TextComp text="Savings Breakdown" style={styles.breakdownTitle} />
        </View>

        <SavingsBreakdown
            items={product.savingsBreakdown}
            finalPrice={product.price}
        />

        <SavingsSummaryBox
            totalSaved={product.totalSaved}
            savedPercentLabel={product.savedPercentLabel}
            savePercentBadge={product.savePercentBadge}
        />

        <View style={styles.cashbackRow}>
            <TextComp text="🪙" style={styles.cashbackEmoji} />
            <TextComp text={product.cashbackNote} style={styles.cashbackText} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    sheet: {
        backgroundColor: theme.colors.card.background,
        borderTopLeftRadius: moderateScale(28),
        borderTopRightRadius: moderateScale(28),
        marginTop: -moderateScale(28),
        paddingHorizontal: spaces.medium,
        paddingTop: spaces.large,
        paddingBottom: spaces.large,
        ...theme.shadows.card,
    },
    storeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: spaces.small,
    },
    storeName: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(20),
        lineHeight: moderateScale(26),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(8),
    },
    description: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(20),
        color: theme.colors.text.secondary,
        marginBottom: spaces.large,
    },
    breakdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: spaces.medium,
    },
    breakdownTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.brand.primary,
    },
    cashbackRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(8),
        marginTop: spaces.medium,
    },
    cashbackEmoji: {
        fontSize: moderateScale(16),
        lineHeight: moderateScale(20),
    },
    cashbackText: {
        flex: 1,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.secondary,
    },
});

export default ProductDetailsContent;
