import { useAnimatedStyle } from 'react-native-reanimated';

interface FadeSlideOptions {
    duration?: number;
    delay?: number;
    translateY?: number;
}

export const useFadeSlide = (_options: FadeSlideOptions = {}) => {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ translateY: 0 }],
    }));

    return { animatedStyle };
};
