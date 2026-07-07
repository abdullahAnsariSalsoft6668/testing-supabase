import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';
import { FaqIcon } from './HelpSupportIcons';
import type { FaqItem } from './types';

type FaqCardProps = {
    item: FaqItem;
    index: number;
};

const FaqCard: React.FC<FaqCardProps> = ({ item, index }) => {
    const animatedStyle = useEntranceAnimation({
        index: index + 4,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 18,
    });

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <View style={styles.iconWrap}>
                <FaqIcon />
            </View>
            <View style={styles.content}>
                <TextComp text={item.question} style={styles.question} />
                <TextComp text={item.answer} style={styles.answer} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(14),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        gap: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    iconWrap: {
        marginTop: moderateScale(2),
    },
    content: {
        flex: 1,
    },
    question: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(6),
    },
    answer: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        lineHeight: moderateScale(19),
    },
});

export default React.memo(FaqCard);
