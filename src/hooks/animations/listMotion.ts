import {
    FadeOut,
    withDelay,
    withTiming,
    type EntryAnimationsValues,
    type EntryExitAnimationFunction,
} from 'react-native-reanimated';

import {
    CONTENT_ENTER_TRANSLATE,
    LIST_ITEM_ENTER,
    MOTION_DURATION,
    MOTION_EASE_OUT,
    SKELETON_EXIT_MS,
} from '@/styles/motion';

/** List card enter — translateY only (never opacity fade on bordered cards). */
export function listItemEntering(index: number): EntryExitAnimationFunction {
    const capped = Math.min(Math.max(index, 0), LIST_ITEM_ENTER.maxItems - 1);
    const delay = capped * LIST_ITEM_ENTER.staggerMs;

    return (_values: EntryAnimationsValues) => {
        'worklet';
        return {
            initialValues: {
                transform: [{ translateY: LIST_ITEM_ENTER.translateY }],
            },
            animations: {
                transform: [
                    {
                        translateY: withDelay(
                            delay,
                            withTiming(0, {
                                duration: LIST_ITEM_ENTER.duration,
                                easing: MOTION_EASE_OUT,
                            }),
                        ),
                    },
                ],
            },
        };
    };
}

export const skeletonExiting = FadeOut.duration(SKELETON_EXIT_MS);

export const contentEntering = () => {
    'worklet';
    return {
        initialValues: { transform: [{ translateY: CONTENT_ENTER_TRANSLATE }] },
        animations: {
            transform: [
                {
                    translateY: withTiming(0, {
                        duration: MOTION_DURATION.fast,
                        easing: MOTION_EASE_OUT,
                    }),
                },
            ],
        },
    };
};
