import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppointmentCard, AppointmentSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { listPatientAppointments } from '@/services/appointmentService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const PatientAppointments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user.patient_id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            listPatientAppointments(user.patient_id)
                .then(setAppointments)
                .finally(() => setLoading(false));
        }, [user.patient_id]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="My Visits" subtitle="Track your appointments" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <AppointmentSkeleton count={4} />
                ) : appointments.length === 0 ? (
                    <EmptyState title="No appointments yet" />
                ) : (
                    appointments.map((a) => (
                        <AppointmentCard
                            key={a.id}
                            appointment={a}
                            subtitle={getUserDisplayName(a.doctors?.users, 'Doctor')}
                            onPress={() =>
                                navigation.navigate(routes.patient.appointmentDetail, { appointmentId: a.id })
                            }
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default PatientAppointments;
