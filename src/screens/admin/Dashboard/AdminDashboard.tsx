import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import { listDoctorsByStatus } from '@/services/doctorService';
import { listHospitals } from '@/services/hospitalService';
import { getSupabase } from '@/utils/supabase';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ hospitals: 0, pendingDoctors: 0, todayAppts: 0 });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const today = new Date().toISOString().split('T')[0];
            Promise.all([
                listHospitals(),
                listDoctorsByStatus('PENDING'),
                getSupabase()
                    .from('appointments')
                    .select('*', { count: 'exact', head: true })
                    .eq('appointment_date', today),
            ])
                .then(([hospitals, pending, appts]) => {
                    setStats({
                        hospitals: hospitals.length,
                        pendingDoctors: pending.length,
                        todayAppts: appts.count ?? 0,
                    });
                })
                .finally(() => setLoading(false));
        }, []),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Admin Dashboard" subtitle="Hospital management overview" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <>
                        <View style={healthScreenStyles.card}>
                            <TextComp text="Hospitals" style={healthScreenStyles.cardTitle} />
                            <TextComp text={String(stats.hospitals)} style={healthScreenStyles.cardMeta} />
                        </View>
                        <View style={healthScreenStyles.card}>
                            <TextComp text="Pending Doctors" style={healthScreenStyles.cardTitle} />
                            <TextComp text={String(stats.pendingDoctors)} style={healthScreenStyles.cardMeta} />
                        </View>
                        <View style={healthScreenStyles.card}>
                            <TextComp text="Today's Appointments" style={healthScreenStyles.cardTitle} />
                            <TextComp text={String(stats.todayAppts)} style={healthScreenStyles.cardMeta} />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default AdminDashboard;
