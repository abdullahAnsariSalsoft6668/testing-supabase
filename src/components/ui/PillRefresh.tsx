import React, { useCallback } from 'react';
import { StyleSheet, View, type ScrollViewProps } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedScrollHandler,
    useSharedValue,
    withDelay,
    withSpring,
    type SharedValue,
} from 'react-native-reanimated';

import PillRefreshIndicator from '@/components/ui/PillRefreshIndicator';
import { hapticMedium } from '@/utils/haptics';
import { MOTION_SPRING, PILL_REFRESH } from '@/styles/motion';

type PillRefreshProps = {
    children: React.ReactElement<ScrollViewProps>;
    onRefresh: () => Promise<void> | void;
    /** Optional external scrollY for driving other UI (e.g. Home header). */
    scrollYExternal?: SharedValue<number>;
};

const PillRefresh = ({ children, onRefresh, scrollYExternal }: PillRefreshProps) => {
    const pull = useSharedValue(0);
    const refreshing = useSharedValue(false);
    const scrollY = scrollYExternal ?? useSharedValue(0);

    const finishRefresh = useCallback(() => {
        refreshing.value = false;
        pull.value = withDelay(PILL_REFRESH.doneDelayMs, withSpring(0, MOTION_SPRING.pillRefresh));
    }, [pull, refreshing]);

    const startRefresh = useCallback(async () => {
        hapticMedium();
        try {
            await onRefresh();
        } finally {
            finishRefresh();
        }
    }, [finishRefresh, onRefresh]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const pan = Gesture.Pan()
        .manualActivation(true)
        .onTouchesMove((event, state) => {
            if (refreshing.value) {
                state.fail();
                return;
            }
            const dy = event.allTouches[0]?.absoluteY ?? 0;
            if (scrollY.value <= 2) {
                state.activate();
            } else {
                state.fail();
            }
        })
        .onUpdate((event) => {
            if (refreshing.value) return;
            if (event.translationY <= 0) {
                pull.value = 0;
                return;
            }
            pull.value = Math.min(
                PILL_REFRESH.maxPull,
                event.translationY * PILL_REFRESH.resistance,
            );
        })
        .onEnd(() => {
            if (refreshing.value) return;
            if (pull.value >= PILL_REFRESH.triggerAt) {
                refreshing.value = true;
                pull.value = withSpring(PILL_REFRESH.holdAt, MOTION_SPRING.pillRefresh);
                runOnJS(startRefresh)();
            } else {
                pull.value = withSpring(0, MOTION_SPRING.pillRefresh);
            }
        });

    const native = Gesture.Native();
    const composed = Gesture.Simultaneous(pan, native);

    const { contentContainerStyle, style, ...rest } = children.props;

    return (
        <View style={styles.root}>
            <PillRefreshIndicator pull={pull} refreshing={refreshing} />
            <GestureDetector gesture={composed}>
                <Animated.ScrollView
                    {...rest}
                    style={[styles.scroll, style]}
                    contentContainerStyle={contentContainerStyle}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    bounces={false}
                    overScrollMode="never"
                    alwaysBounceVertical={false}
                />
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
});

export default PillRefresh;
