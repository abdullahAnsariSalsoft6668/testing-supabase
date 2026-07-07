import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { BARCODE_TIMER_SECONDS } from './constants';

type BarcodeTimerCardProps = {
    totalSeconds?: number;
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
};

const BarcodeTimerCard: React.FC<BarcodeTimerCardProps> = ({
    totalSeconds = BARCODE_TIMER_SECONDS,
}) => {
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

    useEffect(() => {
        if (secondsLeft <= 0) return undefined;

        const timer = setInterval(() => {
            setSecondsLeft(current => Math.max(0, current - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const progress = useMemo(() => secondsLeft / totalSeconds, [secondsLeft, totalSeconds]);
    const size = moderateScale(64);
    const stroke = moderateScale(5);
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={styles.card}>
            <View style={[styles.timerWrap, { width: size, height: size }]}>
                <Svg width={size} height={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={theme.colors.border.default}
                        strokeWidth={stroke}
                        fill="none"
                    />
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={theme.colors.brand.primary}
                            strokeWidth={stroke}
                            fill="none"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </G>
                    <SvgText
                        x={size / 2}
                        y={size / 2}
                        fill={theme.colors.brand.primary}
                        fontSize={moderateScale(13)}
                        fontWeight="700"
                        textAnchor="middle"
                        alignmentBaseline="central"
                    >
                        {formatTime(secondsLeft)}
                    </SvgText>
                </Svg>
            </View>

            <View style={styles.content}>
                <View style={styles.validRow}>
                    <View style={styles.validCheck}>
                        <TextComp text="✓" style={styles.validCheckMark} />
                    </View>
                    <TextComp text="Valid Barcode" style={styles.title} />
                </View>
                <TextComp
                    text="Show barcode to cashier before timer runs out"
                    style={styles.subtitle}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.large,
        ...theme.shadows.card,
    },
    timerWrap: {
        position: 'relative',
        marginRight: spaces.medium,
    },
    content: {
        flex: 1,
    },
    validRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: moderateScale(4),
    },
    validCheck: {
        width: moderateScale(18),
        height: moderateScale(18),
        borderRadius: moderateScale(9),
        borderWidth: 1.5,
        borderColor: theme.colors.text.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    validCheckMark: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(10),
        color: theme.colors.text.primary,
        lineHeight: moderateScale(12),
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.text.primary,
    },
    subtitle: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.secondary,
    },
});

export default BarcodeTimerCard;
