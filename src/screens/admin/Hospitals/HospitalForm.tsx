import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createHospital, getHospital, updateHospital } from '@/services/hospitalService';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { formatErrorMessage } from '@/utils/formatError';

const HospitalForm = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'HospitalForm'>>();
    const navigation = useNavigation();
    const hospitalId = route.params?.hospitalId;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            getHospital(hospitalId).then((h) => {
                setName(h.name);
                setEmail(h.email ?? '');
                setPhone(h.phone ?? '');
                setAddress(h.address ?? '');
                setDescription(h.description ?? '');
            });
        }
    }, [hospitalId]);

    const handleSave = async () => {
        if (!name.trim()) {
            Toast.show({ type: 'error', text1: 'Hospital name is required' });
            return;
        }
        setSaving(true);
        try {
            await syncAuthFromSupabase();
            const payload = {
                name: name.trim(),
                email: email.trim() || null,
                phone: phone.trim() || null,
                address: address.trim() || null,
                description: description.trim() || null,
                logo_url: null,
            };
            if (hospitalId) {
                await updateHospital(hospitalId, payload);
            } else {
                await createHospital(payload);
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
            <HealthScreenHeader title={hospitalId ? 'Edit Hospital' : 'New Hospital'} subtitle="">
                <TextComp text="← Back" style={healthScreenStyles.backText} onPress={() => navigation.goBack()} />
            </HealthScreenHeader>
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                {(['name', 'email', 'phone', 'address', 'description'] as const).map((field) => {
                    const values = { name, email, phone, address, description };
                    const setters = { name: setName, email: setEmail, phone: setPhone, address: setAddress, description: setDescription };
                    return (
                        <View key={field}>
                            <TextComp text={field.charAt(0).toUpperCase() + field.slice(1)} style={healthScreenStyles.label} />
                            <TextInput
                                style={healthScreenStyles.input}
                                value={values[field]}
                                onChangeText={setters[field]}
                            />
                        </View>
                    );
                })}
                <Pressable style={healthScreenStyles.primaryBtn} onPress={handleSave} disabled={saving}>
                    <TextComp text={saving ? 'Saving...' : 'Save'} style={healthScreenStyles.primaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default HospitalForm;
