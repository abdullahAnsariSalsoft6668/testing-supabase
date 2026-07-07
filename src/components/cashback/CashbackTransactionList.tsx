import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import StoreAvatar from '@/components/grocery/StoreAvatar';
import TextComp from '@/components/TextComp';
import type { CashbackTransaction } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type CashbackTransactionListProps = {
    items: CashbackTransaction[];
};

const STATUS_LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    settled: 'Settled',
} as const;

const CashbackTransactionRow: React.FC<{ item: CashbackTransaction }> = ({ item }) => (
    <View style={styles.row}>
        <StoreAvatar
            initials={item.store.initials}
            color={item.store.color}
            size={moderateScale(40)}
        />
        <View style={styles.body}>
            <TextComp text={item.title} style={styles.title} numberOfLines={1} />
            <TextComp
                text={`${item.store.name} • ${item.date}`}
                style={styles.subtitle}
                numberOfLines={1}
            />
        </View>
        <View style={styles.trailing}>
            <TextComp text={item.amount} style={styles.amount} />
            <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <TextComp text={STATUS_LABELS[item.status]} style={styles.statusText} />
            </View>
        </View>
    </View>
);

const CashbackTransactionList: React.FC<CashbackTransactionListProps> = ({ items }) => (
    <View style={styles.list}>
        {items.map(item => (
            <CashbackTransactionRow key={item.id} item={item} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    list: {
        marginBottom: spaces.medium,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: palette.neutral.gray100,
    },
    body: {
        flex: 1,
        paddingHorizontal: spaces.small,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(2),
    },
    subtitle: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
    },
    trailing: {
        alignItems: 'flex-end',
    },
    amount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.brand.primary,
        marginBottom: moderateScale(4),
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
    },
    statusDot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: palette.yellow.main,
    },
    statusText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: palette.yellow.dark,
    },
});

export default CashbackTransactionList;
