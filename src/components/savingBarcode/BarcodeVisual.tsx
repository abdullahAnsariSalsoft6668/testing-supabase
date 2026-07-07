import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

const BARCODE_LINES = [
    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2,
] as const;

const VIEWBOX_WIDTH = 280;
const BAR_UNIT = 2.2;
const BAR_GAP = 2.4;

const TOTAL_BARS_WIDTH =
    BARCODE_LINES.reduce((sum, width) => sum + width * BAR_UNIT + BAR_GAP, 0) - BAR_GAP;
const BARS_START_X = (VIEWBOX_WIDTH - TOTAL_BARS_WIDTH) / 2;

type BarcodeVisualProps = {
    code: string;
};

const BarcodeVisual: React.FC<BarcodeVisualProps> = ({ code }) => (
    <View style={styles.wrap}>
        <Svg width="100%" height={moderateScale(80)} viewBox={`0 0 ${VIEWBOX_WIDTH} 80`}>
            {BARCODE_LINES.reduce<{ x: number; nodes: React.ReactNode[] }>(
                (acc, width, index) => {
                    const rect = (
                        <Rect
                            key={`bar-${index}`}
                            x={acc.x}
                            y={10}
                            width={width * BAR_UNIT}
                            height={60}
                            fill={palette.neutral.text}
                        />
                    );
                    return {
                        x: acc.x + width * BAR_UNIT + BAR_GAP,
                        nodes: [...acc.nodes, rect],
                    };
                },
                { x: BARS_START_X, nodes: [] },
            ).nodes}
        </Svg>
        <TextComp text={code} style={styles.code} />
    </View>
);

const styles = StyleSheet.create({
    wrap: {
        borderWidth: 1,
        borderColor: palette.neutral.gray100,
        borderRadius: moderateScale(14),
        backgroundColor: theme.colors.card.background,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(10),
        alignItems: 'center',
    },
    code: {
        marginTop: moderateScale(10),
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        letterSpacing: moderateScale(1.2),
        color: theme.colors.text.secondary,
    },
});

export default BarcodeVisual;
