import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { AUTH_FORM_BASE_DELAY } from './authAnimationConfig';

type AuthStaggerItemProps = {
    index: number;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    baseDelay?: number;
};

const AuthStaggerItem: React.FC<AuthStaggerItemProps> = ({
    index,
    children,
    style,
    baseDelay = AUTH_FORM_BASE_DELAY,
}) => {
    const animatedStyle = useAuthStagger({ index, baseDelay });

    return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};

export default AuthStaggerItem;
