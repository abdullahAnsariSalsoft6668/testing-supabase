import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { contentEntering, skeletonExiting } from '@/hooks/animations/listMotion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MOTION_DURATION } from '@/styles/motion';

type MotionFadeProps = {
    showSkeleton: boolean;
    skeleton: React.ReactNode;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

/** Swap skeleton → content with FadeOut 160ms + slide-in 12px. */
const MotionFade = ({ showSkeleton, skeleton, children, style }: MotionFadeProps) => {
    const reduced = usePrefersReducedMotion();

    if (showSkeleton) {
        return (
            <Animated.View exiting={reduced ? FadeOut.duration(MOTION_DURATION.instant) : skeletonExiting} style={style}>
                {skeleton}
            </Animated.View>
        );
    }

    return (
        <Animated.View
            entering={reduced ? FadeIn.duration(MOTION_DURATION.instant) : contentEntering}
            style={style}
        >
            {children}
        </Animated.View>
    );
};

export default MotionFade;
