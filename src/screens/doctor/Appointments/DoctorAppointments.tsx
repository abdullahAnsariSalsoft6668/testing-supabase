import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AppointmentCard, AppointmentSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { DoctorStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { listDoctorAppointments } from '@/services/appointmentService';
import { resolveDoctorId } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { formatErrorMessage } from '@/utils/formatError';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const DoctorAppointments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<DoctorStackParamList>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    const load = useCallback(
        async (showMissingDoctorToast = false) => {
            // Only show full-screen spinner on the very first load.
            // Subsequent focus refreshes update silently to avoid flickering.
            if (!hasFetchedRef.current) setLoading(true);
            try {
                const doctorId = await resolveDoctorId(user);

                if (!doctorId) {
                    setAppointments([]);
                    if (showMissingDoctorToast) {
                        Toast.show({
                            type: 'info',
                            text1: 'Doctor profile not loaded',
                            text2: 'Sign out and sign in again if this persists.',
                        });
                    }
                    return;
                }

                const rows = await listDoctorAppointments(doctorId);
                setAppointments(rows);
            } catch (e: unknown) {
                Toast.show({ type: 'error', text1: 'Failed to load appointments', text2: formatErrorMessage(e) });
            } finally {
                setLoading(false);
                hasFetchedRef.current = true;
            }
        },
        [user.id, user.doctor_id, user.doctor?.id],
    );

    useFocusEffect(
        useCallback(() => {
            void load(false);
        }, [load]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Appointments" subtitle="Manage patient visits" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <AppointmentSkeleton count={4} />
                ) : appointments.length === 0 ? (
                    <>
                        <EmptyState title="No appointments" />
                        <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => void load(true)}>
                            <TextComp text="Refresh" style={healthScreenStyles.secondaryBtnText} />
                        </Pressable>
                    </>
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
