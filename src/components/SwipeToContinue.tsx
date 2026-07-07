import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import TextComp from '@/components/TextComp';
import { moderateScale } from '@/styles/scaling';
import { width } from '@/styles/scaling';

import styles from '@/components/SwipeToContinue.styles';
import MyIcons from './MyIcons';

const SLIDER_THUMB_WIDTH = moderateScale(114);
const CARD_MARGIN = 20 * 2;
const CARD_PADDING = 24 * 2;
const TRACK_WIDTH = width - CARD_MARGIN - CARD_PADDING;
const MAX_DRAG = TRACK_WIDTH - SLIDER_THUMB_WIDTH;
const COMPLETE_THRESHOLD = MAX_DRAG * 0.85;

type SwipeToContinueProps = {
    onComplete: () => void;
    label?: string;
};

const SwipeToContinue: React.FC<SwipeToContinueProps> = ({
    onComplete,
    label = 'Swipe To Continue',
}) => {
    const translateX = useSharedValue(0);
    const hasCompleted = useSharedValue(false);

    const complete = useCallback(() => {
        onComplete();
    }, [onComplete]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (hasCompleted.value) return;
            const next = Math.max(0, Math.min(e.translationX, MAX_DRAG));
            translateX.value = next;
        })
        .onEnd((e) => {
            if (hasCompleted.value) return;
            const velocity = e.velocityX;
            const current = translateX.value;
            if (current >= COMPLETE_THRESHOLD || velocity > 300) {
                hasCompleted.value = true;
                translateX.value = withTiming(MAX_DRAG, { duration: 150 }, () => {
                    runOnJS(complete)();
                });
            } else {
                translateX.value = withSpring(0, {
                    damping: 20,
                    stiffness: 300,
                });
            }
        });

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View>
            <View style={styles.sliderTrack}>
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={[styles.sliderThumb, thumbStyle]}>
                        <TextComp text="Get Started" style={styles.sliderThumbText} />
                    </Animated.View>
                </GestureDetector>
                <View style={styles.sliderChevrons} pointerEvents="none">
                    <MyIcons name="arrowRight" size={moderateScale(18)} />
                </View>
                <View style={styles.sliderCheckWrap} pointerEvents="none">
                    <Text style={styles.sliderCheckMark}>✓</Text>
                </View>
            </View>
            <TextComp text={label} style={styles.sliderLabel} />
        </View>
    );
};

export default SwipeToContinue;
