import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import TextComp from '@/components/TextComp';
import { LAYOUT_TRANSITION } from '@/styles/motion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

export type BarChartItem = {
    id: string;
    label: string;
    value: number;
};

type HealthBarChartProps = {
    data: BarChartItem[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    maxValue?: number;
};

const HealthBarChart = ({ data, selectedId, onSelect, maxValue }: HealthBarChartProps) => {
    const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

    return (
        <View style={styles.row}>
            {data.map((item) => {
                const selected = item.id === selectedId;
                const heightRatio = item.value / max;
                const barHeight = moderateScale(80) * heightRatio + (selected ? moderateScale(8) : 0);

                return (
                    <Pressable key={item.id} style={styles.item} onPress={() => onSelect?.(item.id)}>
                        <Animated.View layout={LAYOUT_TRANSITION} style={{ height: barHeight, width: '100%' }}>
                            <LinearGradient
                                colors={
                                    selected
                                        ? [...theme.gradients.barSelected]
                                        : [...theme.gradients.barUnselected]
                                }
                                style={styles.bar}
                            />
                        </Animated.View>
                        <TextComp text={item.label} style={[typography.tab, styles.label]} />
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: moderateScale(10),
        height: moderateScale(120),
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: moderateScale(8),
    },
    bar: {
        flex: 1,
        borderRadius: moderateScale(8),
        minHeight: moderateScale(8),
    },
    label: {
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
});

export default HealthBarChart;
