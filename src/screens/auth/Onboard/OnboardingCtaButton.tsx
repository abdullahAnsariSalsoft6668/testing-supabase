import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { moderateScale } from '@/styles/scaling';

import styles from './styles';

type OnboardingCtaButtonProps = {
    onPress: () => void;
    height?: number;
    label?: string;
};

const OnboardingCtaButton: React.FC<OnboardingCtaButtonProps> = ({
    onPress,
    height = moderateScale(54),
    label = 'Next',
}) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                accessibilityRole="button"
                accessibilityLabel={label}
                style={[styles.ctaButton, { height }]}
            >
                <TextComp text={label} style={styles.ctaLabel} />
            </Pressable>
        </Animated.View>
    );
};

export default OnboardingCtaButton;
