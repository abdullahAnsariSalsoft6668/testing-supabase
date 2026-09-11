import { Easing, LinearTransition } from 'react-native-reanimated';

export const MOTION_DURATION = {
    instant: 120,
    fast: 220,
    normal: 320,
    slow: 420,
} as const;

export const MOTION_SPRING = {
    gentle: { damping: 18, stiffness: 180, mass: 0.8 },
    authEntrance: { damping: 22, stiffness: 160, mass: 0.85 },
    tabPill: { damping: 18, stiffness: 180, mass: 0.7 },
    splashHide: { damping: 14, stiffness: 150, mass: 0.85 },
    pillRefresh: { damping: 24, stiffness: 88, mass: 1.15 },
} as const;

export const MOTION_EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);

export const LAYOUT_TRANSITION = LinearTransition.duration(MOTION_DURATION.normal);

export const PRESS_SCALE_DEFAULT = 0.98;
export const PRESS_SCALE_CHIP = 0.97;
export const PRESS_SCALE_QUICK_ACTION = 0.96;
export const SELECT_POP_SCALE = 1.04;

export const LIST_ITEM_ENTER = {
    translateY: 14,
    duration: MOTION_DURATION.fast,
    staggerMs: 40,
    maxItems: 5,
} as const;

export const SKELETON_EXIT_MS = 160;
export const CONTENT_ENTER_TRANSLATE = 12;

export const AUTH_STAGGER_STEP_MS = 36;
export const AUTH_STAGGER_TRANSLATE = 14;

export const PILL_REFRESH = {
    resistance: 0.38,
    maxPull: 136,
    triggerAt: 84,
    holdAt: 96,
    doneDelayMs: 160,
    opacityPullStart: 8,
    opacityPullEnd: 36,
    scaleMin: 0.86,
    scaleMax: 1,
} as const;
