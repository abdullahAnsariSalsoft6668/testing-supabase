import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createDepartment, listHospitals, updateDepartment } from '@/services/hospitalService';
import { getSupabase } from '@/utils/supabase';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { formatErrorMessage } from '@/utils/formatError';
import type { Hospital } from '@/types/database';

const DepartmentForm = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'DepartmentForm'>>();
    const navigation = useNavigation();
    const { departmentId, hospitalId: initialHospitalId } = route.params ?? {};
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [hospitalId, setHospitalId] = useState(initialHospitalId ?? '');
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        listHospitals().then(setHospitals);
        if (departmentId) {
            getSupabase()
                .from('departments')
                .select('*')
                .eq('id', departmentId)
                .single()
                .then(({ data }) => {
                    if (data) {
                        setName(data.name);
                        setDescription(data.description ?? '');
                        setHospitalId(data.hospital_id);
                    }
                });
        }
    }, [departmentId]);

    const handleSave = async () => {
        if (!hospitalId) {
            Toast.show({ type: 'error', text1: 'Select a hospital' });
            return;
        }
        setSaving(true);
        try {
            if (departmentId) {
                await updateDepartment(departmentId, { name, description, hospital_id: hospitalId });
            } else {
                await createDepartment({ hospital_id: hospitalId, name, description });
            }
            Toast.show({ type: 'success', text1: 'Saved' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Save failed', text2: formatErrorMessage(e) });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title={departmentId ? 'Edit Department' : 'New Department'} subtitle="">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <TextComp text="Hospital ID" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={hospitalId} onChangeText={setHospitalId} placeholder="Paste hospital UUID" />
                {hospitals.length > 0 ? (
                    <TextComp text={`Available: ${hospitals.map((h) => h.name).join(', ')}`} style={healthScreenStyles.cardMeta} />
                ) : null}
                <TextComp text="Name" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={name} onChangeText={setName} />
                <TextComp text="Description" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={description} onChangeText={setDescription} />
                <Pressable style={healthScreenStyles.primaryBtn} onPress={handleSave} disabled={saving}>
                    <TextComp text={saving ? 'Saving...' : 'Save'} style={healthScreenStyles.primaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default DepartmentForm;
