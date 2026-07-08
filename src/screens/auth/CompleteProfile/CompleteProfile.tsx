import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import Toast from 'react-native-toast-message';

import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { listDepartments, listHospitals } from '@/services/hospitalService';
import { createDoctor, getDoctorByUserId } from '@/services/doctorService';
import { BLOOD_GROUPS, createPatient, getPatientByUserId, GENDERS } from '@/services/patientService';
import type { BloodGroup, Department, Gender, Hospital } from '@/types/database';
import { getUserDisplayName } from '@/utils/userDisplay';
import { formatErrorMessage } from '@/utils/formatError';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthDatePicker from '../shared/AuthDatePicker';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';
import ProfileOptionPicker from './ProfileOptionPicker';
import styles from './styles';

const todayIso = new Date().toISOString().split('T')[0];
const minDobIso = `${new Date().getFullYear() - 120}-01-01`;

const CompleteProfile: React.FC = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const isDoctor = user?.role === 'DOCTOR' || Boolean(user?.doctor_id);
    const [isLoading, setIsLoading] = useState(false);

    const [gender, setGender] = useState<Gender>('MALE');
    const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [allergies, setAllergies] = useState('');

    const [specialization, setSpecialization] = useState('');
    const [qualification, setQualification] = useState('');
    const [experience, setExperience] = useState('0');
    const [fee, setFee] = useState('');
    const [bio, setBio] = useState('');
    const [license, setLicense] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const displayName = useMemo(() => getUserDisplayName(user, 'there'), [user]);

    React.useEffect(() => {
        void syncAuthFromSupabase();
    }, []);

    React.useEffect(() => {
        listHospitals().then((h) => {
            setHospitals(h);
            if (h[0]) setHospitalId(h[0].id);
        });
    }, []);

    React.useEffect(() => {
        if (!hospitalId) {
            setDepartments([]);
            setDepartmentId('');
            return;
        }
        listDepartments(hospitalId).then((d) => {
            setDepartments(d);
            setDepartmentId(d[0]?.id ?? '');
        });
    }, [hospitalId]);

    const handleFinishSetup = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            if (isDoctor) {
                const existing = await getDoctorByUserId(user.id);
                if (existing) {
                    await syncAuthFromSupabase();
                    Toast.show({ type: 'success', text1: 'Doctor profile already submitted' });
                    return;
                }
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
                const existing = await getPatientByUserId(user.id);
                if (existing) {
                    await syncAuthFromSupabase();
                    Toast.show({ type: 'success', text1: 'Patient profile already completed' });
                    return;
                }
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

    const renderIntro = () => (
        <AuthStaggerItem index={0}>
            <View style={styles.introCard}>
                <View style={styles.roleBadge}>
                    <TextComp text={isDoctor ? 'DOCTOR' : 'PATIENT'} style={styles.roleBadgeText} />
                </View>
                <TextComp text={`Welcome, ${displayName}`} style={styles.introTitle} />
                <TextComp
                    text={
                        isDoctor
                            ? 'Add your credentials so our team can verify and approve your account.'
                            : 'A few details help us personalize appointments, records, and emergency contact info.'
                    }
                    style={styles.introMeta}
                />
            </View>
        </AuthStaggerItem>
    );

    const renderPatientForm = () => (
        <>
            {renderIntro()}
            <AuthStaggerItem index={1}>
                <TextComp text="Personal details" style={styles.sectionLabel} />
                <TextComp text="Used for your medical records and visit history." style={styles.sectionHint} />
            </AuthStaggerItem>
            <AuthDatePicker
                index={2}
                label="Date of Birth"
                value={dob}
                onChange={setDob}
                maxDate={todayIso}
                minDate={minDobIso}
                placeholder="Tap to open calendar"
            />
            <AuthTextInput
                index={3}
                label="Address"
                placeholder="Street, city, postal code"
                value={address}
                onChangeText={setAddress}
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <View style={styles.sectionDivider} />
            <AuthStaggerItem index={4}>
                <TextComp text="Health information" style={styles.sectionLabel} />
            </AuthStaggerItem>
            <ProfileOptionPicker index={5} label="Gender" options={GENDERS} value={gender} onChange={setGender} />
            <ProfileOptionPicker
                index={6}
                label="Blood Group"
                options={BLOOD_GROUPS}
                value={bloodGroup}
                onChange={setBloodGroup}
                columns={4}
            />
            <View style={styles.sectionDivider} />
            <AuthStaggerItem index={7}>
                <TextComp text="Emergency contact" style={styles.sectionLabel} />
                <TextComp text="Someone we can reach if needed during a visit." style={styles.sectionHint} />
            </AuthStaggerItem>
            <AuthTextInput
                index={8}
                label="Contact Name"
                placeholder="Full name"
                value={emergencyName}
                onChangeText={setEmergencyName}
                autoCapitalize="words"
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={9}
                label="Contact Phone"
                placeholder="+1 555 000 0000"
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                keyboardType="phone-pad"
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={10}
                label="Known Allergies"
                placeholder="e.g. Penicillin, peanuts (optional)"
                value={allergies}
                onChangeText={setAllergies}
                multiline
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={{ ...authStyles.inputField, height: undefined, minHeight: 88, paddingVertical: 12 }}
            />
            <AuthStaggerItem index={11}>
                <AuthYellowButton
                    title="Finish Setup"
                    onPress={handleFinishSetup}
                    loading={isLoading}
                    disabled={isLoading}
                    style={authStyles.actionButton}
                />
            </AuthStaggerItem>
        </>
    );

    const renderDoctorForm = () => (
        <>
            {renderIntro()}
            <AuthStaggerItem index={1}>
                <TextComp text="Professional details" style={styles.sectionLabel} />
                <TextComp text="Required for admin review before you can manage your schedule." style={styles.sectionHint} />
            </AuthStaggerItem>
            <AuthTextInput
                index={2}
                label="Specialization"
                required
                placeholder="e.g. Cardiology, Pediatrics"
                value={specialization}
                onChangeText={setSpecialization}
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={3}
                label="Qualification"
                placeholder="e.g. MBBS, MD"
                value={qualification}
                onChangeText={setQualification}
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={4}
                label="License Number"
                placeholder="Medical license ID"
                value={license}
                onChangeText={setLicense}
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={5}
                label="Experience (years)"
                placeholder="0"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={6}
                label="Consultation Fee"
                placeholder="Optional"
                value={fee}
                onChangeText={setFee}
                keyboardType="numeric"
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={authStyles.inputField}
            />
            <AuthTextInput
                index={7}
                label="Bio"
                placeholder="Short introduction for patients"
                value={bio}
                onChangeText={setBio}
                multiline
                containerStyle={authStyles.inputContainer}
                labelStyle={authStyles.inputLabel}
                inputContainerStyle={{ ...authStyles.inputField, height: undefined, minHeight: 96, paddingVertical: 12 }}
            />
            {hospitals.length > 0 ? (
                <>
                    <View style={styles.sectionDivider} />
                    <AuthStaggerItem index={8}>
                        <TextComp text="Hospital affiliation" style={styles.sectionLabel} />
                        <TextComp text="Where do you primarily practice?" style={styles.sectionHint} />
                        <View style={styles.chipRow}>
                            {hospitals.map((h) => {
                                const selected = hospitalId === h.id;
                                return (
                                    <Pressable
                                        key={h.id}
                                        style={[styles.listChip, selected && styles.listChipSelected]}
                                        onPress={() => setHospitalId(h.id)}
                                    >
                                        <TextComp
                                            text={h.name}
                                            style={[styles.listChipText, selected && styles.listChipTextSelected]}
                                        />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </AuthStaggerItem>
                    {departments.length > 0 ? (
                        <AuthStaggerItem index={9}>
                            <TextComp text="Department" style={styles.sectionLabel} />
                            <View style={styles.chipRow}>
                                {departments.map((d) => {
                                    const selected = departmentId === d.id;
                                    return (
                                        <Pressable
                                            key={d.id}
                                            style={[styles.listChip, selected && styles.listChipSelected]}
                                            onPress={() => setDepartmentId(d.id)}
                                        >
                                            <TextComp
                                                text={d.name}
                                                style={[styles.listChipText, selected && styles.listChipTextSelected]}
                                            />
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </AuthStaggerItem>
                    ) : null}
                </>
            ) : null}
            <AuthStaggerItem index={hospitals.length > 0 ? 10 : 8}>
                <AuthYellowButton
                    title="Submit for Approval"
                    onPress={handleFinishSetup}
                    loading={isLoading}
                    disabled={isLoading}
                    style={authStyles.actionButton}
                />
            </AuthStaggerItem>
        </>
    );

    return (
        <AuthScreenLayout
            title="Complete Profile"
            subtitle={isDoctor ? 'Tell us about your medical practice.' : 'Help us personalize your care.'}
            cardStyle={styles.cardContainerTall}
            footerStaggerIndex={12}
        >
            {isDoctor ? renderDoctorForm() : renderPatientForm()}
        </AuthScreenLayout>
    );
};

export default CompleteProfile;
