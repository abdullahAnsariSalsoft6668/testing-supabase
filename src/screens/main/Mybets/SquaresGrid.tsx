import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale, width } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const COLUMN_HEADERS = ['', '3', '7', '1', '9', '0', '5', '2', '8', '4', '6'];
const ROW_HEADERS = ['2', '8', '5', '1'];

type CellVariant = 'empty' | 'user1' | 'user2' | 'gradient' | 'icon';

const GRID_VARIANTS: CellVariant[][] = [
    ['user1', 'empty', 'empty', 'user2', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'gradient', 'empty', 'empty', 'user1', 'empty', 'empty', 'empty', 'empty'],
    ['empty', 'user2', 'empty', 'empty', 'icon', 'empty', 'empty', 'user1', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'user2', 'empty', 'empty', 'empty', 'empty', 'gradient', 'empty'],
];

const GRID_COLUMNS = COLUMN_HEADERS.length;
const GRID_GAP = moderateScale(2);
const GRID_PADDING = spaces.medium;
const CELL_SIZE = Math.floor(
    (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS,
);

const SquaresGrid: React.FC = () => {
    const cellStyle = useMemo(
        () => ({
            width: CELL_SIZE,
            height: CELL_SIZE,
        }),
        [],
    );

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View>
                    <View style={styles.headerRow}>
                        {COLUMN_HEADERS.map((label, index) => (
                            <View
                                key={`col-${label}-${index}`}
                                style={[styles.headerCell, cellStyle, index === 0 && styles.cornerCell]}
                            >
                                {index === 0 ? (
                                    <TextComp text="🦅" style={styles.cornerEmoji} />
                                ) : (
                                    <TextComp text={label} style={styles.headerText} />
                                )}
                            </View>
                        ))}
                    </View>

                    {GRID_VARIANTS.map((row, rowIndex) => (
                        <View key={`row-${ROW_HEADERS[rowIndex]}`} style={styles.gridRow}>
                            <View style={[styles.rowHeaderCell, cellStyle]}>
                                <TextComp text={ROW_HEADERS[rowIndex]} style={styles.rowHeaderText} />
                            </View>
                            {row.map((variant, colIndex) => (
                                <View
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    style={[styles.gridCell, cellStyle]}
                                >
                                    {variant === 'user1' || variant === 'user2' ? (
                                        <MyIcons name={variant} size={moderateScale(24)} />
                                    ) : null}
                                    {variant === 'gradient' ? (
                                        <LinearGradient
                                            colors={[
                                                Colors.buttonSplitFillStart,
                                                Colors.buttonSplitFillMid,
                                                Colors.buttonSplitFillEnd,
                                            ]}
                                            start={{ x: 0, y: 0.5 }}
                                            end={{ x: 1, y: 0.5 }}
                                            style={styles.gradientFill}
                                        />
                                    ) : null}
                                    {variant === 'icon' ? (
                                        <TextComp text="🦅" style={styles.cellEmoji} />
                                    ) : null}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.primary,
        borderRadius: moderateScale(16),
        paddingVertical: moderateScale(12),
        overflow: 'hidden',
    },
    scrollContent: {
    },
    headerRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
        marginBottom: GRID_GAP,
    },
    gridRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
        marginBottom: GRID_GAP,
    },
    headerCell: {
        backgroundColor: Colors.tabActive,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(4),
    },
    cornerCell: {
        backgroundColor: Colors.tabActive,
    },
    headerText: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    cornerEmoji: {
        fontSize: moderateScale(12),
    },
    rowHeaderCell: {
        backgroundColor: '#0F3D2E',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(4),
    },
    rowHeaderText: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    gridCell: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(4),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientFill: {
        ...StyleSheet.absoluteFillObject,
    },
    cellEmoji: {
        fontSize: moderateScale(14),
    },
});

export default React.memo(SquaresGrid);
