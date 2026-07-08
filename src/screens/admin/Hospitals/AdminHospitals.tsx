import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { CardListSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { deleteHospital, listHospitals } from '@/services/hospitalService';
import { moderateScale } from '@/styles/scaling';
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

    const AddButton = (
        <Pressable
            style={styles.headerBtn}
            onPress={() => navigation.navigate(routes.admin.hospitalForm, {})}
        >
            <TextComp text="+ Add" style={styles.headerBtnText} />
        </Pressable>
    );

    return (
        <View style={styles.screen}>
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
                rightAction={AddButton}
            />

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats bar */}
                {!loading && (
                    <View style={styles.statsBar}>
                        <View style={styles.statItem}>
                            <TextComp text={String(hospitals.length)} style={styles.statValue} />
                            <TextComp text="Total" style={styles.statLabel} />
                        </View>
                    </View>
                )}

                {loading ? (
                    <CardListSkeleton count={3} />
                ) : hospitals.length === 0 ? (
                    <EmptyState
                        title="No hospitals yet"
                        message="Tap '+ Add' to register the first healthcare facility."
                    />
                ) : (
                    hospitals.map((h) => (
                        <View key={h.id} style={styles.card}>
                            {/* Card header */}
                            <View style={styles.cardHeader}>
                                <View style={styles.avatar}>
                                    <MyIcons name="healthTabHospital" size={22} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <TextComp text={h.name} style={styles.cardTitle} numberOfLines={1} />
                                    {h.address ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="locationIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.address} style={styles.cardMeta} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                    {h.phone ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="phoneIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.phone} style={styles.cardMeta} />
                                        </View>
                                    ) : null}
                                    {h.email ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="emailIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.email} style={styles.cardMeta} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                </View>
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Actions */}
                            <View style={styles.actions}>
                                <Pressable
                                    style={[styles.actionBtn, styles.editBtn]}
                                    onPress={() =>
                                        navigation.navigate(routes.admin.hospitalForm, { hospitalId: h.id })
                                    }
                                >
                                    <MyIcons name="editIcon" size={14} stroke={theme.palette.teal.main} />
                                    <TextComp text="Edit" style={styles.editBtnText} />
                                </Pressable>
                                <Pressable
                                    style={[styles.actionBtn, styles.deleteBtn]}
                                    onPress={() => setDialog({ visible: true, hospital: h })}
                                    disabled={deletingId === h.id}
                                >
                                    {deletingId === h.id ? (
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

    /* Header add button */
    headerBtn: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(6),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    headerBtnText: {
        color: theme.colors.text.inverse,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },

    /* Stats bar */
    statsBar: {
        flexDirection: 'row',
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
    statValue: {
        fontSize: moderateScale(24),
        fontWeight: '700',
        color: theme.colors.brand.primary,
    },
    statLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    /* Hospital card */
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
        gap: moderateScale(14),
    },
    avatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(14),
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
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(4),
        gap: moderateScale(4),
    },
    cardMeta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        flex: 1,
    },

    /* Divider */
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
        marginHorizontal: moderateScale(16),
    },

    /* Action row */
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
    editBtn: {
        backgroundColor: theme.palette.teal.surface,
    },
    editBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.palette.teal.main,
    },
    deleteBtn: {
        backgroundColor: '#FFF1F0',
        borderWidth: 1,
        borderColor: '#FFCCC7',
    },
    deleteBtnText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.palette.status.error,
    },
});

export default AdminHospitals;
