import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { FormSkeleton, HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { createDepartment, listHospitals, updateDepartment } from '@/services/hospitalService';
import { getSupabase } from '@/utils/supabase';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { formatErrorMessage } from '@/utils/formatError';
import type { Hospital } from '@/types/database';

const SectionTitle: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => (
    <View style={styles.sectionHeader}>
        <TextComp text={title} style={styles.sectionTitle} />
        {hint ? <TextComp text={hint} style={styles.sectionHint} /> : null}
    </View>
);

const DepartmentForm = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'DepartmentForm'>>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { departmentId, hospitalId: initialHospitalId } = route.params ?? {};

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [hospitalId, setHospitalId] = useState(initialHospitalId ?? '');
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tasks: Promise<void>[] = [
            listHospitals().then(setHospitals).then(() => undefined),
        ];
        if (departmentId) {
            tasks.push(
                getSupabase()
                    .from('departments')
                    .select('*')
                    .eq('id', departmentId)
                    .single()
                    .then(({ data }: { data: { name: string; description: string | null; hospital_id: string } | null }) => {
                        if (data) {
                            setName(data.name);
                            setDescription(data.description ?? '');
                            setHospitalId(data.hospital_id);
                        }
                    }),
            );
        }
        Promise.all(tasks).finally(() => setLoading(false));
    }, [departmentId]);

    const selectedHospital = useMemo(
        () => hospitals.find((h) => h.id === hospitalId),
        [hospitals, hospitalId],
    );

    const canSave = !!hospitalId && name.trim().length > 0;

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
                await updateDepartment(departmentId, {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    hospital_id: hospitalId,
                });
            } else {
                await createDepartment({
                    hospital_id: hospitalId,
                    name: name.trim(),
                    description: description.trim() || undefined,
                });
            }
            Toast.show({ type: 'success', text1: departmentId ? 'Department updated' : 'Department created' });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Save failed', text2: formatErrorMessage(e) });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={s.screen}>
            <HealthScreenHeader
                title={departmentId ? 'Edit Department' : 'New Department'}
                subtitle={departmentId ? 'Update department details' : 'Add a specialty to a hospital'}
                onBack={() => navigation.goBack()}
            />
            <ScrollView
                contentContainerStyle={[s.bodyForm, { paddingBottom: insets.bottom + moderateScale(24) }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <FormSkeleton fields={3} />
                ) : (
                    <>
                        <View style={styles.tipCard}>
                            <View style={styles.tipIcon}>
                                <MyIcons name="healthTabDepartments" size={20} stroke={theme.palette.teal.main} />
                            </View>
                            <View style={styles.tipContent}>
                                <TextComp
                                    text={departmentId ? 'Update department info' : 'Set up a new department'}
                                    style={styles.tipTitle}
                                />
                                <TextComp
                                    text="Choose the hospital, then enter the department name and an optional description."
                                    style={styles.tipBody}
                                />
                            </View>
                        </View>

                        <SectionTitle title="Hospital Assignment" hint="Required" />
                        <View style={s.formCard}>
                            {hospitals.length === 0 ? (
                                <View style={styles.emptyHospitals}>
                                    <MyIcons name="healthTabHospital" size={28} stroke={theme.colors.text.muted} />
                                    <TextComp text="No hospitals found" style={styles.emptyHospitalsTitle} />
                                    <TextComp text="Create a hospital before adding departments." style={styles.emptyHospitalsBody} />
                                </View>
                            ) : (
                                hospitals.map((h, idx) => {
                                    const selected = hospitalId === h.id;
                                    return (
                                        <View key={h.id}>
                                            {idx > 0 ? <View style={s.fieldDivider} /> : null}
                                            <Pressable
                                                style={[styles.hospitalOption, selected && styles.hospitalOptionSelected]}
                                                onPress={() => setHospitalId(h.id)}
                                            >
                                                <View style={[styles.hospitalOptionIcon, selected && styles.hospitalOptionIconSelected]}>
                                                    <MyIcons
                                                        name="healthTabHospital"
                                                        size={18}
                                                        stroke={selected ? theme.palette.teal.main : theme.colors.text.secondary}
                                                    />
                                                </View>
                                                <View style={styles.hospitalOptionText}>
                                                    <TextComp
                                                        text={h.name}
                                                        style={[styles.hospitalOptionName, selected && styles.hospitalOptionNameSelected]}
                                                        numberOfLines={1}
                                                    />
                                                    {h.address ? (
                                                        <TextComp text={h.address} style={styles.hospitalOptionMeta} numberOfLines={1} />
                                                    ) : null}
                                                </View>
                                                {selected ? (
                                                    <MyIcons name="greenCircleCheck" size={18} stroke={theme.palette.teal.main} />
                                                ) : (
                                                    <View style={styles.radioOuter} />
                                                )}
                                            </Pressable>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                        <SectionTitle title="Department Details" />
                        <View style={s.formCard}>
                            <View style={s.fieldRow}>
                                <View style={s.infoIconWrap}>
                                    <MyIcons name="healthTabDepartments" size={18} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextComp text="Department Name" style={s.fieldLabel} />
                                    <TextInput
                                        style={s.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="e.g. Cardiology, Pediatrics"
                                        placeholderTextColor={theme.colors.text.muted}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View style={s.fieldDivider} />

                            <View style={s.fieldRow}>
                                <View style={s.infoIconWrap}>
                                    <MyIcons name="healthTabFile" size={18} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextComp text="Description (optional)" style={s.fieldLabel} />
                                    <TextInput
                                        style={[s.input, s.multilineInput]}
                                        value={description}
                                        onChangeText={setDescription}
                                        placeholder="What services or specialties does this department cover?"
                                        placeholderTextColor={theme.colors.text.muted}
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>
                            </View>
                        </View>

                        {name.trim() ? (
                            <View style={styles.previewCard}>
                                <TextComp text="Preview" style={styles.previewLabel} />
                                <View style={styles.previewRow}>
                                    <View style={styles.previewAvatar}>
                                        <TextComp text={name.trim().charAt(0).toUpperCase()} style={styles.previewAvatarText} />
                                    </View>
                                    <View style={styles.previewInfo}>
                                        <TextComp text={name.trim()} style={styles.previewName} numberOfLines={1} />
                                        <TextComp
                                            text={selectedHospital?.name ?? 'Select a hospital'}
                                            style={styles.previewHospital}
                                            numberOfLines={1}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : null}

                        <Pressable
                            style={[s.saveBtn, (!canSave || saving) && s.saveBtnDisabled]}
                            onPress={handleSave}
                            disabled={!canSave || saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color={theme.colors.text.inverse} />
                            ) : (
                                <>
                                    <MyIcons name="greenCircleCheck" size={16} stroke={theme.colors.text.inverse} />
                                    <TextComp
                                        text={departmentId ? 'Update Department' : 'Create Department'}
                                        style={s.saveBtnText}
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
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(12),
        backgroundColor: theme.palette.teal.surface,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
        padding: moderateScale(14),
    },
    tipIcon: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
    },
    tipContent: { flex: 1 },
    tipTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: theme.palette.teal.dark,
    },
    tipBody: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(4),
        lineHeight: moderateScale(18),
    },
    sectionHeader: {
        gap: moderateScale(2),
        marginTop: moderateScale(4),
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: theme.colors.text.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionHint: {
        fontSize: moderateScale(11),
        color: theme.palette.status.warning,
        fontWeight: '600',
    },
    hospitalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
    },
    hospitalOptionSelected: {
        backgroundColor: theme.palette.teal.surface + '88',
    },
    hospitalOptionIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        backgroundColor: theme.colors.background.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
    hospitalOptionIconSelected: {
        backgroundColor: theme.colors.card.background,
        borderColor: theme.palette.teal.main + '33',
    },
    hospitalOptionText: { flex: 1 },
    hospitalOptionName: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    hospitalOptionNameSelected: {
        color: theme.palette.teal.dark,
        fontWeight: '700',
    },
    hospitalOptionMeta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
    },
    radioOuter: {
        width: moderateScale(18),
        height: moderateScale(18),
        borderRadius: moderateScale(9),
        borderWidth: 2,
        borderColor: theme.colors.border.default,
    },
    emptyHospitals: {
        alignItems: 'center',
        padding: moderateScale(24),
        gap: moderateScale(8),
    },
    emptyHospitalsTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    emptyHospitalsBody: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    previewCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        padding: moderateScale(14),
        ...theme.shadows.card,
    },
    previewLabel: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: moderateScale(10),
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
    },
    previewAvatar: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    previewAvatarText: {
        fontSize: moderateScale(16),
        fontWeight: '800',
        color: theme.palette.teal.main,
    },
    previewInfo: { flex: 1 },
    previewName: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    previewHospital: {
        fontSize: moderateScale(12),
        color: theme.palette.teal.main,
        fontWeight: '600',
        marginTop: moderateScale(2),
    },
});

export default DepartmentForm;
