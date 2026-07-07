import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { SavingsLineItem } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type SavingsBreakdownProps = {
    items: SavingsLineItem[];
    finalPrice: string;
};

const SavingsBreakdown: React.FC<SavingsBreakdownProps> = ({ items, finalPrice }) => (
    <View style={styles.card}>
        {items.map(item => (
            <View key={item.id} style={styles.row}>
                <View style={styles.labelRow}>
                    {item.id !== 'original' ? (
                        <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
                    ) : null}
                    <TextComp text={item.label} style={styles.label} />
                </View>
                <TextComp
                    text={item.amount}
                    style={[
                        styles.amount,
                        item.id === 'original' && styles.originalAmount,
                        item.id !== 'original' && { color: item.color },
                    ]}
                />
            </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
            <TextComp text="Final Price" style={styles.finalLabel} />
            <TextComp text={finalPrice} style={styles.finalPrice} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(10),
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    dot: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
    },
    label: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
    },
    amount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
    },
    originalAmount: {
        color: theme.colors.text.primary,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.border.default,
        marginVertical: moderateScale(4),
        marginBottom: moderateScale(12),
    },
    finalLabel: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    finalPrice: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        color: theme.colors.brand.primary,
    },
});

export default SavingsBreakdown;
