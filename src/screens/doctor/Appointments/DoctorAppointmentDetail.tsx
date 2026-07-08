import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { DetailSkeleton, HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import { DoctorStackParamList } from '@/navigation/types';
import { getAppointmentById, updateAppointmentStatus } from '@/services/appointmentService';
import { getUserDisplayName } from '@/utils/userDisplay';
import { formatErrorMessage } from '@/utils/formatError';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Appointment, AppointmentStatus } from '@/types/database';

const DoctorAppointmentDetail = () => {
    const route = useRoute<RouteProp<DoctorStackParamList, 'DoctorAppointmentDetail'>>();
    const navigation = useNavigation();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const row = await getAppointmentById(route.params.appointmentId);
            setAppointment(row);
        } catch (e: unknown) {
            setAppointment(null);
            Toast.show({ type: 'error', text1: 'Failed to load visit', text2: formatErrorMessage(e) });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { void load(); }, [route.params.appointmentId]));

    const setStatus = async (status: AppointmentStatus) => {
        try {
            await updateAppointmentStatus(route.params.appointmentId, status);
            Toast.show({ type: 'success', text1: `Marked ${status}` });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Update failed', text2: String(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Visit Details" subtitle="">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading || !appointment ? (
                    <DetailSkeleton rows={3} />
                ) : (
                    <View style={healthScreenStyles.card}>
                        <StatusBadge status={appointment.status} />
                        <TextComp
                            text={getUserDisplayName(appointment.patients?.users, 'Patient')}
                            style={[healthScreenStyles.cardTitle, { marginTop: 12 }]}
                        />
                        <TextComp
                            text={`${appointment.appointment_date} at ${appointment.appointment_time.slice(0, 5)}`}
                            style={healthScreenStyles.cardMeta}
                        />
                        {appointment.status === 'PENDING' ? (
                            <Pressable style={healthScreenStyles.primaryBtn} onPress={() => setStatus('CONFIRMED')}>
                                <TextComp text="Confirm" style={healthScreenStyles.primaryBtnText} />
                            </Pressable>
                        ) : null}
                        {appointment.status === 'CONFIRMED' ? (
                            <>
                                <Pressable style={healthScreenStyles.primaryBtn} onPress={() => setStatus('COMPLETED')}>
                                    <TextComp text="Mark Completed" style={healthScreenStyles.primaryBtnText} />
                                </Pressable>
                                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => setStatus('NO_SHOW')}>
                                    <TextComp text="No Show" style={healthScreenStyles.secondaryBtnText} />
                                </Pressable>
                            </>
                        ) : null}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorAppointmentDetail;
