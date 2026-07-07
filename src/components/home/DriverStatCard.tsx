import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { HOME_ENTRANCE_BASE, HOME_ENTRANCE_STEP } from './constants';
import type { DriverStat } from './types';

type DriverStatCardProps = {
    stat: DriverStat;
    index: number;
};

const DriverStatCard: React.FC<DriverStatCardProps> = ({ stat, index }) => {
    const animatedStyle = useEntranceAnimation({
        index,
        baseDelay: HOME_ENTRANCE_BASE,
        step: HOME_ENTRANCE_STEP,
        translateY: 16,
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <TextComp text={stat.value} style={styles.value} />
            <TextComp text={stat.label} style={styles.label} numberOfLines={2} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: moderateScale(78),
        borderRadius: moderateScale(14),
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.14)',
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: moderateScale(22),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(4),
        textAlign: 'center',
    },
    label: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.72)',
        textAlign: 'center',
        lineHeight: moderateScale(15),
    },
});

export default React.memo(DriverStatCard);
