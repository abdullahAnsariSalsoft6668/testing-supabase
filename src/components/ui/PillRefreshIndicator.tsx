import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    type SharedValue,
} from 'react-native-reanimated';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { PILL_REFRESH } from '@/styles/motion';
import { moderateScale } from '@/styles/scaling';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';

type PillRefreshIndicatorProps = {
    pull: SharedValue<number>;
    refreshing: SharedValue<boolean>;
};

const CAP_W = moderateScale(30);
const CAP_H = moderateScale(18);
const BEAD = moderateScale(6);
const BEAD_CENTER = moderateScale(8);
const GAP = moderateScale(18);

const smoothstep = (edge0: number, edge1: number, x: number) => {
    'worklet';
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

const PillRefreshIndicator = ({ pull, refreshing }: PillRefreshIndicatorProps) => {
    const reduced = usePrefersReducedMotion();
    const floatPhase = useSharedValue(0);
    const loopPhase = useSharedValue(0);

    useEffect(() => {
        if (reduced) return;
        floatPhase.value = withRepeat(
            withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
    }, [floatPhase, reduced]);

    useEffect(() => {
        if (reduced) return;
        loopPhase.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 560 }),
                withTiming(1, { duration: 240 }),
                withTiming(0, { duration: 620 }),
                withTiming(0, { duration: 180 }),
            ),
            -1,
            false,
        );
    }, [loopPhase, reduced]);

    const containerStyle = useAnimatedStyle(() => {
        const opacity = smoothstep(
            PILL_REFRESH.opacityPullStart,
            PILL_REFRESH.opacityPullEnd,
            pull.value,
        );
        const scale =
            PILL_REFRESH.scaleMin +
            (PILL_REFRESH.scaleMax - PILL_REFRESH.scaleMin) *
                smoothstep(0, PILL_REFRESH.triggerAt, pull.value);

        return {
            height: Math.max(pull.value, 0),
            opacity,
            transform: [{ scale }],
        };
    });

    const capsuleStyle = useAnimatedStyle(() => {
        const pullT = smoothstep(0, PILL_REFRESH.maxPull, pull.value);
        const loopT = refreshing.value ? loopPhase.value : 0;
        const explode = Math.max(pullT, loopT);
        const rot = explode * 7 * (floatPhase.value > 0.5 ? 1 : -1);

        return {
            transform: [{ rotate: `${rot}deg` }],
        };
    });

    const beadLeftStyle = useAnimatedStyle(() => {
        const pullT = smoothstep(0, PILL_REFRESH.maxPull, pull.value);
        const loopT = refreshing.value ? loopPhase.value : 0;
        const explode = Math.max(pullT, loopT);
        const floatY = reduced ? 0 : Math.sin(floatPhase.value * Math.PI * 2) * moderateScale(3);
        const spread = explode * moderateScale(14);

        return {
            transform: [{ translateX: -spread }, { translateY: floatY }],
        };
    });

    const beadCenterStyle = useAnimatedStyle(() => {
        const pullT = smoothstep(0, PILL_REFRESH.maxPull, pull.value);
        const loopT = refreshing.value ? loopPhase.value : 0;
        const explode = Math.max(pullT, loopT);
        const floatY = reduced ? 0 : Math.sin(floatPhase.value * Math.PI * 2) * moderateScale(3);
        const spread = explode * moderateScale(14);

        return {
            transform: [{ translateY: -spread * 0.35 + floatY }],
        };
    });

    const beadRightStyle = useAnimatedStyle(() => {
        const pullT = smoothstep(0, PILL_REFRESH.maxPull, pull.value);
        const loopT = refreshing.value ? loopPhase.value : 0;
        const explode = Math.max(pullT, loopT);
        const floatY = reduced ? 0 : Math.sin(floatPhase.value * Math.PI * 2) * moderateScale(3);
        const spread = explode * moderateScale(14);

        return {
            transform: [{ translateX: spread }, { translateY: floatY }],
        };
    });

    return (
        <Animated.View style={[styles.slot, containerStyle]} pointerEvents="none">
            <Animated.View style={[styles.capsuleWrap, capsuleStyle]}>
                <View style={styles.splitRow}>
                    <View style={styles.capTop} />
                    <View style={{ height: GAP }} />
                    <View style={styles.capBottom} />
                </View>
                <View style={styles.beadsRow}>
                    <Animated.View style={[styles.beadSide, beadLeftStyle]} />
                    <Animated.View style={[styles.beadCenter, beadCenterStyle]} />
                    <Animated.View style={[styles.beadSide, beadRightStyle]} />
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    slot: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'visible',
    },
    capsuleWrap: {
        alignItems: 'center',
        marginBottom: moderateScale(8),
        ...theme.shadows.pillRefresh,
    },
    splitRow: {
        alignItems: 'center',
    },
    capTop: {
        width: CAP_W,
        height: CAP_H,
        backgroundColor: palette.lime.main,
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
    },
    capBottom: {
        width: CAP_W,
        height: CAP_H,
        backgroundColor: palette.cream,
        borderBottomLeftRadius: moderateScale(15),
        borderBottomRightRadius: moderateScale(15),
    },
    beadsRow: {
        position: 'absolute',
        top: CAP_H + GAP / 2 - BEAD / 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    beadSide: {
        width: BEAD,
        height: BEAD,
        borderRadius: BEAD / 2,
        backgroundColor: palette.lime.main,
    },
    beadCenter: {
        width: BEAD_CENTER,
        height: BEAD_CENTER,
        borderRadius: BEAD_CENTER / 2,
        backgroundColor: palette.ink,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: palette.lime.dark,
    },
});

export default PillRefreshIndicator;
