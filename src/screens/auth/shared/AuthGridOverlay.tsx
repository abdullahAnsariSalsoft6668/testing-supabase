import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { palette } from '@/styles/palette';

type AuthGridOverlayProps = {
    height?: number | `${number}%`;
    style?: ViewStyle;
};

const GRID_SIZE = 28;

const AuthGridOverlay: React.FC<AuthGridOverlayProps> = ({ height = '100%', style }) => (
    <View style={[styles.wrap, { height }, style]} pointerEvents="none">
        <Svg width="100%" height="100%">
            <Defs>
                <Pattern id="authGrid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <Line
                        x1={0}
                        y1={GRID_SIZE}
                        x2={GRID_SIZE}
                        y2={GRID_SIZE}
                        stroke={palette.purple.gridOverlay}
                        strokeWidth={1}
                    />
                    <Line
                        x1={GRID_SIZE}
                        y1={0}
                        x2={GRID_SIZE}
                        y2={GRID_SIZE}
                        stroke={palette.purple.gridOverlay}
                        strokeWidth={1}
                    />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#authGrid)" />
        </Svg>
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.9,
    },
});

export default AuthGridOverlay;
