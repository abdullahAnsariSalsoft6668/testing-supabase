import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AdminAddButton, AdminStatsBar } from '@/components/admin/AdminUI';
import { CardListSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteHospital, listHospitals } from '@/services/hospitalService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { theme } from '@/styles/theme';
import type { Hospital } from '@/types/database';

const AdminHospitals = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialog, setDialog] = useState<{ visible: boolean; hospital: Hospital | null }>({ visible: false, hospital: null });
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!hasFetchedRef.current) setLoading(true);
        listHospitals()
            .then(setHospitals)
            .catch(() => Toast.show({ type: 'error', text1: 'Failed to load hospitals' }))
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const handleConfirmedDelete = async () => {
        const h = dialog.hospital;
        if (!h) return;
        setDeletingId(h.id);
        setDialog({ visible: false, hospital: null });
        try {
            await deleteHospital(h.id);
            Toast.show({ type: 'success', text1: 'Hospital deleted' });
            load();
        } catch {
            Toast.show({ type: 'error', text1: 'Delete failed' });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <View style={s.screen}>
            <ConfirmDialog
                visible={dialog.visible}
                title="Delete Hospital"
                message={dialog.hospital ? `Remove "${dialog.hospital.name}"? This cannot be undone.` : ''}
                confirmText="Delete"
                danger
                onConfirm={handleConfirmedDelete}
                onCancel={() => setDialog({ visible: false, hospital: null })}
            />
            <HealthScreenHeader
                title="Hospitals"
                subtitle="Manage healthcare facilities"
                rightAction={
                    <AdminAddButton onPress={() => navigation.navigate(routes.admin.hospitalForm, {})} />
                }
            />

            <ScrollView contentContainerStyle={s.bodyList} showsVerticalScrollIndicator={false}>
                {!loading && (
                    <AdminStatsBar items={[{ value: hospitals.length, label: 'Total Hospitals' }]} />
                )}

                {loading ? (
                    <CardListSkeleton count={3} />
                ) : hospitals.length === 0 ? (
                    <EmptyState
                        title="No hospitals yet"
                        message="Tap 'Add' to register the first healthcare facility."
                    />
                ) : (
                    hospitals.map((h) => (
                        <View key={h.id} style={s.card}>
                            <View style={s.cardHeader}>
                                <View style={s.iconBadge}>
                                    <MyIcons name="healthTabHospital" size={22} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={s.cardInfo}>
                                    <TextComp text={h.name} style={s.cardTitle} numberOfLines={1} />
                                    {h.address ? (
                                        <View style={s.metaRow}>
                                            <MyIcons name="locationIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.address} style={s.cardMeta} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                    {h.phone ? (
                                        <View style={s.metaRow}>
                                            <MyIcons name="phoneIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.phone} style={s.cardMeta} />
                                        </View>
                                    ) : null}
                                    {h.email ? (
                                        <View style={s.metaRow}>
                                            <MyIcons name="emailIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.email} style={s.cardMeta} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                </View>
                                <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.secondary} />
                            </View>

                            <View style={s.divider} />

                            <View style={s.actions}>
                                <Pressable
                                    style={[s.actionBtn, s.editBtn]}
                                    onPress={() => navigation.navigate(routes.admin.hospitalForm, { hospitalId: h.id })}
                                >
                                    <MyIcons name="editIcon" size={14} stroke={theme.palette.teal.main} />
                                    <TextComp text="Edit" style={s.editBtnText} />
                                </Pressable>
                                <Pressable
                                    style={[s.actionBtn, s.deleteBtn]}
                                    onPress={() => setDialog({ visible: true, hospital: h })}
                                    disabled={deletingId === h.id}
                                >
                                    {deletingId === h.id ? (
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
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default AdminHospitals;
