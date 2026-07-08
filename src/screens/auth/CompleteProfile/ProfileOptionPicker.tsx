import React from 'react';
import { Pressable, View } from 'react-native';

import TextComp from '@/components/TextComp';

import AuthStaggerItem from '../shared/AuthStaggerItem';
import styles from './styles';

type ProfileOptionPickerProps<T extends string> = {
    index: number;
    label: string;
    options: readonly T[];
    value: T;
    onChange: (value: T) => void;
    columns?: 2 | 3 | 4;
};

function ProfileOptionPicker<T extends string>({
    index,
    label,
    options,
    value,
    onChange,
    columns = 3,
}: ProfileOptionPickerProps<T>) {
    return (
        <AuthStaggerItem index={index}>
            <TextComp text={label} style={styles.sectionLabel} />
            <View style={[styles.optionGrid, columns === 4 && styles.optionGridFour]}>
                {options.map((option) => {
                    const selected = value === option;
                    return (
                        <Pressable
                            key={option}
                            onPress={() => onChange(option)}
                            style={[styles.optionChip, selected && styles.optionChipSelected]}
                            accessibilityRole="button"
                            accessibilityState={{ selected }}
                        >
                            <TextComp text={option} style={[styles.optionChipText, selected && styles.optionChipTextSelected]} />
                        </Pressable>
                    );
                })}
            </View>
        </AuthStaggerItem>
    );
}

export default ProfileOptionPicker;
