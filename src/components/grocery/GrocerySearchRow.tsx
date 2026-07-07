import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import MyIcons from '@/components/MyIcons';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type GrocerySearchRowProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onFilterPress?: () => void;
};

const SearchIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Circle cx={11} cy={11} r={7} stroke={palette.neutral.textMuted} strokeWidth={1.8} />
        <Path d="M20 20L16.5 16.5" stroke={palette.neutral.textMuted} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

const GrocerySearchRow: React.FC<GrocerySearchRowProps> = ({
    value,
    onChangeText,
    placeholder = 'Search deals or stores...',
    onFilterPress,
}) => (
    <View style={styles.row}>
        <View style={styles.searchWrap}>
            <SearchIcon />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={palette.neutral.textMuted}
                style={styles.input}
            />
        </View>
        <Pressable style={styles.filterBtn} onPress={onFilterPress} accessibilityRole="button">
            <MyIcons name="filterPrimary" size={moderateScale(20)} stroke={theme.colors.brand.primary} />
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        marginTop: spaces.medium,
    },
    searchWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(24),
        paddingHorizontal: spaces.medium,
        height: moderateScale(48),
        gap: moderateScale(8),
    },
    input: {
        flex: 1,
        fontFamily: plusJakarta.regular,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        paddingVertical: 0,
    },
    filterBtn: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(14),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.card,
    },
});

export default GrocerySearchRow;
