import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { listHospitals } from '@/services/hospitalService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Hospital } from '@/types/database';

const PatientExplore = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            listHospitals()
                .then(setHospitals)
                .finally(() => setLoading(false));
        }, []),
    );

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Explore" subtitle="Browse hospitals and specialists" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : hospitals.length === 0 ? (
                    <EmptyState title="No hospitals found" />
                ) : (
                    hospitals.map((h) => (
                        <Pressable
                            key={h.id}
                            style={healthScreenStyles.card}
                            onPress={() =>
                                navigation.navigate(routes.patient.hospitalDepartments, {
                                    hospitalId: h.id,
                                    hospitalName: h.name,
                                })
                            }
                        >
                            <TextComp text={h.name} style={healthScreenStyles.cardTitle} />
                            <TextComp text={h.address ?? ''} style={healthScreenStyles.cardMeta} />
                            {h.description ? (
                                <TextComp text={h.description} style={healthScreenStyles.cardMeta} numberOfLines={2} />
                            ) : null}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default PatientExplore;
