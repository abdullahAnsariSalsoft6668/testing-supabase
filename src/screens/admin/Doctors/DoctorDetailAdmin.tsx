import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

import { DetailSkeleton, HealthScreenHeader, StatusBadge } from '@/components/health';
import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { AdminStackParamList } from '@/navigation/types';
import { getDoctorById, updateDoctorStatus } from '@/services/doctorService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { TAB_ACTIVE_COLOR } from '@/navigation/tabBarStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getDoctorImageSource } from '@/utils/doctorImage';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Doctor, DoctorStatus } from '@/types/database';

const ICON_COLOR = theme.palette.teal.main;

type DetailRow = { icon: IconName; label: string; value?: string | null };

const STATUS_HINTS: Record<DoctorStatus, { title: string; body: string; tone: string; bg: string }> = {
    PENDING: {
        title: 'Awaiting your review',
        body: 'Approve this doctor to let them manage appointments and schedules.',
        tone: theme.palette.status.warning,
        bg: theme.palette.status.warning + '14',
    },
    APPROVED: {
        title: 'Active doctor',
        body: 'This doctor can accept appointments and manage their schedule.',
        tone: theme.palette.green.main,
        bg: theme.palette.green.surface,
    },
    REJECTED: {
        title: 'Application rejected',
        body: 'This doctor cannot access the platform until re-approved.',
        tone: theme.palette.status.error,
        bg: theme.palette.status.error + '10',
    },
    SUSPENDED: {
        title: 'Account suspended',
        body: 'This doctor is temporarily blocked from the platform.',
        tone: theme.palette.status.warning,
        bg: theme.palette.status.warning + '14',
    },
};

const SectionCard: React.FC<{ title: string; rows: DetailRow[] }> = ({ title, rows }) => {
    const visible = rows.filter((r) => r.value);
    if (visible.length === 0) return null;

    return (
        <View style={styles.sectionCard}>
            <TextComp text={title} style={styles.sectionTitle} />
            {visible.map((row, i) => (
                <View key={row.label}>
                    {i > 0 ? <View style={styles.rowDivider} /> : null}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIcon}>
                            <MyIcons name={row.icon} size={17} stroke={ICON_COLOR} />
                        </View>
                        <View style={styles.detailContent}>
                            <TextComp text={row.label} style={styles.detailLabel} />
                            <TextComp text={row.value!} style={styles.detailValue} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

type ActionButtonProps = {
    label: string;
    icon: IconName;
    onPress: () => void;
    loading: boolean;
    variant: 'approve' | 'suspend' | 'reject';
    inRow?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({ label, icon, onPress, loading, variant, inRow }) => {
    const btnStyle =
        variant === 'approve'
            ? s.approveBtn
            : variant === 'suspend'
              ? styles.suspendBtn
              : s.rejectBtn;
    const textStyle =
        variant === 'approve'
            ? s.approveBtnText
            : variant === 'suspend'
              ? styles.suspendBtnText
              : s.rejectBtnText;
    const spinnerColor =
        variant === 'approve'
            ? theme.colors.text.inverse
            : variant === 'suspend'
              ? theme.palette.teal.main
              : theme.palette.status.error;
    const iconColor =
        variant === 'approve'
            ? theme.colors.text.inverse
            : variant === 'suspend'
              ? theme.palette.teal.main
              : theme.palette.status.error;

    return (
        <Pressable
            style={[s.actionBtn, btnStyle, styles.actionBtn, inRow ? styles.actionBtnRow : styles.actionBtnFull]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color={spinnerColor} />
            ) : (
                <>
                    <MyIcons name={icon} size={17} stroke={iconColor} />
                    <TextComp text={label} style={textStyle} />
                </>
            )}
        </Pressable>
    );
};

const DoctorDetailAdmin = () => {
    const route = useRoute<RouteProp<AdminStackParamList, 'DoctorDetailAdmin'>>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
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

    const name = doctor ? getUserDisplayName(doctor.users, doctor.specialization || 'Doctor') : '';
    const experienceLabel =
        doctor?.experience != null && doctor.experience > 0 ? `${doctor.experience} yrs` : null;
    const feeLabel =
        doctor?.consultation_fee != null ? `$${doctor.consultation_fee}` : null;
    const statusHint = doctor ? STATUS_HINTS[doctor.status] : null;

    const showApprove = doctor && doctor.status !== 'APPROVED';
    const showSuspend = doctor && doctor.status !== 'SUSPENDED';
    const showReject = doctor && doctor.status !== 'REJECTED';
    const hasActions = !!(showApprove || showSuspend || showReject);

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title="Doctor Profile"
                subtitle="Review credentials & take action"
                onBack={() => navigation.goBack()}
            />

            {loading || !doctor ? (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + moderateScale(24) }]}
                    showsVerticalScrollIndicator={false}
                >
                    <DetailSkeleton rows={5} />
                </ScrollView>
            ) : (
                <>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={[styles.body, { paddingBottom: moderateScale(16) }]}
                        showsVerticalScrollIndicator={false}
                    >
                        {statusHint ? (
                            <View style={[styles.statusBanner, { backgroundColor: statusHint.bg, borderColor: statusHint.tone + '33' }]}>
                                <View style={[styles.statusDot, { backgroundColor: statusHint.tone }]} />
                                <View style={styles.statusBannerText}>
                                    <TextComp text={statusHint.title} style={[styles.statusBannerTitle, { color: statusHint.tone }]} />
                                    <TextComp text={statusHint.body} style={styles.statusBannerBody} />
                                </View>
                            </View>
                        ) : null}

                        <View style={styles.profileCard}>
                            <LinearGradient
                                colors={[...theme.gradients.header]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.profileGradient}
                            />
                            <View style={styles.profileBody}>
                                <View style={styles.avatarWrap}>
                                    <Image
                                        source={getDoctorImageSource(doctor.id, doctor.users?.profile_image)}
                                        style={styles.avatarImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.badgeFloating}>
                                        <StatusBadge status={doctor.status} type="doctor" />
                                    </View>
                                </View>
                                <TextComp text={name} style={styles.profileName} />
                                <TextComp text={doctor.specialization} style={styles.profileSpec} />

                                <View style={styles.chipRow}>
                                    {experienceLabel ? (
                                        <View style={styles.chip}>
                                            <MyIcons name="healthTabCalendar" size={13} stroke={TAB_ACTIVE_COLOR} />
                                            <TextComp text={experienceLabel} style={styles.chipText} />
                                        </View>
                                    ) : null}
                                    {feeLabel ? (
                                        <View style={styles.chip}>
                                            <MyIcons name="coin" size={13} stroke={theme.palette.teal.main} />
                                            <TextComp text={feeLabel} style={styles.chipText} />
                                        </View>
                                    ) : null}
                                    {doctor.hospitals?.name ? (
                                        <View style={styles.chip}>
                                            <MyIcons name="healthTabHospital" size={13} stroke={theme.palette.teal.main} />
                                            <TextComp text={doctor.hospitals.name} style={styles.chipText} numberOfLines={1} />
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        <SectionCard
                            title="Credentials"
                            rows={[
                                { icon: 'healthTabDoctors', label: 'Specialization', value: doctor.specialization },
                                { icon: 'licenseIcon', label: 'Qualification', value: doctor.qualification },
                                { icon: 'healthTabCalendar', label: 'Experience', value: experienceLabel },
                                { icon: 'documentIcon', label: 'License Number', value: doctor.license_number },
                            ]}
                        />

                        <SectionCard
                            title="Affiliation"
                            rows={[
                                { icon: 'healthTabHospital', label: 'Hospital', value: doctor.hospitals?.name },
                                { icon: 'healthTabDepartments', label: 'Department', value: doctor.departments?.name },
                                { icon: 'coin', label: 'Consultation Fee', value: feeLabel },
                            ]}
                        />

                        <SectionCard
                            title="Contact"
                            rows={[
                                { icon: 'emailIcon', label: 'Email', value: doctor.users?.email },
                                { icon: 'phoneIcon', label: 'Phone', value: doctor.users?.phone },
                            ]}
                        />

                        {doctor.bio ? (
                            <View style={styles.sectionCard}>
                                <TextComp text="About" style={styles.sectionTitle} />
                                <TextComp text={doctor.bio} style={styles.bioText} />
                            </View>
                        ) : null}
                    </ScrollView>

                    {hasActions ? (
                        <View style={[styles.actionBar, { paddingBottom: insets.bottom + moderateScale(12) }]}>
                            {showApprove && showReject ? (
                                <View style={styles.actionRow}>
                                    <ActionButton
                                        label="Approve"
                                        icon="greenCircleCheck"
                                        variant="approve"
                                        inRow
                                        onPress={() => setStatus('APPROVED')}
                                        loading={actingStatus === 'APPROVED'}
                                    />
                                    <ActionButton
                                        label="Reject"
                                        icon="healthTabClose"
                                        variant="reject"
                                        inRow
                                        onPress={() => setStatus('REJECTED')}
                                        loading={actingStatus === 'REJECTED'}
                                    />
                                </View>
                            ) : showApprove ? (
                                <ActionButton
                                    label="Approve Doctor"
                                    icon="greenCircleCheck"
                                    variant="approve"
                                    onPress={() => setStatus('APPROVED')}
                                    loading={actingStatus === 'APPROVED'}
                                />
                            ) : showReject ? (
                                <ActionButton
                                    label="Reject"
                                    icon="healthTabClose"
                                    variant="reject"
                                    onPress={() => setStatus('REJECTED')}
                                    loading={actingStatus === 'REJECTED'}
                                />
                            ) : null}

                            {showSuspend ? (
                                <ActionButton
                                    label="Suspend Account"
                                    icon="tabClock"
                                    variant="suspend"
                                    onPress={() => setStatus('SUSPENDED')}
                                    loading={actingStatus === 'SUSPENDED'}
                                />
                            ) : null}
                        </View>
                    ) : null}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background.secondary,
    },
    scroll: { flex: 1 },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(16),
        gap: moderateScale(14),
    },

    statusBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(10),
        padding: moderateScale(14),
        borderRadius: theme.radius.card,
        borderWidth: 1,
    },
    statusDot: {
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        marginTop: moderateScale(5),
    },
    statusBannerText: { flex: 1 },
    statusBannerTitle: { fontSize: moderateScale(13), fontWeight: '700' },
    statusBannerBody: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(3),
        lineHeight: moderateScale(18),
    },

    profileCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    profileGradient: { height: moderateScale(72) },
    profileBody: {
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(20),
        marginTop: moderateScale(-36),
    },
    avatarWrap: { position: 'relative', marginBottom: moderateScale(10) },
    avatarImage: {
        width: moderateScale(76),
        height: moderateScale(76),
        borderRadius: moderateScale(38),
        backgroundColor: theme.colors.card.background,
        borderWidth: 3,
        borderColor: theme.colors.card.background,
        ...theme.shadows.card,
    },
    badgeFloating: {
        position: 'absolute',
        bottom: moderateScale(-4),
        alignSelf: 'center',
    },
    profileName: {
        fontSize: moderateScale(20),
        fontWeight: '800',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
    profileSpec: {
        fontSize: moderateScale(14),
        color: theme.palette.teal.main,
        fontWeight: '600',
        marginTop: moderateScale(4),
        textAlign: 'center',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: moderateScale(8),
        marginTop: moderateScale(14),
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(5),
        backgroundColor: theme.palette.teal.surface,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(6),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
        maxWidth: '100%',
    },
    chipText: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: theme.palette.teal.dark,
    },

    sectionCard: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        padding: moderateScale(16),
        ...theme.shadows.card,
    },
    sectionTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: moderateScale(12),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        paddingVertical: moderateScale(4),
    },
    detailIcon: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(10),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '22',
    },
    detailContent: { flex: 1 },
    detailLabel: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    detailValue: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        fontWeight: '600',
        marginTop: moderateScale(2),
    },
    rowDivider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
        marginVertical: moderateScale(10),
    },
    bioText: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        lineHeight: moderateScale(22),
    },

    actionBar: {
        backgroundColor: theme.colors.card.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.default,
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(12),
        gap: moderateScale(10),
        ...theme.shadows.card,
    },
    actionRow: { flexDirection: 'row', gap: moderateScale(10) },
    actionBtn: {
        paddingVertical: moderateScale(14),
        borderRadius: theme.radius.button,
    },
    actionBtnFull: {
        flex: 0,
        width: '100%',
    },
    actionBtnRow: {
        flex: 1,
    },
    suspendBtn: {
        backgroundColor: theme.palette.teal.surface,
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    suspendBtnText: {
        color: theme.palette.teal.main,
        fontWeight: '600',
        fontSize: moderateScale(15),
    },
});

export default DoctorDetailAdmin;
