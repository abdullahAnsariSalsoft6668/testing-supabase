import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';

import CalendarComp, { DateData } from '@/components/CalendarComp';
import TextComp from '@/components/TextComp';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { borders, heights, spaces } from '@/styles/sizes';

import AuthStaggerItem from './AuthStaggerItem';
import authStyles from './authStyles';

function formatDisplayDate(isoDate: string): string {
    if (!isoDate) return 'Select date';
    const [y, m, d] = isoDate.split('-').map(Number);
    if (!y || !m || !d) return isoDate;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

type AuthDatePickerProps = {
    index: number;
    label: string;
    value: string;
    onChange: (isoDate: string) => void;
    placeholder?: string;
    maxDate?: string;
    minDate?: string;
    containerStyle?: ViewStyle;
};

const AuthDatePicker: React.FC<AuthDatePickerProps> = ({
    index,
    label,
    value,
    onChange,
    placeholder = 'Select date',
    maxDate,
    minDate,
    containerStyle,
}) => {
    const [open, setOpen] = useState(false);

    const markedDates = useMemo(() => {
        if (!value) return {};
        return {
            [value]: {
                selected: true,
                selectedColor: palette.teal.main,
                selectedTextColor: palette.neutral.white,
            },
        };
    }, [value]);

    const handleSelect = (day: DateData) => {
        onChange(day.dateString);
        setOpen(false);
    };

    return (
        <AuthStaggerItem index={index}>
            <View style={[authStyles.inputContainer, containerStyle]}>
                <TextComp text={label} style={authStyles.inputLabel} />
                <Pressable
                    style={[styles.field, value ? styles.fieldFilled : null]}
                    onPress={() => setOpen(true)}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}, ${value ? formatDisplayDate(value) : placeholder}`}
                >
                    <TextComp
                        text={value ? formatDisplayDate(value) : placeholder}
                        style={[styles.fieldText, !value && styles.placeholder]}
                    />
                    <TextComp text="📅" style={styles.icon} />
                </Pressable>
            </View>

            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
                backdropOpacity={0.45}
                useNativeDriver
                hideModalContentWhileAnimating
            >
                <View style={styles.modalCard}>
                    <TextComp text={label} style={styles.modalTitle} />
                    <CalendarComp
                        selected={value || undefined}
                        markedDates={markedDates}
                        onDayPress={handleSelect}
                        maxDate={maxDate}
                        minDate={minDate}
                        theme={{
                            selectedDayBackgroundColor: palette.teal.main,
                            todayTextColor: palette.teal.main,
                            arrowColor: palette.teal.main,
                        }}
                        style={styles.calendar}
                    />
                    <Pressable style={styles.modalClose} onPress={() => setOpen(false)}>
                        <TextComp text="Done" style={styles.modalCloseText} />
                    </Pressable>
                </View>
            </Modal>
        </AuthStaggerItem>
    );
};

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heights.input,
        paddingHorizontal: spaces.medium,
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: palette.neutral.border,
        backgroundColor: palette.neutral.white,
    },
    fieldFilled: {
        borderColor: palette.teal.light,
        backgroundColor: palette.teal.surface,
    },
    fieldText: {
        fontSize: moderateScale(14),
        color: palette.neutral.text,
        flex: 1,
    },
    placeholder: {
        color: palette.neutral.textMuted,
    },
    icon: {
        fontSize: moderateScale(18),
        marginLeft: spaces.small,
    },
    modalCard: {
        backgroundColor: palette.neutral.white,
        borderRadius: borders.card,
        padding: spaces.medium,
        overflow: 'hidden',
    },
    modalTitle: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: palette.neutral.text,
        marginBottom: spaces.small,
        textAlign: 'center',
    },
    calendar: {
        borderRadius: moderateScale(12),
    },
    modalClose: {
        marginTop: spaces.small,
        alignSelf: 'center',
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(24),
        borderRadius: moderateScale(20),
        backgroundColor: palette.teal.main,
    },
    modalCloseText: {
        color: palette.neutral.white,
        fontWeight: '600',
        fontSize: moderateScale(14),
    },
});

export default AuthDatePicker;
