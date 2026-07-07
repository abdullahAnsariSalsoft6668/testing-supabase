import TextComp from '@/components/TextComp';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { FORM_STAGGER_BASE, FORM_STAGGER_STEP } from '../extraWorkSubmit/constants';
import { TIMESTAMP_BACKGROUND } from './constants';
import { TimestampClockIcon } from './FormIcons';

type TimestampBarProps = {
    timestamp: string;
    index?: number;
};

const TimestampBar: React.FC<TimestampBarProps> = ({ timestamp, index = 4 }) => {
    const animatedStyle = useAuthStagger({
        index,
        baseDelay: FORM_STAGGER_BASE,
        step: FORM_STAGGER_STEP,
        translateY: 14,
    });

    return (
        <Animated.View style={[styles.wrap, animatedStyle]}>
            <TimestampClockIcon />
            <TextComp text={`Timestamp: ${timestamp}`} style={styles.label} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        backgroundColor: TIMESTAMP_BACKGROUND,
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
        marginBottom: moderateScale(20),
    },
    label: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.bold,
        color: '#2F6FED',
    },
});

export default React.memo(TimestampBar);
