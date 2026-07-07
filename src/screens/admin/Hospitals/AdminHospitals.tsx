import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteHospital, listHospitals } from '@/services/hospitalService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Hospital } from '@/types/database';
import Toast from 'react-native-toast-message';

const AdminHospitals = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        listHospitals()
            .then(setHospitals)
            .finally(() => setLoading(false));
    };

    useFocusEffect(useCallback(() => { load(); }, []));

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Hospitals" subtitle="Manage facilities" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <Pressable
                    style={healthScreenStyles.primaryBtn}
                    onPress={() => navigation.navigate(routes.admin.hospitalForm, {})}
                >
                    <TextComp text="Add Hospital" style={healthScreenStyles.primaryBtnText} />
                </Pressable>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : hospitals.length === 0 ? (
                    <EmptyState title="No hospitals" />
                ) : (
                    hospitals.map((h) => (
                        <Pressable
                            key={h.id}
                            style={healthScreenStyles.card}
                            onPress={() => navigation.navigate(routes.admin.hospitalForm, { hospitalId: h.id })}
                        >
                            <TextComp text={h.name} style={healthScreenStyles.cardTitle} />
                            <TextComp text={h.address ?? ''} style={healthScreenStyles.cardMeta} />
                            <Pressable
                                style={healthScreenStyles.secondaryBtn}
                                onPress={async () => {
                                    await deleteHospital(h.id);
                                    Toast.show({ type: 'success', text1: 'Deleted' });
                                    load();
                                }}
                            >
                                <TextComp text="Delete" style={healthScreenStyles.secondaryBtnText} />
                            </Pressable>
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default AdminHospitals;
