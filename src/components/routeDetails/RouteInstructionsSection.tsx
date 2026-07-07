import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';

import RouteDetailsCard from './RouteDetailsCard';
import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';

const DocumentIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M8 3h6l4 4v14H8V3z"
            stroke={Colors.gray500}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path d="M14 3v5h5" stroke={Colors.gray500} strokeWidth={1.6} strokeLinejoin="round" />
        <Rect x="10" y="12" width="8" height="1.5" rx="0.75" fill={Colors.gray300} />
        <Rect x="10" y="16" width="6" height="1.5" rx="0.75" fill={Colors.gray300} />
    </Svg>
);

type RouteInstructionsSectionProps = {
    instructions: string;
};

const RouteInstructionsSection: React.FC<RouteInstructionsSectionProps> = ({ instructions }) => {
    const animatedStyle = useEntranceAnimation({
        index: 1,
        baseDelay: ENTRANCE_BASE,
        step: ENTRANCE_STEP,
        translateY: 18,
    });

    return (
        <Animated.View style={animatedStyle}>
            <RouteDetailsCard>
                <View style={styles.headerRow}>
                    <DocumentIcon />
                    <TextComp text="Route Instructions" style={styles.title} />
                </View>
                <TextComp text={instructions} style={styles.body} />
            </RouteDetailsCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        marginBottom: moderateScale(10),
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

export default React.memo(RouteInstructionsSection);
