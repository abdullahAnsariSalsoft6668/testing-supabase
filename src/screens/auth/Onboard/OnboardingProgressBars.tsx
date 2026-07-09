import React from 'react';
import { View } from 'react-native';

import { ONBOARDING_SLIDES } from './onboardingSlides';
import styles from './styles';

type OnboardingProgressBarsProps = {
    activeIndex: number;
};

const OnboardingProgressBars: React.FC<OnboardingProgressBarsProps> = ({ activeIndex }) => (
    <View style={styles.progressRow}>
        {ONBOARDING_SLIDES.map((slide, index) => (
            <View
                key={slide.id}
                style={[styles.progressDot, index === activeIndex && styles.progressDotActive]}
            />
        ))}
    </View>
);

export default OnboardingProgressBars;
