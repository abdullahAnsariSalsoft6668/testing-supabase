import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { CashbackStatusSummary } from '@/components/cashback/constants';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type CashbackStatusCardsProps = {
    cards: CashbackStatusSummary[];
    activeId: CashbackStatusSummary['id'];
    onSelect: (id: CashbackStatusSummary['id']) => void;
};

const CARD_STYLES = {
    pending: {
        bg: palette.neutral.cream,
        amount: '#B45309',
        label: '#92400E',
        count: '#A16207',
    },
    processing: {
        bg: palette.neutral.gray50,
        amount: palette.neutral.gray400,
        label: palette.neutral.gray400,
        count: palette.neutral.textMuted,
    },
    settled: {
        bg: palette.neutral.gray50,
        amount: palette.neutral.gray400,
        label: palette.neutral.gray400,
        count: palette.neutral.textMuted,
    },
} as const;

const CashbackStatusCards: React.FC<CashbackStatusCardsProps> = ({
    cards,
    activeId,
    onSelect,
}) => (
    <View style={styles.row}>
        {cards.map(card => {
            const colors = CARD_STYLES[card.id];
            const isActive = card.id === activeId;
            return (
                <Pressable
                    key={card.id}
                    onPress={() => onSelect(card.id)}
                    style={[
                        styles.card,
                        { backgroundColor: colors.bg },
                        isActive && card.id === 'pending' && styles.cardActive,
                    ]}
                >
                    <TextComp text={card.amount} style={[styles.amount, { color: colors.amount }]} />
                    <TextComp text={card.label} style={[styles.label, { color: colors.label }]} />
                    <TextComp text={card.itemCount} style={[styles.count, { color: colors.count }]} />
                </Pressable>
            );
        })}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: moderateScale(8),
        marginBottom: spaces.medium,
    },
    card: {
        flex: 1,
        borderRadius: theme.radius.md,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
        alignItems: 'center',
    },
    cardActive: {
        borderWidth: 1,
        borderColor: palette.yellow.dark,
    },
    amount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        marginBottom: moderateScale(2),
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
    },
    count: {
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(11),
        marginTop: moderateScale(2),
    },
});

export default CashbackStatusCards;
