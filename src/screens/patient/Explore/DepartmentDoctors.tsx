import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DoctorCard, EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { listApprovedDoctors } from '@/services/doctorService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Doctor } from '@/types/database';

const DepartmentDoctors = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const route = useRoute<RouteProp<PatientStackParamList, 'DepartmentDoctors'>>();
    const { departmentId, departmentName, hospitalId } = route.params;
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            listApprovedDoctors({ hospitalId, departmentId })
                .then(setDoctors)
                .finally(() => setLoading(false));
        }, [hospitalId, departmentId]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title={departmentName} subtitle="Available doctors">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : doctors.length === 0 ? (
                    <EmptyState title="No doctors available" />
                ) : (
                    doctors.map((d) => (
                        <DoctorCard
                            key={d.id}
                            doctor={d}
                            onPress={() => navigation.navigate(routes.patient.doctorDetail, { doctorId: d.id })}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default DepartmentDoctors;
