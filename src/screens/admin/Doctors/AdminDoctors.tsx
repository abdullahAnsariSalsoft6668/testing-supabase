import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { listDoctorsByStatus, updateDoctorStatus } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor } from '@/types/database';
import Toast from 'react-native-toast-message';

const AdminDoctors = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const load = () => {
        setLoading(true);
        listDoctorsByStatus(filter)
            .then(setDoctors)
            .finally(() => setLoading(false));
    };

    useFocusEffect(useCallback(() => { load(); }, [filter]));

    const setStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        try {
            await updateDoctorStatus(id, status);
            Toast.show({ type: 'success', text1: `Doctor ${status}` });
            load();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed', text2: String(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Doctors" subtitle="Review and approve" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                    {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
                        <Pressable
                            key={s}
                            style={[healthScreenStyles.secondaryBtn, filter === s && { backgroundColor: '#E6FCF5' }]}
                            onPress={() => setFilter(s)}
                        >
                            <TextComp text={s} style={healthScreenStyles.secondaryBtnText} />
                        </Pressable>
                    ))}
                </View>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : doctors.length === 0 ? (
                    <EmptyState title={`No ${filter.toLowerCase()} doctors`} />
                ) : (
                    doctors.map((d) => (
                        <Pressable
                            key={d.id}
                            style={healthScreenStyles.card}
                            onPress={() => navigation.navigate(routes.admin.doctorDetailAdmin, { doctorId: d.id })}
                        >
                            <TextComp text={getUserDisplayName(d.users, 'Doctor')} style={healthScreenStyles.cardTitle} />
                            <TextComp text={d.specialization} style={healthScreenStyles.cardMeta} />
                            <StatusBadge status={d.status} type="doctor" />
                            {d.status === 'PENDING' ? (
                                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                                    <Pressable style={healthScreenStyles.primaryBtn} onPress={() => setStatus(d.id, 'APPROVED')}>
                                        <TextComp text="Approve" style={healthScreenStyles.primaryBtnText} />
                                    </Pressable>
                                    <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => setStatus(d.id, 'REJECTED')}>
                                        <TextComp text="Reject" style={healthScreenStyles.secondaryBtnText} />
                                    </Pressable>
                                </View>
                            ) : null}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default AdminDoctors;
