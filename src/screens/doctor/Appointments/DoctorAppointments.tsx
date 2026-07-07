import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppointmentCard, EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { DoctorStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { listDoctorAppointments } from '@/services/appointmentService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const DoctorAppointments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DoctorStackParamList>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user.doctor_id) {
                setLoading(false);
                return;
            }
            listDoctorAppointments(user.doctor_id)
                .then(setAppointments)
                .finally(() => setLoading(false));
        }, [user.doctor_id]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Appointments" subtitle="Manage patient visits" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : appointments.length === 0 ? (
                    <EmptyState title="No appointments" />
                ) : (
                    appointments.map((a) => (
                        <AppointmentCard
                            key={a.id}
                            appointment={a}
                            subtitle={getUserDisplayName(a.patients?.users, 'Patient')}
                            onPress={() =>
                                navigation.navigate(routes.doctor.appointmentDetail, { appointmentId: a.id })
                            }
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorAppointments;
