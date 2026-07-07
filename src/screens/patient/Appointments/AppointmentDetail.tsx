import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import { PatientStackParamList } from '@/navigation/types';
import { cancelAppointment } from '@/services/appointmentService';
import { getSupabase } from '@/utils/supabase';
import { getUserDisplayName } from '@/utils/userDisplay';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Appointment } from '@/types/database';
import Toast from 'react-native-toast-message';

const AppointmentDetail = () => {
    const route = useRoute<RouteProp<PatientStackParamList, 'AppointmentDetail'>>();
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
        getSupabase()
            .from('appointments')
            .select('*, doctors(*, users(*), hospitals(*))')
            .eq('id', route.params.appointmentId)
            .single()
            .then(({ data }) => setAppointment(data as Appointment))
            .catch(() => {})
            .then(() => setLoading(false));
        }, [route.params.appointmentId]),
    );

    const handleCancel = async () => {
        if (!appointment) return;
        try {
            await cancelAppointment(appointment.id, appointment.slot_id);
            Toast.show({ type: 'success', text1: 'Appointment cancelled' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Cancel failed', text2: String(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Visit Details" subtitle="">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading || !appointment ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <View style={healthScreenStyles.card}>
                        <StatusBadge status={appointment.status} />
                        <TextComp
                            text={getUserDisplayName(appointment.doctors?.users, 'Doctor')}
                            style={[healthScreenStyles.cardTitle, { marginTop: 12 }]}
                        />
                        <TextComp
                            text={`${appointment.appointment_date} at ${appointment.appointment_time.slice(0, 5)}`}
                            style={healthScreenStyles.cardMeta}
                        />
                        {appointment.notes ? (
                            <TextComp text={appointment.notes} style={healthScreenStyles.cardMeta} />
                        ) : null}
                        {['PENDING', 'CONFIRMED'].includes(appointment.status) ? (
                            <Pressable style={healthScreenStyles.secondaryBtn} onPress={handleCancel}>
                                <TextComp text="Cancel Appointment" style={healthScreenStyles.secondaryBtnText} />
                            </Pressable>
                        ) : null}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default AppointmentDetail;
