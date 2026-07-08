import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createDepartment, listHospitals, updateDepartment } from '@/services/hospitalService';
import { getSupabase } from '@/utils/supabase';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
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
    const [loadingHospitals, setLoadingHospitals] = useState(true);

    useEffect(() => {
        listHospitals()
            .then(setHospitals)
            .finally(() => setLoadingHospitals(false));

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
            Toast.show({ type: 'error', text1: 'Select a hospital first' });
            return;
        }
        if (!name.trim()) {
            Toast.show({ type: 'error', text1: 'Department name is required' });
            return;
        }
        setSaving(true);
        try {
            if (departmentId) {
                await updateDepartment(departmentId, { name: name.trim(), description: description.trim() || undefined, hospital_id: hospitalId });
            } else {
                await createDepartment({ hospital_id: hospitalId, name: name.trim(), description: description.trim() || undefined });
            }
            Toast.show({ type: 'success', text1: departmentId ? 'Department updated' : 'Department created' });
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

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title={departmentId ? 'Edit Department' : 'New Department'}
                subtitle={departmentId ? 'Update department details' : 'Add a department to a hospital'}
                rightAction={BackBtn}
            />
            <ScrollView
                contentContainerStyle={styles.body}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Hospital picker */}
                <View style={styles.section}>
                    <TextComp text="Hospital" style={styles.sectionTitle} />
                    {loadingHospitals ? (
                        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: moderateScale(12) }} />
                    ) : hospitals.length === 0 ? (
                        <View style={styles.emptyHospitals}>
                            <TextComp text="No hospitals found. Create a hospital first." style={styles.emptyText} />
                        </View>
                    ) : (
                        <View style={styles.chipGrid}>
                            {hospitals.map((h) => (
                                <Pressable
                                    key={h.id}
                                    style={[styles.chip, hospitalId === h.id && styles.chipActive]}
                                    onPress={() => setHospitalId(h.id)}
                                >
                                    <MyIcons
                                        name="healthTabHospital"
                                        size={12}
                                        stroke={hospitalId === h.id ? theme.palette.teal.main : theme.colors.text.secondary}
                                    />
                                    <TextComp
                                        text={h.name}
                                        style={[styles.chipText, hospitalId === h.id && styles.chipTextActive]}
                                        numberOfLines={1}
                                    />
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Name */}
                <View style={styles.field}>
                    <View style={styles.labelRow}>
                        <MyIcons name="healthTabDepartments" size={14} stroke={theme.colors.text.secondary} />
                        <TextComp text="Department Name" style={styles.label} />
                    </View>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Cardiology"
                        placeholderTextColor={theme.colors.text.muted}
                    />
                </View>

                {/* Description */}
                <View style={styles.field}>
                    <View style={styles.labelRow}>
                        <MyIcons name="documentIcon" size={14} stroke={theme.colors.text.secondary} />
                        <TextComp text="Description (optional)" style={styles.label} />
                    </View>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Brief description of this department"
                        placeholderTextColor={theme.colors.text.muted}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <MyIcons name="checkVerified" size={16} stroke="#fff" />
                            <TextComp text={departmentId ? 'Update Department' : 'Create Department'} style={styles.saveBtnText} />
                        </>
                    )}
                </Pressable>
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

    section: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: moderateScale(12),
    },
    emptyHospitals: {
        paddingVertical: moderateScale(12),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(8),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        backgroundColor: theme.colors.background.secondary,
    },
    chipActive: {
        backgroundColor: theme.palette.teal.surface,
        borderColor: theme.palette.teal.main,
    },
    chipText: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
        fontWeight: '500',
        maxWidth: moderateScale(140),
    },
    chipTextActive: { color: theme.palette.teal.main, fontWeight: '600' },

    field: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        marginBottom: moderateScale(8),
    },
    label: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    input: {
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderRadius: theme.radius.md,
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(12),
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    multilineInput: {
        minHeight: moderateScale(80),
        paddingTop: moderateScale(12),
    },

    saveBtn: {
        flexDirection: 'row',
        backgroundColor: theme.colors.brand.primary,
        borderRadius: theme.radius.button,
        paddingVertical: moderateScale(15),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        marginTop: moderateScale(4),
    },
    saveBtnDisabled: { opacity: 0.7 },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(15) },
});

export default DepartmentForm;
