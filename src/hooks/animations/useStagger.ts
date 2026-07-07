import { useAnimatedStyle } from 'react-native-reanimated';

export const useStagger = (_index: number, _delayStep?: number, _initialDelay?: number) => {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ translateY: 0 }],
    }));

    return { animatedStyle };
};
