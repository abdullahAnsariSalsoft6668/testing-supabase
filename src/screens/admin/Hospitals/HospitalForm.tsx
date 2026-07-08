import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { FormSkeleton, HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createHospital, getHospital, updateHospital } from '@/services/hospitalService';
import { moderateScale } from '@/styles/scaling';
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

    const BackBtn = (
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MyIcons name="arrowChevron" size={16} stroke={theme.colors.text.inverse} />
            <TextComp text="Back" style={styles.backBtnText} />
        </Pressable>
    );

    const fields: FieldConfig[] = [
        {
            key: 'name',
            label: 'Hospital Name',
            placeholder: 'e.g. City General Hospital',
            icon: <MyIcons name="healthTabHospital" size={16} stroke={theme.palette.teal.main} />,
        },
        {
            key: 'email',
            label: 'Email',
            placeholder: 'contact@hospital.com',
            icon: <MyIcons name="emailIcon" size={16} stroke={theme.palette.teal.main} />,
            keyboardType: 'email-address',
        },
        {
            key: 'phone',
            label: 'Phone',
            placeholder: '+1 (555) 000-0000',
            icon: <MyIcons name="phoneIcon" size={16} stroke={theme.palette.teal.main} />,
            keyboardType: 'phone-pad',
        },
        {
            key: 'address',
            label: 'Address',
            placeholder: '123 Medical Ave, City',
            icon: <MyIcons name="locationIcon" size={16} stroke={theme.palette.teal.main} />,
        },
        {
            key: 'description',
            label: 'Description (optional)',
            placeholder: 'Brief overview of the hospital',
            icon: <MyIcons name="documentIcon" size={16} stroke={theme.palette.teal.main} />,
            multiline: true,
        },
    ];

    const values = { name, email, phone, address, description };
    const setters = {
        name: setName,
        email: setEmail,
        phone: setPhone,
        address: setAddress,
        description: setDescription,
    };

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title={hospitalId ? 'Edit Hospital' : 'New Hospital'}
                subtitle={hospitalId ? 'Update facility details' : 'Register a new healthcare facility'}
                rightAction={BackBtn}
            />
            <ScrollView
                contentContainerStyle={styles.body}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {loadingData ? (
                    <FormSkeleton fields={5} />
                ) : (
                    <>
                        <View style={styles.formCard}>
                            {fields.map((field, idx) => (
                                <View key={field.key}>
                                    {idx > 0 ? <View style={styles.fieldDivider} /> : null}
                                    <View style={styles.fieldRow}>
                                        <View style={styles.iconWrap}>{field.icon}</View>
                                        <View style={styles.fieldContent}>
                                            <TextComp text={field.label} style={styles.fieldLabel} />
                                            <TextInput
                                                style={[styles.input, field.multiline && styles.multilineInput]}
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

                        <Pressable
                            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <MyIcons name="checkVerified" size={16} stroke="#fff" />
                                    <TextComp
                                        text={hospitalId ? 'Update Hospital' : 'Create Hospital'}
                                        style={styles.saveBtnText}
                                    />
                                </>
                            )}
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(60),
        gap: moderateScale(16),
    },

    backBtn: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(4), paddingHorizontal: moderateScale(4) },
    backBtnText: { color: theme.colors.text.inverse, fontSize: moderateScale(14), fontWeight: '600' },

    formCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    fieldDivider: { height: 1, backgroundColor: theme.colors.border.default, marginHorizontal: moderateScale(16) },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
    iconWrap: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(10),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(18),
        flexShrink: 0,
    },
    fieldContent: { flex: 1 },
    fieldLabel: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: moderateScale(6),
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.md,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(10),
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    multilineInput: {
        minHeight: moderateScale(72),
        paddingTop: moderateScale(10),
    },

    saveBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.brand.primary,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    saveBtnDisabled: { opacity: 0.7 },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(15) },
});

export default HospitalForm;
