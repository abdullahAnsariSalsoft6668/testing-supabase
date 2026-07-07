import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { countTodayDoctorAppointments } from '@/services/appointmentService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const DoctorDashboard = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [todayCount, setTodayCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user.doctor_id) {
                setLoading(false);
                return;
            }
            countTodayDoctorAppointments(user.doctor_id)
                .then(setTodayCount)
                .finally(() => setLoading(false));
        }, [user.doctor_id]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader
                title={`Dr. ${user.full_name?.split(' ').slice(-1)[0] ?? ''}`}
                subtitle={user.doctor?.specialization ?? 'Doctor'}
            />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <View style={healthScreenStyles.card}>
                        <TextComp text="Today's Appointments" style={healthScreenStyles.cardTitle} />
                        <TextComp text={String(todayCount)} style={{ fontSize: 36, fontWeight: '700', color: '#0B7285' }} />
                    </View>
                )}
                <View style={healthScreenStyles.card}>
                    <TextComp text="Status" style={healthScreenStyles.cardTitle} />
                    <TextComp text={user.doctor?.status ?? 'APPROVED'} style={healthScreenStyles.cardMeta} />
                </View>
            </ScrollView>
        </View>
    );
};

export default DoctorDashboard;
