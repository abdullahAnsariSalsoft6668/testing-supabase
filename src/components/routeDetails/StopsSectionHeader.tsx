import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';

const LocationIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
            stroke={Colors.text}
            strokeWidth={1.8}
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="10" r="2.5" stroke={Colors.text} strokeWidth={1.8} />
    </Svg>
);

type StopsSectionHeaderProps = {
    totalStops: number;
};

const StopsSectionHeader: React.FC<StopsSectionHeaderProps> = ({ totalStops }) => {
    const animatedStyle = useEntranceAnimation({
        index: 2,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 16,
    });

    return (
        <Animated.View style={[styles.wrapper, animatedStyle]}>
            <LocationIcon />
            <TextComp text={`Stops (${totalStops})`} style={styles.title} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: moderateScale(14),
        marginTop: moderateScale(4),
    },
    title: {
        fontSize: moderateScale(17),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
});

export default React.memo(StopsSectionHeader);
