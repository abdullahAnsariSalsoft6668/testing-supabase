import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import TextComp from '@/components/TextComp';
import { listHospitalsByStatus, setHospitalStatus } from '@/services/hospitalService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { theme } from '@/styles/theme';
import type { Hospital } from '@/types/database';
import { formatErrorMessage } from '@/utils/formatError';

const AdminHospitalRequests = () => {
    const [rows, setRows] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!hasFetchedRef.current) setLoading(true);
        listHospitalsByStatus('PENDING')
            .then(setRows)
            .catch((e) => Toast.show({ type: 'error', text1: 'Failed to load', text2: formatErrorMessage(e) }))
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const setStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setActingId(id);
        try {
            await setHospitalStatus(id, status);
            Toast.show({ type: 'success', text1: status === 'APPROVED' ? 'Approved' : 'Rejected' });
            load();
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Update failed', text2: formatErrorMessage(e) });
        } finally {
            setActingId(null);
        }
    };

    return (
        <View style={s.screen}>
            <HealthScreenHeader title="Hospital requests" subtitle="Approve clinics that applied to join" />
            <ScrollView contentContainerStyle={s.bodyList} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 24 }} color={theme.palette.teal.main} />
                ) : rows.length === 0 ? (
                    <EmptyState title="No pending hospitals" message="New applications will show up here." />
                ) : (
                    rows.map((h) => (
                        <View key={h.id} style={s.card}>
                            <View style={s.cardHeader}>
                                <View style={s.cardInfo}>
                                    <TextComp text={h.name} style={s.cardTitle} />
                                    {h.address ? <TextComp text={h.address} style={s.cardMeta} /> : null}
                                    {h.email ? <TextComp text={h.email} style={s.cardMeta} /> : null}
                                    <View style={{ marginTop: 8 }}>
                                        <StatusBadge status="PENDING" type="doctor" />
                                    </View>
                                </View>
                            </View>
                            <View style={s.divider} />
                            <View style={s.actions}>
                                <Pressable
                                    style={[s.actionBtn, s.editBtn]}
                                    disabled={actingId === h.id}
                                    onPress={() => void setStatus(h.id, 'APPROVED')}
                                >
                                    {actingId === h.id ? (
                                        <ActivityIndicator size="small" />
                                    ) : (
                                        <TextComp text="Approve" style={s.editBtnText} />
                                    )}
                                </Pressable>
                                <Pressable
                                    style={[s.actionBtn, s.deleteBtn]}
                                    disabled={actingId === h.id}
                                    onPress={() => void setStatus(h.id, 'REJECTED')}
                                >
                                    <TextComp text="Reject" style={s.deleteBtnText} />
                                </Pressable>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default AdminHospitalRequests;
