import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { moderateScale } from '@/styles/scaling';
import { palette } from '@/styles/palette';

type HealthCategoryBarProps = {
    value: number;
    max?: number;
};

const HealthCategoryBar = ({ value, max = 100 }: HealthCategoryBarProps) => {
    const widthPct = useSharedValue(0);
    const pct = Math.max(0, Math.min(max, value)) / max;

    useEffect(() => {
        widthPct.value = withTiming(pct, { duration: 420 });
    }, [pct, widthPct]);

    const fillColor =
        pct < 0.5 ? palette.medical.warning : pct < 0.8 ? palette.lime.main : palette.medical.success;

    const fillStyle = useAnimatedStyle(() => ({
        width: `${widthPct.value * 100}%`,
        backgroundColor: fillColor,
    }));

    return (
        <View style={styles.track}>
            <Animated.View style={[styles.fill, fillStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: palette.olive.main,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: moderateScale(3),
    },
});

export default HealthCategoryBar;
