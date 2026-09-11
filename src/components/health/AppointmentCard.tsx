import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import TextComp from '@/components/TextComp';
import StatusBadge from '@/components/health/StatusBadge';
import ScalePressable from '@/components/ui/ScalePressable';
import { listItemEntering } from '@/hooks/animations/listMotion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';
import type { Appointment } from '@/types/database';

type AppointmentCardProps = {
    appointment: Appointment;
    subtitle?: string;
    index?: number;
    onPress?: () => void;
};

const AppointmentCard = ({ appointment, subtitle, index = 0, onPress }: AppointmentCardProps) => {
    const date = appointment.appointment_date;
    const time = appointment.appointment_time?.slice(0, 5) ?? '';

    return (
        <ScalePressable onPress={onPress}>
            <Animated.View entering={listItemEntering(index)} style={styles.card}>
                <View style={styles.dateCol}>
                    <TextComp text={date.split('-')[2]} style={styles.day} />
                    <TextComp text={date.slice(5, 7)} style={styles.month} />
                </View>
                <View style={styles.info}>
                    <View style={styles.row}>
                        <TextComp text={subtitle ?? 'Appointment'} style={typography.label} />
                        <StatusBadge status={appointment.status} />
                    </View>
                    <TextComp text={`${date} at ${time}`} style={styles.meta} />
                    {appointment.notes ? (
                        <TextComp text={appointment.notes} style={styles.notes} numberOfLines={1} />
                    ) : null}
                </View>
            </Animated.View>
        </ScalePressable>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.appointmentCard,
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
        backgroundColor: theme.palette.lime.surface,
        borderRadius: moderateScale(12),
        marginRight: moderateScale(12),
        paddingVertical: moderateScale(8),
    },
    day: {
        ...typography.stat,
        fontSize: moderateScale(20),
        lineHeight: moderateScale(24),
        color: theme.palette.lime.main,
    },
    month: {
        ...typography.bodySmall,
        color: theme.palette.lime.dark,
        fontWeight: '700',
    },
    info: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    meta: { ...typography.bodySmall, marginTop: moderateScale(6) },
    notes: { ...typography.bodySmall, color: theme.colors.text.muted, marginTop: moderateScale(4) },
});

export default AppointmentCard;
