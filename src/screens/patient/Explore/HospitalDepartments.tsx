import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { listDepartments } from '@/services/hospitalService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Department } from '@/types/database';

const HospitalDepartments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const route = useRoute<RouteProp<PatientStackParamList, 'HospitalDepartments'>>();
    const { hospitalId, hospitalName } = route.params;
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            listDepartments(hospitalId)
                .then(setDepartments)
                .finally(() => setLoading(false));
        }, [hospitalId]),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title={hospitalName} subtitle="Select a department">
                <Pressable onPress={() => navigation.goBack()} style={healthScreenStyles.backBtn}>
                    <TextComp text="← Back" style={healthScreenStyles.backText} />
                </Pressable>
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : departments.length === 0 ? (
                    <EmptyState title="No departments" />
                ) : (
                    departments.map((d) => (
                        <Pressable
                            key={d.id}
                            style={healthScreenStyles.card}
                            onPress={() =>
                                navigation.navigate(routes.patient.departmentDoctors, {
                                    departmentId: d.id,
                                    departmentName: d.name,
                                    hospitalId,
                                })
                            }
                        >
                            <TextComp text={d.name} style={healthScreenStyles.cardTitle} />
                            {d.description ? (
                                <TextComp text={d.description} style={healthScreenStyles.cardMeta} />
                            ) : null}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default HospitalDepartments;
