import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// ActivityIndicator still used for action buttons (approve/reject spinners)
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { CardListSkeleton, EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { listDoctorsByStatus, updateDoctorStatus } from '@/services/doctorService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { formatErrorMessage } from '@/utils/formatError';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor, DoctorStatus } from '@/types/database';

const FILTERS: DoctorStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

const AdminDoctors = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<DoctorStatus>('PENDING');
    const [actingId, setActingId] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);

    const load = useCallback((status: DoctorStatus) => {
        if (!hasFetchedRef.current) setLoading(true);
        listDoctorsByStatus(status)
            .then(setDoctors)
            .catch((e) => {
                setDoctors([]);
                Toast.show({ type: 'error', text1: 'Failed to load doctors', text2: formatErrorMessage(e) });
            })
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(filter); }, [filter, load]));

    const changeFilter = (s: DoctorStatus) => {
        hasFetchedRef.current = false;
        setFilter(s);
    };

    const setStatus = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        setActingId(id);
        try {
            await updateDoctorStatus(id, status);
            Toast.show({ type: 'success', text1: `Doctor ${status.toLowerCase()}` });
            load(filter);
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Action failed', text2: formatErrorMessage(e) });
        } finally {
            setActingId(null);
        }
    };

    const initials = (name: string) =>
        name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

    const FilterTabs = (
        <View style={styles.filterRow}>
            {FILTERS.map((s) => (
                <Pressable
                    key={s}
                    style={[styles.filterTab, filter === s && styles.filterTabActive]}
                    onPress={() => changeFilter(s)}
                >
                    <TextComp
                        text={s.charAt(0) + s.slice(1).toLowerCase()}
                        style={[styles.filterTabText, filter === s && styles.filterTabTextActive]}
                    />
                </Pressable>
            ))}
        </View>
    );

    return (
        <View style={styles.screen}>
            <HealthScreenHeader title="Doctors" subtitle="Review and approve registrations">
                {FilterTabs}
            </HealthScreenHeader>

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <CardListSkeleton count={4} />
                ) : doctors.length === 0 ? (
                    <EmptyState
                        title={`No ${filter.toLowerCase()} doctors`}
                        message="All doctors in this category will appear here."
                    />
                ) : (
                    doctors.map((d) => {
                        const name = getUserDisplayName(d.users, d.specialization || 'Doctor');
                        return (
                            <Pressable
                                key={d.id}
                                style={styles.card}
                                onPress={() =>
                                    navigation.navigate(routes.admin.doctorDetailAdmin, { doctorId: d.id })
                                }
                            >
                                {/* Card header */}
                                <View style={styles.cardHeader}>
                                    <View style={styles.avatar}>
                                        <TextComp text={initials(name)} style={styles.avatarText} />
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <View style={styles.nameRow}>
                                            <TextComp text={name} style={styles.cardTitle} numberOfLines={1} />
                                            <StatusBadge status={d.status} type="doctor" />
                                        </View>
                                        {d.specialization ? (
                                            <TextComp text={d.specialization} style={styles.specText} />
                                        ) : null}
                                        {d.qualification ? (
                                            <View style={styles.metaRow}>
                                                <MyIcons name="licenseIcon" size={12} stroke={theme.colors.text.secondary} />
                                                <TextComp text={d.qualification} style={styles.cardMeta} />
                                            </View>
                                        ) : null}
                                        {d.hospitals?.name ? (
                                            <View style={styles.metaRow}>
                                                <MyIcons name="healthTabHospital" size={12} stroke={theme.colors.text.secondary} />
                                                <TextComp text={d.hospitals.name} style={styles.cardMeta} />
                                            </View>
                                        ) : null}
                                    </View>
                                </View>

                                {/* Actions for PENDING */}
                                {d.status === 'PENDING' ? (
                                    <>
                                        <View style={styles.divider} />
                                        <View style={styles.actions}>
                                            <Pressable
                                                style={[styles.actionBtn, styles.approveBtn]}
                                                onPress={() => setStatus(d.id, 'APPROVED')}
                                                disabled={actingId === d.id}
                                            >
                                                {actingId === d.id ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <>
                                                        <MyIcons name="checkVerified" size={14} stroke="#fff" />
                                                        <TextComp text="Approve" style={styles.approveBtnText} />
                                                    </>
                                                )}
                                            </Pressable>
                                            <Pressable
                                                style={[styles.actionBtn, styles.rejectBtn]}
                                                onPress={() => setStatus(d.id, 'REJECTED')}
                                                disabled={actingId === d.id}
                                            >
                                                <MyIcons name="close" size={13} stroke={theme.palette.status.error} />
                                                <TextComp text="Reject" style={styles.rejectBtnText} />
                                            </Pressable>
                                        </View>
                                    </>
                                ) : null}
                            </Pressable>
                        );
                    })
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

    /* Filter tabs in header */
    filterRow: {
        flexDirection: 'row',
        gap: moderateScale(8),
    },
    filterTab: {
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(7),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    filterTabActive: {
        backgroundColor: theme.palette.neutral.white,
    },
    filterTabText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
    },
    filterTabTextActive: {
        color: theme.palette.teal.main,
    },

    /* Doctor card */
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
        padding: moderateScale(16),
        gap: moderateScale(12),
    },
    avatar: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },
    cardInfo: { flex: 1 },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
    },
    cardTitle: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: theme.colors.text.primary,
        flex: 1,
    },
    specText: {
        fontSize: moderateScale(13),
        color: theme.palette.teal.main,
        fontWeight: '500',
        marginTop: moderateScale(2),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
        marginTop: moderateScale(4),
    },
    cardMeta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        flex: 1,
    },

    /* Divider */
    divider: { height: 1, backgroundColor: theme.colors.border.default, marginHorizontal: moderateScale(16) },

    /* Action buttons */
    actions: {
        flexDirection: 'row',
        padding: moderateScale(12),
        gap: moderateScale(10),
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(5),
    },
    approveBtn: { backgroundColor: theme.palette.teal.main },
    approveBtnText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(13) },
    rejectBtn: { backgroundColor: '#FFF1F0', borderWidth: 1, borderColor: '#FFCCC7' },
    rejectBtnText: { color: theme.palette.status.error, fontWeight: '600', fontSize: moderateScale(13) },
});

export default AdminDoctors;
