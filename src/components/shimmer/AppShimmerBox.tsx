import { Colors } from '@/styles/colors';
import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import { getShimmerColors, type ShimmerPalette } from './shimmerColors';

export type AppShimmerBoxProps = {
    style?: StyleProp<ViewStyle>;
    palette?: ShimmerPalette;
};

/** Small themed shimmer block; pass `LinearGradient` per library requirement. */
const AppShimmerBox: React.FC<AppShimmerBoxProps> = ({ style, palette = 'childProfile' }) => (
    <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        shimmerColors={getShimmerColors(palette)}
        style={[styles.base, style]}
    />
);

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.gray100,
        overflow: 'hidden',
    },
});

export default AppShimmerBox;
