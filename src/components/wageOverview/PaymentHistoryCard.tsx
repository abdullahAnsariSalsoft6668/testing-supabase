import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';
import { DollarIcon, PaymentCalendarIcon } from './WageIcons';
import type { PaymentHistoryItem } from './types';

type PaymentHistoryCardProps = {
    item: PaymentHistoryItem;
    index: number;
};

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ item, index }) => {
    const animatedStyle = useEntranceAnimation({
        index: index + 4,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 18,
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.topRow}>
                <TextComp text={item.periodLabel} style={styles.period} />
                <View style={styles.paidBadge}>
                    <TextComp text="Paid" style={styles.paidText} />
                </View>
            </View>

            <View style={styles.paidRow}>
                <PaymentCalendarIcon />
                <TextComp text={`Paid on ${item.paidOn}`} style={styles.paidDate} />
            </View>

            <View style={styles.amountRow}>
                <DollarIcon />
                <TextComp text={item.amount} style={styles.amount} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(10),
    },
    period: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    paidBadge: {
        backgroundColor: '#D8F5E4',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
    },
    paidText: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.bold,
        color: '#1B8A4B',
    },
    paidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        marginBottom: moderateScale(10),
    },
    paidDate: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    amount: {
        fontSize: moderateScale(18),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
});

export default React.memo(PaymentHistoryCard);
