import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import MyIcons, { type IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type Trend = 'up' | 'down' | 'stable';

type HealthMetricCardProps = {
    title: string;
    value: string;
    unit?: string;
    icon: IconName;
    trend?: Trend;
    trendLabel?: string;
    sparkline?: number[];
    onPress?: () => void;
};

const trendStyles: Record<Trend, { bg: string; color: string }> = {
    up: { bg: 'rgba(47, 163, 107, 0.12)', color: theme.palette.medical.success },
    down: { bg: 'rgba(245, 185, 66, 0.12)', color: theme.palette.medical.warning },
    stable: { bg: theme.palette.olive.main, color: theme.colors.text.secondary },
};

const HealthMetricCard = ({
    title,
    value,
    unit,
    icon,
    trend = 'stable',
    trendLabel,
    sparkline = [4, 6, 5, 8, 7, 9],
    onPress,
}: HealthMetricCardProps) => {
    const trendStyle = trendStyles[trend];
    const points = sparkline
        .map((v, i) => {
            const x = (i / (sparkline.length - 1)) * moderateScale(72);
            const y = moderateScale(24) - (v / 10) * moderateScale(20);
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <ScalePressable style={styles.card} onPress={onPress}>
            <View style={styles.topRow}>
                <View style={styles.iconWash}>
                    <MyIcons name={icon} size={moderateScale(16)} stroke={theme.palette.lime.main} />
                </View>
                {trendLabel ? (
                    <View style={[styles.trendChip, { backgroundColor: trendStyle.bg }]}>
                        <TextComp
                            text={trendLabel}
                            style={[typography.bodySmall, { color: trendStyle.color, fontWeight: '700' }]}
                        />
                    </View>
                ) : null}
            </View>
            <TextComp text={title} style={[typography.bodySmall, styles.title]} />
            <View style={styles.valueRow}>
                <TextComp text={value} style={typography.stat} />
                {unit ? <TextComp text={unit} style={styles.unit} /> : null}
            </View>
            <Svg width={moderateScale(72)} height={moderateScale(24)}>
                <Polyline
                    points={points}
                    fill="none"
                    stroke={theme.palette.lime.main}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </Svg>
        </ScalePressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
        gap: moderateScale(8),
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconWash: {
        width: theme.iconWash.metricSize,
        height: theme.iconWash.metricSize,
        borderRadius: theme.iconWash.metricRadius,
        backgroundColor: theme.palette.lime.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendChip: {
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(9999),
    },
    title: {
        color: theme.colors.text.secondary,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: moderateScale(4),
    },
    unit: {
        ...typography.bodySmall,
        marginBottom: moderateScale(4),
    },
});

export default HealthMetricCard;
