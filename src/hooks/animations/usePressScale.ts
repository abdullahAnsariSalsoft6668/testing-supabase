import { useCallback } from 'react';
import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import {
    MOTION_DURATION,
    MOTION_SPRING,
    PRESS_SCALE_DEFAULT,
} from '@/hooks/animations/motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function usePressScale(pressedScale = PRESS_SCALE_DEFAULT) {
    const reduced = usePrefersReducedMotion();
    const scale = useSharedValue(1);

    const onPressIn = useCallback(() => {
        scale.value = reduced
            ? withTiming(pressedScale, { duration: MOTION_DURATION.instant })
            : withTiming(pressedScale, { duration: MOTION_DURATION.fast });
    }, [pressedScale, reduced, scale]);

    const onPressOut = useCallback(() => {
        scale.value = reduced
            ? withTiming(1, { duration: MOTION_DURATION.instant })
            : withSpring(1, MOTION_SPRING.gentle);
    }, [reduced, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return { animatedStyle, onPressIn, onPressOut, scale };
}
