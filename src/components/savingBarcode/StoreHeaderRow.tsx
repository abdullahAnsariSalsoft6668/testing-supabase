import React from 'react';
import { StyleSheet, View } from 'react-native';

import StoreAvatar from '@/components/grocery/StoreAvatar';
import TextComp from '@/components/TextComp';
import type { ProductDetail } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

type StoreHeaderRowProps = {
    product: ProductDetail;
    savingsLabel?: string;
};

const StoreHeaderRow: React.FC<StoreHeaderRowProps> = ({ product, savingsLabel }) => {
    const saveAmount = product.totalSaved.startsWith('$')
        ? `-${product.totalSaved}`
        : `-$${product.totalSaved}`;

    return (
        <View style={styles.row}>
            <View style={styles.storeBlock}>
                <StoreAvatar
                    initials={product.store.initials}
                    color={product.store.color}
                    size={moderateScale(44)}
                />
                <View style={styles.storeText}>
                    <TextComp text={product.store.name} style={styles.storeName} />
                    <TextComp text="Scan at checkout" style={styles.storeHint} />
                </View>
            </View>
            {savingsLabel ? (
                <View style={styles.saveBlock}>
                    <TextComp text={saveAmount} style={styles.saveAmount} />
                    <TextComp text={savingsLabel} style={styles.saveLabel} />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    storeBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        flex: 1,
    },
    storeText: {
        flex: 1,
    },
    storeName: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        color: theme.colors.text.primary,
    },
    storeHint: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
    },
    saveBlock: {
        alignItems: 'flex-end',
        marginLeft: moderateScale(8),
    },
    saveAmount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        color: theme.colors.text.primary,
    },
    saveLabel: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
    },
});

export default StoreHeaderRow;
