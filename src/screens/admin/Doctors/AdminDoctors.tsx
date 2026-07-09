import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { AdminFilterChips } from '@/components/admin/AdminUI';
import { CardListSkeleton, EmptyState, HealthScreenHeader, StatusBadge } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AdminStackParamList } from '@/navigation/types';
import { listDoctorsByStatus, updateDoctorStatus } from '@/services/doctorService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { doctorStatusStyles } from '@/styles/healthStatus';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { formatErrorMessage } from '@/utils/formatError';
import { getDoctorImageSource } from '@/utils/doctorImage';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor, DoctorStatus } from '@/types/database';

type DoctorFilter = 'ALL' | DoctorStatus;

const FILTER_TABS = [
    {
        key: 'ALL' as DoctorFilter,
        label: 'All',
        icon: 'healthTabDoctors' as const,
        accent: theme.palette.teal.main,
        surface: theme.palette.teal.surface,
    },
    {
        key: 'PENDING' as DoctorFilter,
        label: 'Pending',
        icon: 'healthTabCalendar' as const,
        accent: theme.palette.status.pending,
        surface: '#FFF4E6',
    },
    {
        key: 'APPROVED' as DoctorFilter,
        label: 'Approved',
        icon: 'greenCircleCheck' as const,
        accent: theme.palette.teal.main,
        surface: theme.palette.teal.surface,
    },
    {
        key: 'SUSPENDED' as DoctorFilter,
        label: 'Suspended',
        icon: 'tabClock' as const,
        accent: theme.palette.status.noShow,
        surface: theme.palette.neutral.gray100,
    },
    {
        key: 'REJECTED' as DoctorFilter,
        label: 'Rejected',
        icon: 'healthTabClose' as const,
        accent: theme.palette.status.error,
        surface: '#FFE3E3',
    },
];

const FILTER_LABELS: Record<DoctorFilter, string> = {
    ALL: 'all',
    PENDING: 'pending',
    APPROVED: 'approved',
    SUSPENDED: 'suspended',
    REJECTED: 'rejected',
};

const AdminDoctors = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<DoctorFilter>('PENDING');
    const [actingId, setActingId] = useState<string | null>(null);
    const hasFetchedRef = useRef(false);

    const load = useCallback((statusFilter: DoctorFilter) => {
        if (!hasFetchedRef.current) setLoading(true);
        listDoctorsByStatus(statusFilter === 'ALL' ? undefined : statusFilter)
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

    const changeFilter = (status: DoctorFilter) => {
        hasFetchedRef.current = false;
        setFilter(status);
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

    return (
        <View style={s.screen}>
            <HealthScreenHeader title="Doctors" subtitle="Review and manage registrations" />

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <AdminFilterChips tabs={FILTER_TABS} active={filter} onChange={changeFilter} />

                {!loading && doctors.length > 0 ? (
                    <View style={styles.resultBar}>
                        <TextComp
                            text={`${doctors.length} ${FILTER_LABELS[filter]} doctor${doctors.length === 1 ? '' : 's'}`}
                            style={styles.resultText}
                        />
                    </View>
                ) : null}

                {loading ? (
                    <CardListSkeleton count={4} />
                ) : doctors.length === 0 ? (
                    <EmptyState
                        title={`No ${FILTER_LABELS[filter]} doctors`}
                        message="Doctors matching this filter will appear here."
                    />
                ) : (
                    doctors.map((d) => {
                        const name = getUserDisplayName(d.users, d.specialization || 'Doctor');
                        const statusStyle = doctorStatusStyles[d.status];

                        return (
                            <Pressable
                                key={d.id}
                                style={[styles.doctorCard, { borderLeftColor: statusStyle.text }]}
                                onPress={() =>
                                    navigation.navigate(routes.admin.doctorDetailAdmin, { doctorId: d.id })
                                }
                            >
                                <View style={styles.cardTop}>
                                    <Image
                                        source={getDoctorImageSource(d.id, d.users?.profile_image)}
                                        style={styles.doctorImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cardInfo}>
                                        <TextComp text={name} style={s.cardTitle} numberOfLines={1} />
                                        {d.specialization ? (
                                            <TextComp text={d.specialization} style={styles.specText} />
                                        ) : null}
                                        <View style={styles.statusRow}>
                                            <StatusBadge status={d.status} type="doctor" />
                                        </View>
                                    </View>
                                    <MyIcons name="rightChevron" size={16} stroke={theme.colors.text.muted} />
                                </View>

                                <View style={styles.metaBlock}>
                                    {d.qualification ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="licenseIcon" size={12} stroke={theme.colors.text.secondary} />
                                            <TextComp text={d.qualification} style={styles.metaText} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                    {d.hospitals?.name ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="healthTabHospital" size={12} stroke={theme.colors.text.secondary} />
                                            <TextComp text={d.hospitals.name} style={styles.metaText} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                    {d.departments?.name ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="healthTabDepartments" size={12} stroke={theme.colors.text.secondary} />
                                            <TextComp text={d.departments.name} style={styles.metaText} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                </View>

                                {d.status === 'PENDING' ? (
                                    <>
                                        <View style={s.divider} />
                                        <View style={s.actions}>
                                            <Pressable
                                                style={[s.actionBtn, s.approveBtn]}
                                                onPress={() => setStatus(d.id, 'APPROVED')}
                                                disabled={actingId === d.id}
                                            >
                                                {actingId === d.id ? (
                                                    <ActivityIndicator size="small" color={theme.colors.text.inverse} />
                                                ) : (
                                                    <>
                                                        <MyIcons name="greenCircleCheck" size={14} stroke={theme.colors.text.inverse} />
                                                        <TextComp text="Approve" style={s.approveBtnText} />
                                                    </>
                                                )}
                                            </Pressable>
                                            <Pressable
                                                style={[s.actionBtn, s.rejectBtn]}
                                                onPress={() => setStatus(d.id, 'REJECTED')}
                                                disabled={actingId === d.id}
                                            >
                                                <MyIcons name="healthTabClose" size={13} stroke={theme.palette.status.error} />
                                                <TextComp text="Reject" style={s.rejectBtnText} />
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
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        paddingBottom: moderateScale(120),
        gap: moderateScale(12),
    },
    resultBar: {
        paddingVertical: moderateScale(4),
    },
    resultText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    doctorCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        borderLeftWidth: 4,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: moderateScale(14),
        gap: moderateScale(12),
    },
    doctorImage: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: theme.palette.teal.surface,
        borderWidth: 2,
        borderColor: theme.palette.teal.main + '33',
    },
    cardInfo: { flex: 1, gap: moderateScale(4) },
    specText: {
        fontSize: moderateScale(13),
        color: theme.palette.teal.main,
        fontWeight: '500',
    },
    statusRow: {
        marginTop: moderateScale(4),
        alignSelf: 'flex-start',
    },
    metaBlock: {
        paddingHorizontal: moderateScale(14),
        paddingBottom: moderateScale(14),
        gap: moderateScale(6),
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    metaText: {
        flex: 1,
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
    },
});

export default AdminDoctors;
