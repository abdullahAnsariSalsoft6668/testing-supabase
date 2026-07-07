import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { ProductDetail } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import StoreHeaderRow from './StoreHeaderRow';
import SuccessSeal from './SuccessSeal';

type BarcodeRedeemedCardProps = {
    product: ProductDetail;
};

const BarcodeRedeemedCard: React.FC<BarcodeRedeemedCardProps> = ({ product }) => (
    <View style={styles.card}>
        <StoreHeaderRow product={product} savingsLabel="You save" />

        <View style={styles.divider} />

        <TextComp text={product.title} style={styles.title} />

        <SuccessSeal />
        <TextComp text="Redeemed!" style={styles.redeemedTitle} />
        <TextComp text="Savings applied successfully." style={styles.redeemedSubtitle} />
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(24),
        padding: spaces.large,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.border.default,
        marginVertical: spaces.medium,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        lineHeight: moderateScale(22),
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: spaces.large,
    },
    redeemedTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(26),
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: moderateScale(8),
    },
    redeemedSubtitle: {
        fontSize: moderateScale(14),
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
});

export default BarcodeRedeemedCard;
