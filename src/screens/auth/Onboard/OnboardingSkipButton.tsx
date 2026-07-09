import React from 'react';
import { I18nManager, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { moderateScale } from '@/styles/scaling';

import styles from './styles';

type OnboardingSkipButtonProps = {
    onPress: () => void;
};

const SkipChevron = () => (
    <Svg width={moderateScale(7)} height={moderateScale(12)} viewBox="0 0 7 12" fill="none">
        <Path
            d="M0.833252 10.8315L5.83243 5.83237L0.833252 0.833191"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const OnboardingSkipButton: React.FC<OnboardingSkipButtonProps> = ({ onPress }) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.skipButton}
                accessibilityRole="button"
                accessibilityLabel="Skip onboarding"
            >
                <TextComp text="Skip" style={styles.skipText} />
                <SkipChevron />
            </Pressable>
        </Animated.View>
    );
};

export default OnboardingSkipButton;
