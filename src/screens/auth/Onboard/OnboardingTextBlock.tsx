import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import TextComp from '@/components/TextComp';

import { ROLE_COLORS, type OnboardingRole } from './onboardingRoleColors';
import styles from './styles';

type OnboardingTextBlockProps = {
    slideKey: string;
    role: OnboardingRole;
    title: string;
    description: string;
    titleSize: number;
    titleLineHeight: number;
    descriptionSize: number;
};

const OnboardingTextBlock: React.FC<OnboardingTextBlockProps> = ({
    slideKey,
    role,
    title,
    description,
    titleSize,
    titleLineHeight,
    descriptionSize,
}) => {
    const colors = ROLE_COLORS[role];
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(16);

    useEffect(() => {
        opacity.value = 0;
        translateY.value = 16;
        opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
        translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    }, [slideKey, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={[styles.textBlock, animatedStyle]}>
            <View
                style={[
                    styles.rolePill,
                    { backgroundColor: colors.accent + '14' },
                ]}
            >
                <TextComp
                    text={colors.label}
                    style={[styles.rolePillText, { color: colors.accent }]}
                />
            </View>
            <TextComp
                text={title}
                style={[styles.title, { fontSize: titleSize, lineHeight: titleLineHeight }]}
            />
            <TextComp
                text={description}
                style={[styles.description, { fontSize: descriptionSize }]}
            />
        </Animated.View>
    );
};

export default OnboardingTextBlock;
