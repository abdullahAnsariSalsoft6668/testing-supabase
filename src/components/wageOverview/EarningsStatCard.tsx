import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';
import {
    ExtraBoxIcon,
    HourlyTrendIcon,
    HoursClockIcon,
    TruckIcon,
} from './WageIcons';
import type { EarningsStat } from './types';

type EarningsStatCardProps = {
    stat: EarningsStat;
    index: number;
};

const EarningsStatCard: React.FC<EarningsStatCardProps> = ({ stat, index }) => {
    const animatedStyle = useEntranceAnimation({
        index,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 18,
    });

    const icon = useMemo(() => {
        switch (stat.type) {
            case 'routes':
                return <TruckIcon />;
            case 'extra':
                return <ExtraBoxIcon />;
            case 'hours':
                return <HoursClockIcon />;
            case 'hourly':
                return <HourlyTrendIcon />;
            default:
                return <TruckIcon />;
        }
    }, [stat.type]);

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.iconWrap}>{icon}</View>
            <TextComp text={stat.label} style={styles.label} />
            <TextComp text={stat.value} style={styles.value} />
            {stat.subValue ? <TextComp text={stat.subValue} style={styles.subValue} /> : null}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: '46%',
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
    iconWrap: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(10),
    },
    label: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        marginBottom: moderateScale(6),
    },
    value: {
        fontSize: moderateScale(24),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    subValue: {
        marginTop: moderateScale(8),
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.bold,
        color: Colors.gray500,
    },
});

export default React.memo(EarningsStatCard);
