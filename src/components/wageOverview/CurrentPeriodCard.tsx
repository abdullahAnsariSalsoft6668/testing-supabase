import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import { PERIOD_CARD_GRADIENT } from './constants';
import { CalendarIcon } from './WageIcons';
import type { CurrentPeriodData } from './types';

type CurrentPeriodCardProps = {
    period: CurrentPeriodData;
};

const CurrentPeriodCard: React.FC<CurrentPeriodCardProps> = ({ period }) => {
    const animatedStyle = useEntranceAnimation({ baseDelay: 70 });

    return (
        <Animated.View style={animatedStyle}>
            <LinearGradient
                colors={[...PERIOD_CARD_GRADIENT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.topRow}>
                    <TextComp text="Current Period" style={styles.periodLabel} />
                    <View style={styles.badge}>
                        <TextComp
                            text={period.status === 'pending' ? 'Pending' : 'Paid'}
                            style={styles.badgeText}
                        />
                    </View>
                </View>

                <View style={styles.dateRow}>
                    <CalendarIcon />
                    <TextComp text={period.dateRange} style={styles.dateText} />
                </View>

                <TextComp text={period.totalEarnings} style={styles.totalAmount} />
                <TextComp text="Total Estimated Earnings" style={styles.totalLabel} />

                <View style={styles.footerRow}>
                    <View style={styles.footerCol}>
                        <TextComp text="Base Earnings" style={styles.footerLabel} />
                        <TextComp text={period.baseEarnings} style={styles.footerValue} />
                    </View>
                    <View style={styles.footerCol}>
                        <TextComp text="Extra Work" style={styles.footerLabel} />
                        <TextComp text={period.extraEarnings} style={styles.footerValue} />
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        padding: moderateScale(18),
        marginBottom: moderateScale(8),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(12),
    },
    periodLabel: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
    badge: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(5),
    },
    badgeText: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: moderateScale(14),
    },
    dateText: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.78)',
    },
    totalAmount: {
        fontSize: moderateScale(32),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(4),
    },
    totalLabel: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.72)',
        marginBottom: moderateScale(16),
    },
    footerRow: {
        flexDirection: 'row',
        gap: moderateScale(24),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255, 255, 255, 0.15)',
        paddingTop: moderateScale(14),
    },
    footerCol: {
        flex: 1,
    },
    footerLabel: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.68)',
        marginBottom: moderateScale(4),
    },
    footerValue: {
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
});

export default React.memo(CurrentPeriodCard);
