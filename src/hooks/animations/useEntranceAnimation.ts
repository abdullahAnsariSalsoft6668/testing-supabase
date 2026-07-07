import { useAnimatedStyle } from 'react-native-reanimated';

type EntranceAnimationOptions = {
    index?: number;
    baseDelay?: number;
    step?: number;
    translateY?: number;
    enabled?: boolean;
};

export const useEntranceAnimation = (_options: EntranceAnimationOptions = {}) =>
    useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ translateY: 0 }],
    }));
