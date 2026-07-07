import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';

import { NOTICE_BACKGROUND, NOTICE_BORDER } from './constants';
import { WarningIcon } from './FormIcons';

const ImportantNotice: React.FC = () => {
    const animatedStyle = useAuthStagger({ index: 0, baseDelay: 80, step: 0, translateY: 14 });

    return (
        <Animated.View style={[styles.wrap, animatedStyle]}>
            <WarningIcon />
            <Text style={styles.text}>
                <Text style={styles.strong}>Important</Text>
                <Text style={styles.body}>
                    : Submit this report when deliveries cannot be completed as scheduled. Include
                    all relevant details and supporting documentation.
                </Text>
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(10),
        backgroundColor: NOTICE_BACKGROUND,
        borderWidth: 1,
        borderColor: NOTICE_BORDER,
        borderRadius: moderateScale(12),
        padding: moderateScale(14),
        marginBottom: moderateScale(20),
    },
    text: {
        flex: 1,
        lineHeight: moderateScale(20),
    },
    strong: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.bold,
        color: NOTICE_BORDER,
    },
    body: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.text,
        lineHeight: moderateScale(20),
    },
});

export default React.memo(ImportantNotice);
