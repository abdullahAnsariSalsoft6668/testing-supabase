import { useAnimatedStyle } from 'react-native-reanimated';

const noop = () => undefined;

export const usePressScale = (_pressedScale?: number) => {
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1 }],
    }));

    return {
        animatedStyle,
        onPressIn: noop,
        onPressOut: noop,
    };
};
