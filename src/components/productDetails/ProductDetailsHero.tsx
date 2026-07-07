import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TextComp from '@/components/TextComp';
import { getDealImage } from '@/components/deals/constants';
import type { ProductDetail } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import ProductDetailsBackButton from './ProductDetailsBackButton';

type ProductDetailsHeroProps = {
    product: ProductDetail;
};

const ProductDetailsHero: React.FC<ProductDetailsHeroProps> = ({ product }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.hero, { backgroundColor: product.imageBg }]}>
            <View style={[styles.topBar, { paddingTop: insets.top + moderateScale(8) }]}>
                <ProductDetailsBackButton />
                <View style={styles.badges}>
                    {product.badge === 'bestDeal' ? (
                        <View style={styles.bestDealBadge}>
                            <TextComp text="★ Best Deal" style={styles.bestDealText} />
                        </View>
                    ) : null}
                    <View style={styles.discountBadge}>
                        <TextComp text={product.discountPercent} style={styles.discountText} />
                    </View>
                </View>
            </View>
            <View style={styles.imageWrap}>
                <Image
                    source={getDealImage(product.id)}
                    style={styles.productImage}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hero: {
        height: moderateScale(280),
        position: 'relative',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spaces.medium,
        zIndex: 2,
    },
    badges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    bestDealBadge: {
        backgroundColor: '#FCE7F3',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
    },
    bestDealText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: palette.magenta.stat,
    },
    discountBadge: {
        backgroundColor: palette.yellow.main,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
    },
    discountText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: palette.neutral.text,
    },
    imageWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spaces.large,
        paddingBottom: spaces.medium,
    },
    productImage: {
        width: '100%',
        height: '100%',
        maxHeight: moderateScale(180),
    },
});

export default ProductDetailsHero;
