import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { clearDataAction } from '@/redux/actions/auth';
import { updatePatient } from '@/services/patientService';
import { updateUser } from '@/services/userService';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const PatientProfile = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const patient = user.patient;
    const [phone, setPhone] = useState(user.phone ?? '');
    const [address, setAddress] = useState(patient?.address ?? '');
    const [allergies, setAllergies] = useState(patient?.allergies ?? '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUser(user.id, { phone });
            if (user.patient_id) {
                await updatePatient(user.patient_id, { address, allergies });
            }
            await syncAuthFromSupabase();
            Toast.show({ type: 'success', text1: 'Profile updated' });
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Update failed', text2: String(e) });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={healthScreenStyles.screen}>
            <HealthScreenHeader title="Profile" subtitle={user.email} />
            <ScrollView contentContainerStyle={[healthScreenStyles.body, healthScreenStyles.scrollContent]}>
                <View style={healthScreenStyles.card}>
                    <TextComp text={user.full_name} style={healthScreenStyles.cardTitle} />
                    <TextComp text="Patient" style={healthScreenStyles.cardMeta} />
                </View>
                <TextComp text="Phone" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={phone} onChangeText={setPhone} />
                <TextComp text="Address" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={address} onChangeText={setAddress} />
                <TextComp text="Allergies" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={allergies} onChangeText={setAllergies} />
                <Pressable style={healthScreenStyles.primaryBtn} onPress={handleSave} disabled={saving}>
                    <TextComp text={saving ? 'Saving...' : 'Save Changes'} style={healthScreenStyles.primaryBtnText} />
                </Pressable>
                <Pressable style={healthScreenStyles.secondaryBtn} onPress={() => clearDataAction()}>
                    <TextComp text="Sign Out" style={healthScreenStyles.secondaryBtnText} />
                </Pressable>
            </ScrollView>
        </View>
    );
};

export default PatientProfile;
