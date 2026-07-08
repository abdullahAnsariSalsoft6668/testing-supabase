import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { CardListSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteDepartment, listDepartments } from '@/services/hospitalService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import type { Department } from '@/types/database';

const AdminDepartments = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialog, setDialog] = useState<{ visible: boolean; dept: Department | null }>({ visible: false, dept: null });
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!hasFetchedRef.current) setLoading(true);
        listDepartments()
            .then(setDepartments)
            .catch(() => Toast.show({ type: 'error', text1: 'Failed to load departments' }))
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const handleConfirmedDelete = async () => {
        const d = dialog.dept;
        if (!d) return;
        setDeletingId(d.id);
        setDialog({ visible: false, dept: null });
        try {
            await deleteDepartment(d.id);
            Toast.show({ type: 'success', text1: 'Department deleted' });
            load();
        } catch {
            Toast.show({ type: 'error', text1: 'Delete failed' });
        } finally {
            setDeletingId(null);
        }
    };

    const AddButton = (
        <Pressable
            style={styles.headerBtn}
            onPress={() => navigation.navigate(routes.admin.departmentForm, {})}
        >
            <TextComp text="+ Add" style={styles.headerBtnText} />
        </Pressable>
    );

    return (
        <View style={styles.screen}>
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
                subtitle="Manage hospital departments"
                rightAction={AddButton}
            />
            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {!loading && (
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <TextComp text={String(departments.length)} style={styles.statValue} />
                            <TextComp text="Total" style={styles.statLabel} />
                        </View>
                    </View>
                )}

                {loading ? (
                    <CardListSkeleton count={3} />
                ) : departments.length === 0 ? (
                    <EmptyState
                        title="No departments yet"
                        message="Tap '+ Add' to create the first department."
                    />
                ) : (
                    departments.map((d) => (
                        <View key={d.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconWrap}>
                                    <MyIcons name="healthTabDepartments" size={20} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <TextComp text={d.name} style={styles.cardTitle} numberOfLines={1} />
                                    {d.hospitals?.name ? (
                                        <View style={styles.hospitalBadge}>
                                            <MyIcons name="healthTabHospital" size={11} stroke={theme.palette.sky.accent} />
                                            <TextComp text={d.hospitals.name} style={styles.hospitalBadgeText} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                    {d.description ? (
                                        <TextComp text={d.description} style={styles.cardDesc} numberOfLines={2} />
                                    ) : null}
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.actions}>
                                <Pressable
                                    style={[styles.actionBtn, styles.editBtn]}
                                    onPress={() =>
                                        navigation.navigate(routes.admin.departmentForm, {
                                            departmentId: d.id,
                                            hospitalId: d.hospital_id,
                                        })
                                    }
                                >
                                    <MyIcons name="editIcon" size={14} stroke={theme.palette.teal.main} />
                                    <TextComp text="Edit" style={styles.editBtnText} />
                                </Pressable>
                                <Pressable
                                    style={[styles.actionBtn, styles.deleteBtn]}
                                    onPress={() => setDialog({ visible: true, dept: d })}
                                    disabled={deletingId === d.id}
                                >
                                    {deletingId === d.id ? (
                                        <ActivityIndicator size="small" color={theme.palette.status.error} />
                                    ) : (
                                        <>
                                            <MyIcons name="close" size={13} stroke={theme.palette.status.error} />
                                            <TextComp text="Delete" style={styles.deleteBtnText} />
                                        </>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(120),
    },

    headerBtn: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(6),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    headerBtnText: { color: '#fff', fontSize: moderateScale(13), fontWeight: '600' },

    statsBar: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: moderateScale(24), fontWeight: '700', color: theme.colors.brand.primary },
    statLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: moderateScale(16),
        gap: moderateScale(12),
    },
    iconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    cardInfo: { flex: 1 },
    cardTitle: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    hospitalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        backgroundColor: theme.palette.sky.main,
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(3),
        borderRadius: moderateScale(20),
        marginTop: moderateScale(6),
    },
    hospitalBadgeText: {
        fontSize: moderateScale(11),
        color: theme.palette.sky.accent,
        fontWeight: '600',
    },
    cardDesc: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(6),
        lineHeight: moderateScale(18),
    },

    divider: { height: 1, backgroundColor: theme.colors.border.default, marginHorizontal: moderateScale(16) },

    actions: {
        flexDirection: 'row',
        padding: moderateScale(12),
        gap: moderateScale(10),
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: moderateScale(9),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(5),
    },
    editBtn: { backgroundColor: theme.palette.teal.surface },
    editBtnText: { fontSize: moderateScale(13), fontWeight: '600', color: theme.palette.teal.main },
    deleteBtn: { backgroundColor: '#FFF1F0', borderWidth: 1, borderColor: '#FFCCC7' },
    deleteBtnText: { fontSize: moderateScale(13), fontWeight: '600', color: theme.palette.status.error },
});

export default AdminDepartments;
