import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { moderateScale } from '@/styles/scaling';
import { palette } from '@/styles/palette';
import { typography } from '@/styles/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type HealthRingProps = {
    score: number;
    max?: number;
    size?: number;
};

const HealthRing = ({ score, max = 100, size = moderateScale(88) }: HealthRingProps) => {
    const reduced = usePrefersReducedMotion();
    const progress = useSharedValue(0);
    const displayScore = useSharedValue(0);
    const stroke = moderateScale(7);
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    useEffect(() => {
        const target = Math.max(0, Math.min(max, score)) / max;
        if (reduced) {
            progress.value = target;
            displayScore.value = score;
            return;
        }
        progress.value = withTiming(target, { duration: 620, easing: Easing.out(Easing.cubic) });
        displayScore.value = withTiming(score, { duration: 620, easing: Easing.out(Easing.cubic) });
    }, [displayScore, max, progress, reduced, score]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    return (
        <View style={[styles.wrap, { width: size, height: size }]}>
            <View style={[styles.halo, { width: size + moderateScale(12), height: size + moderateScale(12) }]} />
            <Svg width={size} height={size}>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={palette.lime.surface}
                    strokeWidth={stroke}
                    fill="none"
                />
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={palette.lime.main}
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${center}, ${center}`}
                />
            </Svg>
            <View style={styles.labelWrap}>
                <TextComp text={String(Math.round(score))} style={typography.stat} />
                <TextComp text={`/ ${max}`} style={styles.maxLabel} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    halo: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: palette.lime.highlight,
        opacity: 0.55,
    },
    labelWrap: {
        position: 'absolute',
        alignItems: 'center',
    },
    maxLabel: {
        ...typography.bodySmall,
        color: palette.onCard.textSecondary,
        marginTop: moderateScale(2),
    },
});

export default HealthRing;
