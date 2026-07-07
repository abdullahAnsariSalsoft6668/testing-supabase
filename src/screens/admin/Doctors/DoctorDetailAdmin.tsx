import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { getDoctorById, updateDoctorStatus } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor } from '@/types/database';
import Toast from 'react-native-toast-message';

const DoctorDetailAdmin = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'DoctorDetailAdmin'>>();
    const navigation = useNavigation();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDoctorById(route.params.doctorId)
            .then(setDoctor)
            .finally(() => setLoading(false));
    }, [route.params.doctorId]);

    const setStatus = async (status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        try {
            await updateDoctorStatus(route.params.doctorId, status);
            Toast.show({ type: 'success', text1: `Status: ${status}` });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed', text2: String(e) });
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Doctor Details" subtitle="">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading || !doctor ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : (
                    <View style={healthScreenStyles.card}>
                        <TextComp text={getUserDisplayName(doctor.users, '')} style={healthScreenStyles.cardTitle} />
                        <TextComp text={doctor.specialization} style={healthScreenStyles.cardMeta} />
                        <TextComp text={doctor.qualification ?? ''} style={healthScreenStyles.cardMeta} />
                        <TextComp text={doctor.license_number ?? ''} style={healthScreenStyles.cardMeta} />
                        <StatusBadge status={doctor.status} type="doctor" />
                        <Pressable style={healthScreenStyles.primaryBtn} onPress={() => setStatus('APPROVED')}>
                            <TextComp text="Approve" style={healthScreenStyles.primaryBtnText} />
                        </Pressable>
                        <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => setStatus('REJECTED')}>
                            <TextComp text="Reject" style={healthScreenStyles.secondaryBtnText} />
                        </Pressable>
                        <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => setStatus('SUSPENDED')}>
                            <TextComp text="Suspend" style={healthScreenStyles.secondaryBtnText} />
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default DoctorDetailAdmin;
