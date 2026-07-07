import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import {
    appointmentStatusStyles,
    doctorStatusStyles,
    slotStatusStyles,
} from '@/styles/healthStatus';
import { moderateScale } from '@/styles/scaling';
import type { AppointmentStatus, DoctorStatus, SlotStatus } from '@/types/database';

type StatusBadgeProps =
    | { status: AppointmentStatus; type?: 'appointment' }
    | { status: DoctorStatus; type: 'doctor' }
    | { status: SlotStatus; type: 'slot' };

const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
    const { status, type = 'appointment' } = props;
    const style =
        type === 'doctor'
            ? doctorStatusStyles[status as DoctorStatus]
            : type === 'slot'
              ? slotStatusStyles[status as SlotStatus]
              : appointmentStatusStyles[status as AppointmentStatus];

    return (
        <View style={[styles.badge, { backgroundColor: style.background }]}>
            <TextComp text={style.label} style={[styles.text, { color: style.text }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
        alignSelf: 'flex-start',
    },
    text: { fontSize: moderateScale(11), fontWeight: '600' },
});

export default StatusBadge;
