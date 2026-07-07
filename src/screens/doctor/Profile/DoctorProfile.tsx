import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { clearDataAction, syncAuthFromSupabase } from '@/redux/actions/auth';
import { updateDoctor } from '@/services/doctorService';
import { updateUser } from '@/services/userService';
import { healthScreenStyles } from '@/styles/healthScreenStyles';

const DoctorProfile = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const doctor = user.doctor;
    const [specialization, setSpecialization] = useState(doctor?.specialization ?? '');
    const [bio, setBio] = useState(doctor?.bio ?? '');
    const [fee, setFee] = useState(String(doctor?.consultation_fee ?? ''));
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user.doctor_id) return;
        setSaving(true);
        try {
            await updateDoctor(user.doctor_id, {
                specialization,
                bio,
                consultation_fee: fee ? Number(fee) : null,
            });
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
                <TextComp text="Specialization" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={specialization} onChangeText={setSpecialization} />
                <TextComp text="Bio" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={bio} onChangeText={setBio} multiline />
                <TextComp text="Consultation Fee" style={healthScreenStyles.label} />
                <TextInput style={healthScreenStyles.input} value={fee} onChangeText={setFee} keyboardType="numeric" />
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

export default DoctorProfile;
