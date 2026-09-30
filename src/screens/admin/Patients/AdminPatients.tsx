import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { CardListSkeleton, EmptyState, HealthScreenHeader } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { listPatients } from '@/services/patientService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { formatErrorMessage } from '@/utils/formatError';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Patient } from '@/types/database';

const AdminPatients = () => {
    const navigation = useNavigation();
    const user = useSelector((st) => st.auth.userData) as AuthUserProfile;
    const hospitalId = user?.role === 'HOSPITAL_ADMIN' ? user.hospital_id ?? null : null;
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!hasFetchedRef.current) setLoading(true);
        listPatients(hospitalId)
            .then(setPatients)
            .catch((e) => {
                setPatients([]);
                Toast.show({ type: 'error', text1: 'Failed to load patients', text2: formatErrorMessage(e) });
            })
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, [hospitalId]);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const clinicName = user?.hospital?.name;

    return (
        <View style={s.screen}>
            <HealthScreenHeader
                title="Patients"
                subtitle={clinicName ? `Registered at ${clinicName}` : 'Patients by hospital'}
                onBack={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                {!loading && patients.length > 0 ? (
                    <View style={styles.resultBar}>
                        <TextComp
                            text={`${patients.length} patient${patients.length === 1 ? '' : 's'}`}
                            style={styles.resultText}
                        />
                    </View>
                ) : null}
                {loading ? (
                    <CardListSkeleton count={4} />
                ) : patients.length === 0 ? (
                    <EmptyState
                        title="No patients yet"
                        message="People who join this hospital will appear here."
                    />
                ) : (
                    patients.map((p) => {
                        const name = getUserDisplayName(p.users, 'Patient');
                        return (
                            <View key={p.id} style={styles.card}>
                                <View style={styles.avatar}>
                                    <TextComp text={name.slice(0, 1).toUpperCase()} style={styles.avatarText} />
                                </View>
                                <View style={styles.info}>
                                    <TextComp text={name} style={s.cardTitle} numberOfLines={1} />
                                    {p.users?.email ? (
                                        <TextComp text={p.users.email} style={styles.meta} numberOfLines={1} />
                                    ) : null}
                                    <View style={styles.metaRow}>
                                        <MyIcons name="healthTabHospital" size={12} stroke={theme.colors.text.secondary} />
                                        <TextComp
                                            text={p.hospitals?.name ?? clinicName ?? 'Hospital not set'}
                                            style={styles.meta}
                                            numberOfLines={1}
                                        />
                                    </View>
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
    resultBar: { paddingVertical: moderateScale(4) },
    resultText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        padding: moderateScale(14),
        ...theme.shadows.card,
    },
    avatar: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },
    info: { flex: 1, gap: moderateScale(4) },
    meta: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
});

export default AdminPatients;
