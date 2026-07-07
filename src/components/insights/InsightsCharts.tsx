import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import SectionHeader from '@/components/grocery/SectionHeader';
import { MONTHLY_SAVINGS, WEEKLY_SAVINGS } from '@/components/insights/constants';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale, width } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const CHART_HEIGHT = moderateScale(110);
const Y_TICKS = [32, 24, 16] as const;

export const MonthlySavingsChart: React.FC = () => {
    const max = Math.max(...MONTHLY_SAVINGS.map(item => item.value));

    return (
        <View style={styles.card}>
            <SectionHeader title="Monthly Savings" trailing="Jan – Jun 2026" />
            <View style={styles.monthlyWrap}>
                <View style={styles.yAxis}>
                    {Y_TICKS.map(tick => (
                        <TextComp key={tick} text={`$${tick}`} style={styles.yTick} />
                    ))}
                </View>
                <View style={styles.chartArea}>
                    {Y_TICKS.map((tick, index) => (
                        <View
                            key={`grid-${tick}`}
                            style={[
                                styles.gridLine,
                                {
                                    top:
                                        index === Y_TICKS.length - 1
                                            ? CHART_HEIGHT - StyleSheet.hairlineWidth
                                            : (index / (Y_TICKS.length - 1)) * CHART_HEIGHT,
                                },
                            ]}
                        />
                    ))}
                    <View style={styles.barsRow}>
                        {MONTHLY_SAVINGS.map(item => {
                            const barHeight = Math.max((item.value / max) * CHART_HEIGHT, moderateScale(4));
                            return (
                                <View key={item.label} style={styles.barColumn}>
                                    <View style={styles.barTrack}>
                                        <View style={[styles.barFill, { height: barHeight }]} />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>
            <View style={styles.monthLabelsRow}>
                {MONTHLY_SAVINGS.map(item => (
                    <TextComp key={item.label} text={item.label} style={styles.barLabel} />
                ))}
            </View>
        </View>
    );
};

type WeeklySavingsChartProps = {
    savedLabel: string;
};

export const WeeklySavingsChart: React.FC<WeeklySavingsChartProps> = ({ savedLabel }) => {
    const max = Math.max(...WEEKLY_SAVINGS.map(item => item.value));
    const min = Math.min(...WEEKLY_SAVINGS.map(item => item.value));
    const chartWidth = width - moderateScale(72);
    const chartInnerHeight = moderateScale(72);
    const range = max - min || 1;

    const points = WEEKLY_SAVINGS.map((item, index) => {
        const x =
            WEEKLY_SAVINGS.length <= 1
                ? chartWidth / 2
                : (index / (WEEKLY_SAVINGS.length - 1)) * chartWidth;
        const y = chartInnerHeight - ((item.value - min) / range) * chartInnerHeight;
        return { id: item.id, x, y, label: item.label };
    });

    const linePath = points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');

    return (
        <View style={styles.card}>
            <View style={styles.weekHeader}>
                <TextComp text="This Week" style={styles.weekTitle} />
                <TextComp text={savedLabel} style={styles.weekSaved} />
            </View>
            <Svg width={chartWidth} height={chartInnerHeight + moderateScale(8)}>
                {[0.25, 0.5, 0.75].map(ratio => (
                    <Line
                        key={ratio}
                        x1={0}
                        y1={chartInnerHeight * ratio}
                        x2={chartWidth}
                        y2={chartInnerHeight * ratio}
                        stroke={palette.neutral.gray100}
                        strokeWidth={1}
                        strokeDasharray="4 4"
                    />
                ))}
                <Path
                    d={linePath}
                    stroke={theme.colors.brand.primary}
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {points.map(point => (
                    <Circle
                        key={point.id}
                        cx={point.x}
                        cy={point.y}
                        r={moderateScale(4)}
                        fill={theme.colors.brand.primary}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                    />
                ))}
            </Svg>
            <View style={[styles.dayRow, { width: chartWidth }]}>
                {points.map(point => (
                    <TextComp key={point.id} text={point.label} style={styles.dayLabel} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    monthlyWrap: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    yAxis: {
        justifyContent: 'space-between',
        height: CHART_HEIGHT,
        marginRight: moderateScale(8),
    },
    yTick: {
        fontSize: moderateScale(10),
        color: palette.neutral.textMuted,
    },
    chartArea: {
        flex: 1,
        height: CHART_HEIGHT,
        position: 'relative',
        justifyContent: 'flex-end',
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: palette.neutral.gray100,
    },
    barsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: CHART_HEIGHT,
        zIndex: 1,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barTrack: {
        height: CHART_HEIGHT,
        justifyContent: 'flex-end',
        width: moderateScale(22),
    },
    barFill: {
        width: '100%',
        borderRadius: moderateScale(6),
        backgroundColor: theme.colors.brand.primary,
    },
    monthLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScale(8),
        paddingLeft: moderateScale(28),
    },
    barLabel: {
        flex: 1,
        fontSize: moderateScale(10),
        color: palette.neutral.textMuted,
        textAlign: 'center',
    },
    weekHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spaces.small,
    },
    weekTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        color: theme.colors.text.primary,
    },
    weekSaved: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        color: palette.green.main,
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScale(4),
    },
    dayLabel: {
        fontSize: moderateScale(10),
        color: palette.neutral.textMuted,
        textAlign: 'center',
        minWidth: moderateScale(16),
    },
});
