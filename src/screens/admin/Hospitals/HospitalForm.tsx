import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { FormSkeleton, HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createHospital, getHospital, updateHospital } from '@/services/hospitalService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { theme } from '@/styles/theme';
import { formatErrorMessage } from '@/utils/formatError';

type FieldConfig = {
    key: 'name' | 'email' | 'phone' | 'address' | 'description';
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    multiline?: boolean;
};

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
    const [loadingData, setLoadingData] = useState(!!hospitalId);

    useEffect(() => {
        if (hospitalId) {
            getHospital(hospitalId)
                .then((h) => {
                    setName(h.name);
                    setEmail(h.email ?? '');
                    setPhone(h.phone ?? '');
                    setAddress(h.address ?? '');
                    setDescription(h.description ?? '');
                })
                .finally(() => setLoadingData(false));
        }
    }, [hospitalId]);

    const handleSave = async () => {
        if (!name.trim()) {
            Toast.show({ type: 'error', text1: 'Hospital name is required' });
            return;
        }
        setSaving(true);
        try {
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
            Toast.show({ type: 'success', text1: hospitalId ? 'Hospital updated' : 'Hospital created' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Save failed', text2: formatErrorMessage(e) });
        } finally {
            setSaving(false);
        }
    };

    const fields: FieldConfig[] = [
        { key: 'name', label: 'Hospital Name', placeholder: 'e.g. City General Hospital', icon: <MyIcons name="healthTabHospital" size={18} stroke={theme.palette.teal.main} /> },
        { key: 'email', label: 'Email', placeholder: 'contact@hospital.com', icon: <MyIcons name="emailIcon" size={18} stroke={theme.palette.teal.main} />, keyboardType: 'email-address' },
        { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', icon: <MyIcons name="phoneIcon" size={18} stroke={theme.palette.teal.main} />, keyboardType: 'phone-pad' },
        { key: 'address', label: 'Address', placeholder: '123 Medical Ave, City', icon: <MyIcons name="locationIcon" size={18} stroke={theme.palette.teal.main} /> },
        { key: 'description', label: 'Description (optional)', placeholder: 'Brief overview of the hospital', icon: <MyIcons name="documentIcon" size={18} stroke={theme.palette.teal.main} />, multiline: true },
    ];

    const values = { name, email, phone, address, description };
    const setters = { name: setName, email: setEmail, phone: setPhone, address: setAddress, description: setDescription };

    return (
        <View style={s.screen}>
            <HealthScreenHeader
                title={hospitalId ? 'Edit Hospital' : 'New Hospital'}
                subtitle={hospitalId ? 'Update facility details' : 'Register a new healthcare facility'}
                onBack={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={s.bodyForm} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                {loadingData ? (
                    <FormSkeleton fields={5} />
                ) : (
                    <>
                        <View style={s.formCard}>
                            {fields.map((field, idx) => (
                                <View key={field.key}>
                                    {idx > 0 ? <View style={s.fieldDivider} /> : null}
                                    <View style={s.fieldRow}>
                                        <View style={s.infoIconWrap}>{field.icon}</View>
                                        <View style={{ flex: 1 }}>
                                            <TextComp text={field.label} style={s.fieldLabel} />
                                            <TextInput
                                                style={[s.input, field.multiline && s.multilineInput]}
                                                value={values[field.key]}
                                                onChangeText={setters[field.key]}
                                                placeholder={field.placeholder}
                                                placeholderTextColor={theme.colors.text.muted}
                                                keyboardType={field.keyboardType ?? 'default'}
                                                autoCapitalize={field.keyboardType === 'email-address' ? 'none' : 'sentences'}
                                                multiline={field.multiline}
                                                numberOfLines={field.multiline ? 3 : 1}
                                                textAlignVertical={field.multiline ? 'top' : 'center'}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Pressable style={[s.saveBtn, saving && s.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                            {saving ? (
                                <ActivityIndicator size="small" color={theme.colors.text.inverse} />
                            ) : (
                                <>
                                    <MyIcons name="greenCircleCheck" size={16} stroke={theme.colors.text.inverse} />
                                    <TextComp text={hospitalId ? 'Update Hospital' : 'Create Hospital'} style={s.saveBtnText} />
                                </>
                            )}
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default HospitalForm;
