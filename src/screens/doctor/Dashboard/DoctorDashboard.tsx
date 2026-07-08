import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader, Shimmer } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { countTodayDoctorAppointments } from '@/services/appointmentService';
import { resolveDoctorId } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { formatErrorMessage } from '@/utils/formatError';

const DoctorDashboard = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [todayCount, setTodayCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            let active = true;

            const load = async () => {
                // Only show spinner on the first load; subsequent focus refreshes are silent.
                if (!hasFetchedRef.current) setLoading(true);
                try {
                    const doctorId = await resolveDoctorId(user);
                    if (!doctorId) {
                        if (active) setTodayCount(0);
                        return;
                    }

                    const count = await countTodayDoctorAppointments(doctorId);
                    if (active) setTodayCount(count);
                } catch (e: unknown) {
                    Toast.show({ type: 'error', text1: 'Failed to load dashboard', text2: formatErrorMessage(e) });
                } finally {
                    if (active) {
                        setLoading(false);
                        hasFetchedRef.current = true;
                    }
                }
            };

            void load();
            return () => {
                active = false;
            };
        }, [user.id, user.doctor_id, user.doctor?.id]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader
                title={`Dr. ${user.full_name?.split(' ').slice(-1)[0] ?? ''}`}
                subtitle={user.doctor?.specialization ?? 'Doctor'}
            />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <>
                        <View style={healthScreenStyles.card}>
                            <Shimmer shimmerColors={['#F1F5F9', '#FFFFFF', '#F1F5F9']} style={{ width: '50%', height: 36, borderRadius: 8 }} />
                            <Shimmer shimmerColors={['#F1F5F9', '#FFFFFF', '#F1F5F9']} style={{ width: '70%', height: 14, borderRadius: 6, marginTop: 10 }} />
                        </View>
                        <View style={healthScreenStyles.card}>
                            <Shimmer shimmerColors={['#F1F5F9', '#FFFFFF', '#F1F5F9']} style={{ width: '40%', height: 20, borderRadius: 8 }} />
                            <Shimmer shimmerColors={['#F1F5F9', '#FFFFFF', '#F1F5F9']} style={{ width: '60%', height: 14, borderRadius: 6, marginTop: 8 }} />
                        </View>
                    </>
                ) : (
                    <View style={healthScreenStyles.card}>
                        <TextComp text="Today's Appointments" style={healthScreenStyles.cardTitle} />
                        <TextComp text={String(todayCount)} style={{ fontSize: 36, fontWeight: '700', color: '#0B7285' }} />
                    </View>
                )}
                {!loading && (
                    <View style={healthScreenStyles.card}>
                        <TextComp text="Status" style={healthScreenStyles.cardTitle} />
                        <TextComp text={user.doctor?.status ?? 'APPROVED'} style={healthScreenStyles.cardMeta} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorDashboard;
