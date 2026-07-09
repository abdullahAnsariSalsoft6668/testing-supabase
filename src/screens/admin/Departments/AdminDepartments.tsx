import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AdminAddButton, AdminFilterChips, AdminStatsBar } from '@/components/admin/AdminUI';
import { CardListSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteDepartment, listDepartments, listHospitals } from '@/services/hospitalService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import type { Department, Hospital } from '@/types/database';

type HospitalFilter = 'ALL' | string;

const AdminDepartments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<HospitalFilter>('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialog, setDialog] = useState<{ visible: boolean; dept: Department | null }>({ visible: false, dept: null });
    const hasFetchedRef = useRef(false);

    const load = useCallback((hospitalFilter: HospitalFilter) => {
        if (!hasFetchedRef.current) setLoading(true);
        Promise.all([
            listDepartments(hospitalFilter === 'ALL' ? undefined : hospitalFilter),
            listHospitals(),
        ])
            .then(([depts, hosp]) => {
                setDepartments(depts);
                setHospitals(hosp);
            })
            .catch(() => Toast.show({ type: 'error', text1: 'Failed to load departments' }))
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(filter); }, [filter, load]));

    const changeFilter = (next: HospitalFilter) => {
        hasFetchedRef.current = false;
        setFilter(next);
    };

    const filterTabs = useMemo(
        () => [
            {
                key: 'ALL' as HospitalFilter,
                label: 'All',
                icon: 'healthTabDepartments' as const,
                accent: theme.palette.teal.main,
                surface: theme.palette.teal.surface,
            },
            ...hospitals.map((h) => ({
                key: h.id as HospitalFilter,
                label: h.name,
                icon: 'healthTabHospital' as const,
                accent: theme.palette.sky.accent,
                surface: theme.palette.sky.main,
            })),
        ],
        [hospitals],
    );

    const hospitalCount = useMemo(
        () => new Set(departments.map((d) => d.hospital_id)).size,
        [departments],
    );

    const activeHospitalName =
        filter === 'ALL' ? 'all hospitals' : hospitals.find((h) => h.id === filter)?.name?.toLowerCase() ?? 'hospital';

    const handleConfirmedDelete = async () => {
        const d = dialog.dept;
        if (!d) return;
        setDeletingId(d.id);
        setDialog({ visible: false, dept: null });
        try {
            await deleteDepartment(d.id);
            Toast.show({ type: 'success', text1: 'Department deleted' });
            load(filter);
        } catch {
            Toast.show({ type: 'error', text1: 'Delete failed' });
        } finally {
            setDeletingId(null);
        }
    };

    const openEdit = (d: Department) => {
        navigation.navigate(routes.admin.departmentForm, {
            departmentId: d.id,
            hospitalId: d.hospital_id,
        });
    };

    return (
        <View style={s.screen}>
            <ConfirmDialog
                visible={dialog.visible}
                title="Delete Department"
                message={dialog.dept ? `Remove "${dialog.dept.name}" from ${dialog.dept.hospitals?.name ?? 'hospital'}? This cannot be undone.` : ''}
                confirmText="Delete"
                danger
                onConfirm={handleConfirmedDelete}
                onCancel={() => setDialog({ visible: false, dept: null })}
            />
            <HealthScreenHeader
                title="Departments"
                subtitle="Organize specialties across hospitals"
                rightAction={
                    <AdminAddButton label="Add" onPress={() => navigation.navigate(routes.admin.departmentForm, {})} />
                }
            />
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {!loading && hospitals.length === 0 ? (
                    <View style={styles.hintBanner}>
                        <View style={styles.hintIcon}>
                            <MyIcons name="healthTabHospital" size={18} stroke={theme.palette.status.warning} />
                        </View>
                        <View style={styles.hintText}>
                            <TextComp text="No hospitals yet" style={styles.hintTitle} />
                            <TextComp text="Create a hospital first, then add departments to it." style={styles.hintBody} />
                        </View>
                        <Pressable
                            style={styles.hintBtn}
                            onPress={() => navigation.navigate(routes.admin.hospitalForm, {})}
                        >
                            <TextComp text="Add Hospital" style={styles.hintBtnText} />
                        </Pressable>
                    </View>
                ) : null}

                {!loading && hospitals.length > 0 ? (
                    <>
                        <AdminStatsBar
                            items={[
                                { value: departments.length, label: 'Departments' },
                                { value: hospitalCount, label: 'Hospitals' },
                            ]}
                        />
                        {hospitals.length > 1 ? (
                            <AdminFilterChips tabs={filterTabs} active={filter} onChange={changeFilter} />
                        ) : null}
                        {departments.length > 0 ? (
                            <TextComp
                                text={`${departments.length} department${departments.length === 1 ? '' : 's'} in ${activeHospitalName}`}
                                style={styles.resultText}
                            />
                        ) : null}
                    </>
                ) : null}

                {loading ? (
                    <CardListSkeleton count={3} />
                ) : departments.length === 0 ? (
                    <EmptyState
                        title={filter === 'ALL' ? 'No departments yet' : 'No departments here'}
                        message={
                            filter === 'ALL'
                                ? "Tap 'Add' to create your first department and assign it to a hospital."
                                : 'Try another hospital filter or add a new department.'
                        }
                    />
                ) : (
                    departments.map((d) => {
                        const initial = d.name.trim().charAt(0).toUpperCase() || 'D';

                        return (
                            <View key={d.id} style={styles.deptCard}>
                                <Pressable style={styles.cardTop} onPress={() => openEdit(d)}>
                                    <View style={styles.avatar}>
                                        <TextComp text={initial} style={styles.avatarText} />
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <TextComp text={d.name} style={s.cardTitle} numberOfLines={1} />
                                        {d.hospitals?.name ? (
                                            <View style={styles.hospitalChip}>
                                                <MyIcons name="healthTabHospital" size={11} stroke={theme.palette.teal.main} />
                                                <TextComp text={d.hospitals.name} style={styles.hospitalChipText} numberOfLines={1} />
                                            </View>
                                        ) : null}
                                        {d.description ? (
                                            <TextComp text={d.description} style={styles.descText} numberOfLines={2} />
                                        ) : (
                                            <TextComp text="No description added" style={styles.descPlaceholder} />
                                        )}
                                    </View>
                                    <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.muted} />
                                </Pressable>

                                <View style={s.divider} />

                                <View style={s.actions}>
                                    <Pressable style={[s.actionBtn, s.editBtn]} onPress={() => openEdit(d)}>
                                        <MyIcons name="editIcon" size={14} stroke={theme.palette.teal.main} />
                                        <TextComp text="Edit" style={s.editBtnText} />
                                    </Pressable>
                                    <Pressable
                                        style={[s.actionBtn, s.deleteBtn]}
                                        onPress={() => setDialog({ visible: true, dept: d })}
                                        disabled={deletingId === d.id}
                                    >
                                        {deletingId === d.id ? (
                                            <ActivityIndicator size="small" color={theme.palette.status.error} />
                                        ) : (
                                            <>
                                                <MyIcons name="healthTabClose" size={13} stroke={theme.palette.status.error} />
                                                <TextComp text="Delete" style={s.deleteBtnText} />
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(120),
        gap: moderateScale(12),
    },
    hintBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        backgroundColor: theme.palette.status.warning + '14',
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.palette.status.warning + '33',
        padding: moderateScale(14),
    },
    hintIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hintText: { flex: 1 },
    hintTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    hintBody: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
        lineHeight: moderateScale(18),
    },
    hintBtn: {
        backgroundColor: theme.palette.teal.main,
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(8),
        borderRadius: moderateScale(20),
    },
    hintBtnText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },
    resultText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    deptCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderLeftWidth: 4,
        borderLeftColor: theme.palette.teal.main,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: moderateScale(14),
        gap: moderateScale(12),
    },
    avatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(14),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    avatarText: {
        fontSize: moderateScale(18),
        fontWeight: '800',
        color: theme.palette.teal.main,
    },
    cardInfo: { flex: 1, gap: moderateScale(6) },
    hospitalChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: moderateScale(5),
        backgroundColor: theme.palette.teal.surface,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
        maxWidth: '100%',
    },
    hospitalChipText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: theme.palette.teal.dark,
    },
    descText: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
        lineHeight: moderateScale(20),
    },
    descPlaceholder: {
        fontSize: moderateScale(12),
        color: theme.colors.text.muted,
        fontStyle: 'italic',
    },
});

export default AdminDepartments;
