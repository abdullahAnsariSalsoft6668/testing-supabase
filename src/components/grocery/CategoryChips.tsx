import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type CategoryChipsProps = {
    categories: string[];
    selected: string;
    onSelect: (category: string) => void;
};

const CategoryChips: React.FC<CategoryChipsProps> = ({ categories, selected, onSelect }) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
    >
        {categories.map(category => {
            const isActive = category === selected;
            return (
                <Pressable
                    key={category}
                    onPress={() => onSelect(category)}
                    style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
                >
                    <TextComp
                        text={category}
                        style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
                    />
                </Pressable>
            );
        })}
    </ScrollView>
);

const styles = StyleSheet.create({
    row: {
        gap: moderateScale(8),
        paddingBottom: spaces.small,
    },
    chip: {
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(8),
    },
    chipActive: {
        backgroundColor: theme.colors.brand.accent,
    },
    chipInactive: {
        backgroundColor: palette.neutral.gray50,
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
    },
    labelActive: {
        color: theme.colors.text.onAccent,
    },
    labelInactive: {
        color: theme.colors.text.secondary,
        fontFamily: plusJakarta.regular,
    },
});

export default CategoryChips;
