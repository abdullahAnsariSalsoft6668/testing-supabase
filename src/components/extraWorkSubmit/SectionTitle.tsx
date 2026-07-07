import TextComp from '@/components/TextComp';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { FORM_STAGGER_BASE, FORM_STAGGER_STEP } from './constants';

type SectionTitleProps = {
    title: string;
    index?: number;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, index = 0 }) => {
    const animatedStyle = useAuthStagger({
        index,
        baseDelay: FORM_STAGGER_BASE - 40,
        step: FORM_STAGGER_STEP,
        translateY: 14,
    });

    return (
        <Animated.View style={animatedStyle}>
            <TextComp text={title} style={styles.title} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: moderateScale(17),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(16),
    },
});

export default React.memo(SectionTitle);
