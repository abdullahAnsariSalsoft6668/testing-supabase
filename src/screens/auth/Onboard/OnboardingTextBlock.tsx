import React, { useEffect } from 'react';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import TextComp from '@/components/TextComp';

import styles from './styles';

type OnboardingTextBlockProps = {
    slideKey: string;
    title: string;
    description: string;
    titleSize: number;
    titleLineHeight: number;
    descriptionSize: number;
    descriptionLineHeight: number;
};

const OnboardingTextBlock: React.FC<OnboardingTextBlockProps> = ({
    slideKey,
    title,
    description,
    titleSize,
    titleLineHeight,
    descriptionSize,
    descriptionLineHeight,
}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(14);

    useEffect(() => {
        opacity.value = 0;
        translateY.value = 14;
        opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
        translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.ease) });
    }, [slideKey, opacity, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <TextComp
                text={title}
                style={[
                    styles.title,
                    { fontSize: titleSize, lineHeight: titleLineHeight },
                ]}
            />
            <TextComp
                text={description}
                style={[
                    styles.description,
                    { fontSize: descriptionSize, lineHeight: descriptionLineHeight },
                ]}
            />
        </Animated.View>
    );
};

export default OnboardingTextBlock;
