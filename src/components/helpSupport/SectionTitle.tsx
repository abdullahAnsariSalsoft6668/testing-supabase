import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

type SectionTitleProps = {
    title: string;
    baseDelay?: number;
};

const SectionTitle: React.FC<SectionTitleProps> = ({ title, baseDelay = 140 }) => {
    const animatedStyle = useEntranceAnimation({ baseDelay, translateY: 14 });

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
        marginBottom: moderateScale(14),
    },
});

export default React.memo(SectionTitle);
