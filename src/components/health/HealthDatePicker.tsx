import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';

import CalendarComp, { DateData } from '@/components/CalendarComp';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

function formatDisplayDate(isoDate: string): string {
    if (!isoDate) return 'Select date';
    const [y, m, d] = isoDate.split('-').map(Number);
    if (!y || !m || !d) return isoDate;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

type HealthDatePickerProps = {
    label?: string;
    value: string;
    onChange: (isoDate: string) => void;
    placeholder?: string;
    maxDate?: string;
    minDate?: string;
    containerStyle?: ViewStyle;
};

const HealthDatePicker: React.FC<HealthDatePickerProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Select appointment date',
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
                selectedColor: theme.palette.teal.main,
                selectedTextColor: theme.colors.text.inverse,
            },
        };
    }, [value]);

    const handleSelect = (day: DateData) => {
        onChange(day.dateString);
        setOpen(false);
    };

    return (
        <View style={containerStyle}>
            {label ? <TextComp text={label} style={styles.label} /> : null}
            <Pressable
                style={[styles.field, value ? styles.fieldFilled : null]}
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`${label ?? 'Date'}, ${value ? formatDisplayDate(value) : placeholder}`}
            >
                <View style={styles.fieldIcon}>
                    <MyIcons name="healthTabCalendar" size={18} stroke={theme.palette.teal.main} />
                </View>
                <TextComp
                    text={value ? formatDisplayDate(value) : placeholder}
                    style={[styles.fieldText, !value && styles.placeholder]}
                />
                <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.secondary} />
            </Pressable>

            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
                backdropOpacity={0.45}
                useNativeDriver
                hideModalContentWhileAnimating
            >
                <View style={styles.modalCard}>
                    <TextComp text={label ?? 'Select Date'} style={styles.modalTitle} />
                    <CalendarComp
                        selected={value || undefined}
                        markedDates={markedDates}
                        onDayPress={handleSelect}
                        maxDate={maxDate}
                        minDate={minDate}
                        theme={{
                            selectedDayBackgroundColor: theme.palette.teal.main,
                            todayTextColor: theme.palette.teal.main,
                            arrowColor: theme.palette.teal.main,
                        }}
                        style={styles.calendar}
                    />
                    <Pressable style={styles.modalClose} onPress={() => setOpen(false)}>
                        <TextComp text="Done" style={styles.modalCloseText} />
                    </Pressable>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: moderateScale(8),
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(14),
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        backgroundColor: theme.colors.card.background,
        ...theme.shadows.card,
    },
    fieldFilled: {
        borderColor: theme.palette.teal.main + '55',
        backgroundColor: theme.palette.teal.surface,
    },
    fieldIcon: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(10),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldText: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        flex: 1,
        fontWeight: '500',
    },
    placeholder: { color: theme.colors.text.muted, fontWeight: '400' },
    modalCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        overflow: 'hidden',
    },
    modalTitle: {
        fontSize: moderateScale(17),
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: moderateScale(12),
        textAlign: 'center',
    },
    calendar: { borderRadius: moderateScale(12) },
    modalClose: {
        marginTop: moderateScale(12),
        alignSelf: 'center',
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(28),
        borderRadius: moderateScale(20),
        backgroundColor: theme.palette.teal.main,
    },
    modalCloseText: {
        color: theme.colors.text.inverse,
        fontWeight: '600',
        fontSize: moderateScale(14),
    },
});

export default HealthDatePicker;
