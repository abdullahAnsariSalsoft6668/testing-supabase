import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type GameStatsCardProps = {
    quarter: number | string;
    timeLeft: string;
};

const GradientTime = ({ value }: { value: string }) => (
    <Svg height={moderateScale(34)} width={moderateScale(92)}>
        <Defs>
            <SvgLinearGradient id="timeLeftGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={Colors.buttonSplitFillStart} />
                <Stop offset="0.5" stopColor={Colors.buttonSplitFillMid} />
                <Stop offset="1" stopColor={Colors.buttonSplitFillEnd} />
            </SvgLinearGradient>
        </Defs>
        <SvgText
            fill="url(#timeLeftGrad)"
            fontSize={moderateScale(28)}
            fontWeight="700"
            x="0"
            y={moderateScale(28)}
        >
            {value}
        </SvgText>
    </Svg>
);

const GameStatsCard: React.FC<GameStatsCardProps> = ({ quarter, timeLeft }) => (
    <View style={styles.card}>
        <View style={styles.half}>
            <TextComp text="QUARTER" style={styles.label} />
            <TextComp text={String(quarter)} style={styles.quarterValue} />
        </View>
        <View style={styles.divider} />
        <View style={styles.half}>
            <TextComp text="TIME LEFT" style={styles.label} />
            <GradientTime value={timeLeft} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: moderateScale(20),
        paddingVertical: moderateScale(18),
        paddingHorizontal: spaces.medium,
        marginBottom: spaces.medium,
        alignItems: 'center',
    },
    half: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: Colors.gray200,
        marginVertical: moderateScale(4),
    },
    label: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.gray500,
        letterSpacing: moderateScale(0.8),
        marginBottom: moderateScale(6),
    },
    quarterValue: {
        fontSize: moderateScale(28),
        fontFamily: fontFamily.bold,
        color: Colors.black,
    },
});

export default React.memo(GameStatsCard);
