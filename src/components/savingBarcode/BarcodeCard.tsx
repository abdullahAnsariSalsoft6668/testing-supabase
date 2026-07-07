import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { ProductDetail } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import BarcodeVisual from './BarcodeVisual';
import SavingsBadgeRow from './SavingsBadgeRow';
import StoreHeaderRow from './StoreHeaderRow';
import { getBarcodeSavingsBadges } from './constants';

type BarcodeCardProps = {
    product: ProductDetail;
    barcodeCode: string;
};

const BarcodeCard: React.FC<BarcodeCardProps> = ({ product, barcodeCode }) => {
    const badges = getBarcodeSavingsBadges(product);

    return (
        <View style={styles.card}>
            <StoreHeaderRow product={product} />

            <TextComp text={product.title} style={styles.title} />
            <BarcodeVisual code={barcodeCode} />
            <SavingsBadgeRow badges={badges} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(24),
        padding: spaces.large,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        lineHeight: moderateScale(21),
        color: theme.colors.text.primary,
        marginTop: spaces.medium,
        marginBottom: spaces.medium,
    },
});

export default BarcodeCard;
