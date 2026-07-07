import { useAnimatedStyle } from 'react-native-reanimated';

type AuthStaggerOptions = {
    index?: number;
    baseDelay?: number;
    step?: number;
    translateY?: number;
};

export const useAuthStagger = (_options: AuthStaggerOptions = {}) =>
    useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ translateY: 0 }],
    }));
