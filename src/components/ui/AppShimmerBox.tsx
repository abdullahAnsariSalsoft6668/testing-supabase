import React, { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

import { Colors } from '@/styles/colors';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export type ShimmerPalette = 'childProfile' | 'onWhite';

const PALETTES: Record<ShimmerPalette, [string, string, string]> = {
    childProfile: [...Colors.shimmerChildProfile],
    onWhite: [...Colors.shimmerOnWhite],
};

type AppShimmerBoxProps = {
    palette?: ShimmerPalette;
    style?: StyleProp<ViewStyle>;
    borderRadius?: number;
};

/** Measured shimmer primitive — host owns size via onLayout or explicit width/height. */
const AppShimmerBox = ({ palette = 'onWhite', style, borderRadius }: AppShimmerBoxProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <View
            style={[styles.host, style, borderRadius != null && { borderRadius }]}
            onLayout={() => setVisible(true)}
        >
            {visible ? (
                <ShimmerPlaceholder
                    shimmerColors={PALETTES[palette]}
                    style={StyleSheet.absoluteFill}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    host: {
        overflow: 'hidden',
        backgroundColor: Colors.gray50,
    },
});

export default AppShimmerBox;
