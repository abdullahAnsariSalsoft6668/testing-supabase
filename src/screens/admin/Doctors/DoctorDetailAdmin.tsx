import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
// ActivityIndicator still used on action buttons (approve/reject spinners)
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { DetailSkeleton, HealthScreenHeader, StatusBadge } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { getDoctorById, updateDoctorStatus } from '@/services/doctorService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor } from '@/types/database';

type InfoRowProps = { icon: React.ReactNode; label: string; value?: string | null };
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>{icon}</View>
            <View style={styles.infoContent}>
                <TextComp text={label} style={styles.infoLabel} />
                <TextComp text={value} style={styles.infoValue} />
            </View>
        </View>
    );
};

const DoctorDetailAdmin = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'DoctorDetailAdmin'>>();
    const navigation = useNavigation();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [actingStatus, setActingStatus] = useState<string | null>(null);

    useEffect(() => {
        getDoctorById(route.params.doctorId)
            .then(setDoctor)
            .finally(() => setLoading(false));
    }, [route.params.doctorId]);

    const setStatus = async (status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        setActingStatus(status);
        try {
            await updateDoctorStatus(route.params.doctorId, status);
            Toast.show({ type: 'success', text1: `Doctor ${status.toLowerCase()}` });
            navigation.goBack();
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Action failed', text2: String(e) });
        } finally {
            setActingStatus(null);
        }
    };

    const BackBtn = (
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MyIcons name="arrowChevron" size={16} stroke={theme.colors.text.inverse} />
            <TextComp text="Back" style={styles.backBtnText} />
        </Pressable>
    );

    const name = doctor ? getUserDisplayName(doctor.users, doctor.specialization || 'Doctor') : '';
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

    return (
        <View style={styles.screen}>
            <HealthScreenHeader title="Doctor Details" subtitle="Review profile" rightAction={BackBtn} />
            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {loading || !doctor ? (
                    <DetailSkeleton rows={5} />
                ) : (
                    <>
                        {/* Profile hero */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarLarge}>
                                <TextComp text={initials} style={styles.avatarText} />
                            </View>
                            <TextComp text={name} style={styles.profileName} />
                            <TextComp text={doctor.specialization} style={styles.profileSpec} />
                            <View style={styles.badgeRow}>
                                <StatusBadge status={doctor.status} type="doctor" />
                            </View>
                        </View>

                        {/* Info rows */}
                        <View style={styles.infoCard}>
                            <InfoRow
                                icon={<MyIcons name="licenseIcon" size={16} stroke={theme.palette.teal.main} />}
                                label="Qualification"
                                value={doctor.qualification}
                            />
                            <InfoRow
                                icon={<MyIcons name="documentIcon" size={16} stroke={theme.palette.teal.main} />}
                                label="License Number"
                                value={doctor.license_number}
                            />
                            <InfoRow
                                icon={<MyIcons name="healthTabHospital" size={16} stroke={theme.palette.teal.main} />}
                                label="Hospital"
                                value={doctor.hospitals?.name}
                            />
                            <InfoRow
                                icon={<MyIcons name="healthTabDepartments" size={16} stroke={theme.palette.teal.main} />}
                                label="Department"
                                value={doctor.departments?.name}
                            />
                            <InfoRow
                                icon={<MyIcons name="coin" size={16} stroke={theme.palette.teal.main} />}
                                label="Consultation Fee"
                                value={doctor.consultation_fee != null ? `$${doctor.consultation_fee}` : null}
                            />
                            {doctor.bio ? (
                                <View style={[styles.infoRow, styles.bioRow]}>
                                    <View style={styles.infoIconWrap}>
                                        <MyIcons name="documentIcon" size={16} stroke={theme.palette.teal.main} />
                                    </View>
                                    <View style={styles.infoContent}>
                                        <TextComp text="Bio" style={styles.infoLabel} />
                                        <TextComp text={doctor.bio} style={styles.bioText} />
                                    </View>
                                </View>
                            ) : null}
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionsSection}>
                            {doctor.status !== 'APPROVED' ? (
                                <Pressable
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => setStatus('APPROVED')}
                                    disabled={!!actingStatus}
                                >
                                    {actingStatus === 'APPROVED' ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <MyIcons name="checkVerified" size={16} stroke="#fff" />
                                            <TextComp text="Approve" style={styles.approveBtnText} />
                                        </>
                                    )}
                                </Pressable>
                            ) : null}

                            {doctor.status !== 'SUSPENDED' ? (
                                <Pressable
                                    style={[styles.actionBtn, styles.suspendBtn]}
                                    onPress={() => setStatus('SUSPENDED')}
                                    disabled={!!actingStatus}
                                >
                                    {actingStatus === 'SUSPENDED' ? (
                                        <ActivityIndicator size="small" color="#E67700" />
                                    ) : (
                                        <>
                                            <MyIcons name="timeIcon" size={16} stroke="#E67700" />
                                            <TextComp text="Suspend" style={styles.suspendBtnText} />
                                        </>
                                    )}
                                </Pressable>
                            ) : null}

                            {doctor.status !== 'REJECTED' ? (
                                <Pressable
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => setStatus('REJECTED')}
                                    disabled={!!actingStatus}
                                >
                                    {actingStatus === 'REJECTED' ? (
                                        <ActivityIndicator size="small" color={theme.palette.status.error} />
                                    ) : (
                                        <>
                                            <MyIcons name="close" size={14} stroke={theme.palette.status.error} />
                                            <TextComp text="Reject" style={styles.rejectBtnText} />
                                        </>
                                    )}
                                </Pressable>
                            ) : null}
                        </View>
                    </>
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
        gap: moderateScale(14),
    },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        paddingHorizontal: moderateScale(4),
    },
    backBtnText: {
        color: theme.colors.text.inverse,
        fontSize: moderateScale(14),
        fontWeight: '600',
    },

    /* Profile hero card */
    profileCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(24),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    avatarLarge: {
        width: moderateScale(72),
        height: moderateScale(72),
        borderRadius: moderateScale(36),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(12),
        borderWidth: 2,
        borderColor: theme.palette.teal.main,
    },
    avatarText: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: theme.palette.teal.main,
    },
    profileName: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
    profileSpec: {
        fontSize: moderateScale(13),
        color: theme.palette.teal.main,
        fontWeight: '500',
        marginTop: moderateScale(4),
    },
    badgeRow: { marginTop: moderateScale(10) },

    /* Info card */
    infoCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.default,
        gap: moderateScale(12),
    },
    bioRow: { alignItems: 'flex-start' },
    infoIconWrap: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(8),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    infoContent: { flex: 1 },
    infoLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: moderateScale(2),
    },
    infoValue: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    bioText: {
        fontSize: moderateScale(13),
        color: theme.colors.text.primary,
        lineHeight: moderateScale(20),
    },

    /* Actions */
    actionsSection: { gap: moderateScale(10) },
    actionBtn: {
        flexDirection: 'row',
        paddingVertical: moderateScale(14),
        borderRadius: theme.radius.button,
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    approveBtn: { backgroundColor: theme.palette.teal.main },
    approveBtnText: { color: '#fff', fontWeight: '700', fontSize: moderateScale(15) },
    suspendBtn: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFD08A' },
    suspendBtnText: { color: '#E67700', fontWeight: '600', fontSize: moderateScale(15) },
    rejectBtn: { backgroundColor: '#FFF1F0', borderWidth: 1, borderColor: '#FFCCC7' },
    rejectBtnText: { color: theme.palette.status.error, fontWeight: '600', fontSize: moderateScale(15) },
});

export default DoctorDetailAdmin;
