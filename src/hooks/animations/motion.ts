import { LinearTransition } from 'react-native-reanimated';

export const MOTION_DURATION = {
    instant: 0,
    fast: 0,
    normal: 0,
    slow: 0,
} as const;

export const MOTION_SPRING = {
    gentle: { damping: 1, stiffness: 1, mass: 1, overshootClamping: true },
} as const;

export const LAYOUT_TRANSITION = LinearTransition.duration(0);
