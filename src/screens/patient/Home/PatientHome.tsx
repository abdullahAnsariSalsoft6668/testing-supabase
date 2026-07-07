import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppointmentCard, EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { getUpcomingPatientAppointment } from '@/services/appointmentService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const PatientHome = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [upcoming, setUpcoming] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user.patient_id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            getUpcomingPatientAppointment(user.patient_id)
                .then(setUpcoming)
                .finally(() => setLoading(false));
        }, [user.patient_id]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader
                title={`Hello, ${user.full_name?.split(' ')[0] ?? 'Patient'}`}
                subtitle="Manage your health appointments"
            />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : upcoming ? (
                    <AppointmentCard
                        appointment={upcoming}
                        subtitle={getUserDisplayName(upcoming.doctors?.users, 'Doctor')}
                        onPress={() =>
                            navigation.navigate(routes.patient.appointmentDetail, { appointmentId: upcoming.id })
                        }
                    />
                ) : (
                    <EmptyState title="No upcoming visits" message="Book an appointment with a specialist." />
                )}
                <Pressable
                    style={healthScreenStyles.primaryBtn}
                    onPress={() => navigation.navigate('PatientExplore')}
                >
                    <TextComp text="Find a Doctor" style={healthScreenStyles.primaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default PatientHome;
