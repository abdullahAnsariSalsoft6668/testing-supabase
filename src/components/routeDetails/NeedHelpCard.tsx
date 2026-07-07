import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import RouteDetailsCard from './RouteDetailsCard';
import { ENTRANCE_BASE } from './constants';

const InfoIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={Colors.gray500} strokeWidth={1.6} />
        <Path d="M12 10v6" stroke={Colors.gray500} strokeWidth={1.8} strokeLinecap="round" />
        <Circle cx="12" cy="7.5" r="1" fill={Colors.gray500} />
    </Svg>
);

const NeedHelpCard: React.FC = () => {
    const animatedStyle = useEntranceAnimation({
        baseDelay: ENTRANCE_BASE + 100,
        translateY: 18,
    });

    return (
        <Animated.View style={animatedStyle}>
            <RouteDetailsCard style={styles.card}>
                <View style={styles.headerRow}>
                    <InfoIcon />
                    <TextComp text="Need Help?" style={styles.title} />
                </View>
                <TextComp
                    text="Contact dispatch if you encounter any issues or delays during your route."
                    style={styles.body}
                />
            </RouteDetailsCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: moderateScale(4),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        marginBottom: moderateScale(8),
    },
    title: {
        fontSize: moderateScale(15),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    body: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        lineHeight: moderateScale(20),
    },
});

export default React.memo(NeedHelpCard);
