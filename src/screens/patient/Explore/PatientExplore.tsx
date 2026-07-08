import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    CardListSkeleton,
    DoctorCard,
    EmptyState,
    HealthScreenHeader,
} from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { PatientStackParamList } from '@/navigation/types';
import { listApprovedDoctors } from '@/services/doctorService';
import { listHospitals } from '@/services/hospitalService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor, Hospital } from '@/types/database';

type ExploreTab = 'hospitals' | 'doctors';

const TABS: { key: ExploreTab; label: string }[] = [
    { key: 'hospitals', label: 'Hospitals' },
    { key: 'doctors', label: 'Doctors' },
];

const matchesQuery = (query: string, ...values: (string | null | undefined)[]) => {
    if (!query) return true;
    const haystack = values.filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(query);
};

const PatientExplore = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState<ExploreTab>('hospitals');
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!hasFetchedRef.current) setLoading(true);
        Promise.all([listHospitals(), listApprovedDoctors()])
            .then(([hospitalRows, doctorRows]) => {
                setHospitals(hospitalRows);
                setDoctors(doctorRows);
            })
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const query = search.trim().toLowerCase();

    const filteredHospitals = useMemo(
        () =>
            hospitals.filter((h) =>
                matchesQuery(query, h.name, h.address, h.description, h.phone, h.email),
            ),
        [hospitals, query],
    );

    const filteredDoctors = useMemo(
        () =>
            doctors.filter((d) => {
                const name = getUserDisplayName(d.users, '');
                return matchesQuery(
                    query,
                    name,
                    d.specialization,
                    d.qualification,
                    d.hospitals?.name,
                    d.departments?.name,
                );
            }),
        [doctors, query],
    );

    const activeList = tab === 'hospitals' ? filteredHospitals : filteredDoctors;
    const totalCount = tab === 'hospitals' ? hospitals.length : doctors.length;
    const resultLabel = tab === 'hospitals' ? 'hospital' : 'doctor';

    const headerContent = (
        <>
            <View style={styles.searchWrap}>
                <MyIcons name="healthTabSearch" size={18} stroke={theme.colors.text.secondary} />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={tab === 'hospitals' ? 'Search hospitals…' : 'Search doctors…'}
                    placeholderTextColor={theme.colors.text.secondary}
                    style={styles.searchInput}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {search.length > 0 ? (
                    <Pressable onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <MyIcons name="close" size={16} stroke={theme.colors.text.secondary} />
                    </Pressable>
                ) : null}
            </View>

            <View style={styles.tabRow}>
                {TABS.map(({ key, label }) => (
                    <Pressable
                        key={key}
                        style={[styles.tab, tab === key && styles.tabActive]}
                        onPress={() => setTab(key)}
                    >
                        <MyIcons
                            name={key === 'hospitals' ? 'healthTabHospital' : 'healthTabDoctors'}
                            size={15}
                            stroke={tab === key ? theme.palette.teal.main : 'rgba(255,255,255,0.85)'}
                        />
                        <TextComp
                            text={label}
                            style={[styles.tabText, tab === key && styles.tabTextActive]}
                        />
                    </Pressable>
                ))}
            </View>
        </>
    );

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title="Explore"
                subtitle="Find hospitals and specialists near you"
            >
                {headerContent}
            </HealthScreenHeader>

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {!loading && totalCount > 0 ? (
                    <View style={styles.statsBar}>
                        <TextComp
                            text={String(activeList.length)}
                            style={styles.statValue}
                        />
                        <TextComp
                            text={
                                query
                                    ? `${resultLabel}${activeList.length === 1 ? '' : 's'} found`
                                    : `${resultLabel}${totalCount === 1 ? '' : 's'} available`
                            }
                            style={styles.statLabel}
                        />
                    </View>
                ) : null}

                {loading ? (
                    <CardListSkeleton count={4} />
                ) : totalCount === 0 ? (
                    <EmptyState
                        title={tab === 'hospitals' ? 'No hospitals yet' : 'No doctors yet'}
                        message={
                            tab === 'hospitals'
                                ? 'Healthcare facilities will appear here once registered.'
                                : 'Approved specialists will appear here once available.'
                        }
                    />
                ) : activeList.length === 0 ? (
                    <EmptyState
                        title="No results"
                        message={`Try a different search term or switch to ${tab === 'hospitals' ? 'Doctors' : 'Hospitals'}.`}
                    />
                ) : tab === 'hospitals' ? (
                    filteredHospitals.map((h) => (
                        <Pressable
                            key={h.id}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate(routes.patient.hospitalDepartments, {
                                    hospitalId: h.id,
                                    hospitalName: h.name,
                                })
                            }
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.avatar}>
                                    <MyIcons name="healthTabHospital" size={22} stroke={theme.palette.teal.main} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <TextComp text={h.name} style={styles.cardTitle} numberOfLines={1} />
                                    {h.address ? (
                                        <View style={styles.metaRow}>
                                            <MyIcons name="locationIcon" size={13} stroke={theme.colors.text.secondary} />
                                            <TextComp text={h.address} style={styles.cardMeta} numberOfLines={2} />
                                        </View>
                                    ) : null}
                                    {h.description ? (
                                        <TextComp
                                            text={h.description}
                                            style={styles.cardDesc}
                                            numberOfLines={2}
                                        />
                                    ) : null}
                                </View>
                                <MyIcons name="rightArrow" size={16} stroke={theme.colors.text.secondary} />
                            </View>
                            <View style={styles.cardFooter}>
                                <TextComp text="Browse departments" style={styles.cardAction} />
                            </View>
                        </Pressable>
                    ))
                ) : (
                    filteredDoctors.map((d) => (
                        <DoctorCard
                            key={d.id}
                            doctor={d}
                            onPress={() =>
                                navigation.navigate(routes.patient.doctorDetail, { doctorId: d.id })
                            }
                        />
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

    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.primary,
        borderRadius: moderateScale(12),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(10),
        gap: moderateScale(10),
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        padding: 0,
    },

    tabRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(6),
        paddingVertical: moderateScale(9),
        borderRadius: moderateScale(10),
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    tabActive: {
        backgroundColor: theme.colors.background.primary,
        borderColor: theme.colors.background.primary,
    },
    tabText: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    tabTextActive: {
        color: theme.palette.teal.main,
    },

    statsBar: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: moderateScale(8),
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(16),
        marginBottom: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    statValue: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: theme.colors.brand.primary,
    },
    statLabel: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
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
        alignItems: 'center',
        padding: moderateScale(16),
        gap: moderateScale(12),
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
        alignItems: 'flex-start',
        marginTop: moderateScale(4),
        gap: moderateScale(4),
    },
    cardMeta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        flex: 1,
    },
    cardDesc: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(6),
        lineHeight: moderateScale(18),
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.default,
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(16),
        backgroundColor: theme.palette.teal.surface,
    },
    cardAction: {
        fontSize: moderateScale(13),
        fontWeight: '600',
        color: theme.palette.teal.main,
        textAlign: 'center',
    },
});

export default PatientExplore;
