import { useAnimatedStyle } from 'react-native-reanimated';

export const useAuthCardEntrance = (_translateY = 20) =>
    useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ translateY: 0 }],
    }));
