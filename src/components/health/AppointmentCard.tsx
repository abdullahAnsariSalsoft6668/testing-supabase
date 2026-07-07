import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import StatusBadge from '@/components/health/StatusBadge';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import type { Appointment } from '@/types/database';

type AppointmentCardProps = {
    appointment: Appointment;
    subtitle?: string;
    onPress?: () => void;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, subtitle, onPress }) => {
    const date = appointment.appointment_date;
    const time = appointment.appointment_time?.slice(0, 5) ?? '';

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <View style={styles.dateCol}>
                <TextComp text={date.split('-')[2]} style={styles.day} />
                <TextComp text={date.slice(5, 7)} style={styles.month} />
            </View>
            <View style={styles.info}>
                <View style={styles.row}>
                    <TextComp text={subtitle ?? 'Appointment'} style={styles.title} />
                    <StatusBadge status={appointment.status} />
                </View>
                <TextComp text={`${date} at ${time}`} style={styles.meta} />
                {appointment.notes ? (
                    <TextComp text={appointment.notes} style={styles.notes} numberOfLines={1} />
                ) : null}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    dateCol: {
        width: moderateScale(52),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.teal.surface,
        borderRadius: moderateScale(10),
        marginRight: moderateScale(12),
        paddingVertical: moderateScale(8),
    },
    day: { fontSize: moderateScale(20), fontWeight: '700', color: theme.palette.teal.main },
    month: { fontSize: moderateScale(11), color: theme.palette.teal.dark },
    info: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    title: { fontSize: moderateScale(14), fontWeight: '600', flex: 1, color: theme.colors.text.primary },
    meta: { fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: 6 },
    notes: { fontSize: moderateScale(12), color: theme.colors.text.muted, marginTop: 4 },
});

export default AppointmentCard;
