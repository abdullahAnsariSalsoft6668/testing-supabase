import React from 'react';
import {
    Pressable,
    StyleSheet,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { usePressScale } from '@/hooks/animations/usePressScale';

type ScalePressableProps = PressableProps & {
    pressedScale?: number;
    style?: StyleProp<ViewStyle>;
};

const ScalePressable = ({
    children,
    pressedScale,
    style,
    onPressIn,
    onPressOut,
    ...rest
}: ScalePressableProps) => {
    const { animatedStyle, onPressIn: scaleIn, onPressOut: scaleOut } = usePressScale(pressedScale);

    return (
        <Pressable
            {...rest}
            onPressIn={(e) => {
                scaleIn();
                onPressIn?.(e);
            }}
            onPressOut={(e) => {
                scaleOut();
                onPressOut?.(e);
            }}
        >
            <Animated.View style={[style, animatedStyle]}>
                {typeof children === 'function' ? null : children}
            </Animated.View>
        </Pressable>
    );
};

export default ScalePressable;
