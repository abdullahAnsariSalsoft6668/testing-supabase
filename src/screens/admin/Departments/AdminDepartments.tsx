import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { EmptyState, HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteDepartment, listDepartments } from '@/services/hospitalService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import type { Department } from '@/types/database';
import Toast from 'react-native-toast-message';

const AdminDepartments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        listDepartments()
            .then(setDepartments)
            .finally(() => setLoading(false));
    };

    useFocusEffect(useCallback(() => { load(); }, []));

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Departments" subtitle="All hospital departments" />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <Pressable
                    style={healthScreenStyles.primaryBtn}
                    onPress={() => navigation.navigate(routes.admin.departmentForm, {})}
                >
                    <TextComp text="Add Department" style={healthScreenStyles.primaryBtnText} />
                </Pressable>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} />
                ) : departments.length === 0 ? (
                    <EmptyState title="No departments" />
                ) : (
                    departments.map((d) => (
                        <View key={d.id} style={healthScreenStyles.card}>
                            <TextComp text={d.name} style={healthScreenStyles.cardTitle} />
                            <TextComp text={d.hospitals?.name ?? ''} style={healthScreenStyles.cardMeta} />
                            <Pressable
                                style={healthScreenStyles.secondaryBtn}
                                onPress={() =>
                                    navigation.navigate(routes.admin.departmentForm, {
                                        departmentId: d.id,
                                        hospitalId: d.hospital_id,
                                    })
                                }
                            >
                                <TextComp text="Edit" style={healthScreenStyles.secondaryBtnText} />
                            </Pressable>
                            <Pressable
                                style={healthScreenStyles.secondaryBtn}
                                onPress={async () => {
                                    await deleteDepartment(d.id);
                                    Toast.show({ type: 'success', text1: 'Deleted' });
                                    load();
                                }}
                            >
                                <TextComp text="Delete" style={healthScreenStyles.secondaryBtnText} />
                            </Pressable>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default AdminDepartments;
