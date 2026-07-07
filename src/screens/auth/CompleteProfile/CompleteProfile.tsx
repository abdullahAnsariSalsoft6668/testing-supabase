import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { listDepartments, listHospitals } from '@/services/hospitalService';
import { createDoctor } from '@/services/doctorService';
import { BLOOD_GROUPS, createPatient, GENDERS } from '@/services/patientService';
import type { BloodGroup, Gender } from '@/types/database';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';
import styles from './styles';
import { healthScreenStyles } from '@/styles/healthScreenStyles';
import { formatErrorMessage } from '@/utils/formatError';

const CompleteProfile: React.FC = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const isDoctor = user?.role === 'DOCTOR';
    const [isLoading, setIsLoading] = useState(false);

    // Patient fields
    const [gender, setGender] = useState<Gender>('MALE');
    const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [allergies, setAllergies] = useState('');

    // Doctor fields
    const [specialization, setSpecialization] = useState('');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('0');
    const [fee, setFee] = useState('');
    const [bio, setBio] = useState('');
    const [license, setLicense] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    React.useEffect(() => {
        listHospitals().then((h) => {
            if (h[0]) setHospitalId(h[0].id);
        });
    }, []);

    React.useEffect(() => {
        if (hospitalId) {
            listDepartments(hospitalId).then((d) => {
                if (d[0]) setDepartmentId(d[0].id);
            });
        }
    }, [hospitalId]);

    const handleFinishSetup = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            if (isDoctor) {
                if (!specialization.trim()) {
                    Toast.show({ type: 'error', text1: 'Specialization is required' });
                    return;
                }
                await createDoctor(user.id, {
                    specialization: specialization.trim(),
                    qualification: qualification.trim() || undefined,
                    experience: Number(experience) || 0,
                    consultation_fee: fee ? Number(fee) : undefined,
                    bio: bio.trim() || undefined,
                    license_number: license.trim() || undefined,
                    hospital_id: hospitalId || undefined,
                    department_id: departmentId || undefined,
                });
            } else {
                await createPatient(user.id, {
                    gender,
                    blood_group: bloodGroup,
                    dob: dob || null,
                    address: address.trim() || null,
                    emergency_contact_name: emergencyName.trim() || null,
                    emergency_contact_phone: emergencyPhone.trim() || null,
                    allergies: allergies.trim() || null,
                });
            }
            await syncAuthFromSupabase();
            Toast.show({ type: 'success', text1: 'Profile completed' });
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Setup failed', text2: formatErrorMessage(e) });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthScreenLayout
            title="Complete Profile"
            subtitle={isDoctor ? 'Tell us about your medical practice.' : 'Help us personalize your care.'}
            cardStyle={styles.cardContainerTall}
            footerStaggerIndex={2}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {isDoctor ? (
                    <>
                        <TextComp text="Specialization *" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={specialization} onChangeText={setSpecialization} />
                        <TextComp text="Qualification" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={qualification} onChangeText={setQualification} />
                        <TextComp text="License Number" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={license} onChangeText={setLicense} />
                        <TextComp text="Experience (years)" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={experience} onChangeText={setExperience} keyboardType="numeric" />
                        <TextComp text="Consultation Fee" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={fee} onChangeText={setFee} keyboardType="numeric" />
                        <TextComp text="Bio" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={bio} onChangeText={setBio} multiline />
                    </>
                ) : (
                    <>
                        <TextComp text="Date of Birth (YYYY-MM-DD)" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={dob} onChangeText={setDob} />
                        <TextComp text="Address" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={address} onChangeText={setAddress} />
                        <TextComp text="Gender" style={healthScreenStyles.label} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                            {GENDERS.map((g) => (
                                <Pressable key={g} onPress={() => setGender(g)} style={healthScreenStyles.secondaryBtn}>
                                    <TextComp text={g} style={healthScreenStyles.secondaryBtnText} />
                                </Pressable>
                            ))}
                        </View>
                        <TextComp text="Blood Group" style={healthScreenStyles.label} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                            {BLOOD_GROUPS.map((b) => (
                                <Pressable key={b} onPress={() => setBloodGroup(b)} style={healthScreenStyles.secondaryBtn}>
                                    <TextComp text={b} style={healthScreenStyles.secondaryBtnText} />
                                </Pressable>
                            ))}
                        </View>
                        <TextComp text="Emergency Contact Name" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={emergencyName} onChangeText={setEmergencyName} />
                        <TextComp text="Emergency Contact Phone" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={emergencyPhone} onChangeText={setEmergencyPhone} />
                        <TextComp text="Allergies" style={healthScreenStyles.label} />
                        <TextInput style={healthScreenStyles.input} value={allergies} onChangeText={setAllergies} />
                    </>
                )}
                <AuthStaggerItem index={1}>
                    <AuthYellowButton
                        title="Finish Setup"
                        onPress={handleFinishSetup}
                        loading={isLoading}
                        disabled={isLoading}
                        style={authStyles.actionButton}
                    />
                </AuthStaggerItem>
            </ScrollView>
        </AuthScreenLayout>
    );
};

export default CompleteProfile;
