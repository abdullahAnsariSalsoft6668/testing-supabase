import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { AdminInfoRow } from '@/components/admin/AdminUI';
import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { AdminStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { listDoctorsByStatus } from '@/services/doctorService';
import { listDepartments, listHospitals } from '@/services/hospitalService';
import { adminScreenStyles as s } from '@/styles/adminScreenStyles';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getLocalDateIso } from '@/utils/date';
import { getSupabase } from '@/utils/supabase';

type StatItem = { key: string; value: number; label: string };

const getDayGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

type QuickLinkProps = {
    icon: IconName;
    title: string;
    subtitle: string;
    accent: string;
    surface: string;
    onPress: () => void;
    badge?: number;
};

const QuickLink: React.FC<QuickLinkProps> = ({ icon, title, subtitle, accent, surface, onPress, badge }) => (
    <Pressable style={styles.quickLink} onPress={onPress}>
        <View style={[styles.quickLinkIcon, { backgroundColor: surface }]}>
            <MyIcons name={icon} size={22} stroke={accent} />
        </View>
        <View style={styles.quickLinkText}>
            <TextComp text={title} style={styles.quickLinkTitle} />
            <TextComp text={subtitle} style={styles.quickLinkSubtitle} />
        </View>
        {badge ? (
            <View style={styles.quickLinkBadge}>
                <TextComp text={String(badge)} style={styles.quickLinkBadgeText} />
            </View>
        ) : null}
        <MyIcons name="rightChevron" size={14} stroke={theme.colors.text.muted} />
    </Pressable>
);

const AdminDashboard = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
    const user = useSelector((st) => st.auth.userData) as AuthUserProfile;
    const insets = useSafeAreaInsets();
    const [stats, setStats] = useState({ hospitals: 0, departments: 0, pendingDoctors: 0, todayAppts: 0 });
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (!hasFetchedRef.current) setLoading(true);
            const today = getLocalDateIso();
            Promise.all([
                listHospitals(),
                listDepartments(),
                listDoctorsByStatus('PENDING'),
                getSupabase()
                    .from('appointments')
                    .select('*', { count: 'exact', head: true })
                    .eq('appointment_date', today),
            ])
                .then(([hospitals, departments, pending, appts]) => {
                    setStats({
                        hospitals: hospitals.length,
                        departments: departments.length,
                        pendingDoctors: pending.length,
                        todayAppts: appts.count ?? 0,
                    });
                })
                .finally(() => {
                    setLoading(false);
                    hasFetchedRef.current = true;
                });
        }, []),
    );

    const firstName = user.full_name?.split(' ')[0] ?? 'Admin';
    const initials = (user.full_name ?? 'A')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    const statItems: StatItem[] = [
        { key: 'hospitals', value: stats.hospitals, label: 'Hospitals' },
        { key: 'departments', value: stats.departments, label: 'Departments' },
        { key: 'pending', value: stats.pendingDoctors, label: 'Pending' },
        { key: 'today', value: stats.todayAppts, label: 'Today' },
    ];

    return (
        <View style={s.screen}>
            <LinearGradient
                colors={[...theme.gradients.header]}
                style={[styles.hero, { paddingTop: insets.top + moderateScale(16) }]}
            >
                <View style={styles.heroRow}>
                    <View style={styles.heroText}>
                        <TextComp text={getDayGreeting()} style={styles.greetSub} />
                        <TextComp text={firstName} style={styles.greetName} />
                        <View style={styles.heroBadge}>
                            <MyIcons name="greenCircleCheck" size={12} stroke={theme.colors.text.inverse} />
                            <TextComp text="Administrator" style={styles.heroBadgeText} />
                        </View>
                    </View>
                    <View style={styles.avatar}>
                        <TextComp text={initials} style={styles.avatarText} />
                    </View>
                </View>

                <View style={styles.heroStatsRow}>
                    {statItems.map((item, i) => (
                        <React.Fragment key={item.key}>
                            {i > 0 ? <View style={styles.heroStatDivider} /> : null}
                            <View style={styles.heroStatTile}>
                                <TextComp
                                    text={loading ? '—' : String(item.value)}
                                    style={styles.heroStatValue}
                                />
                                <TextComp text={item.label} style={styles.heroStatLabel} />
                            </View>
                        </React.Fragment>
                    ))}
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {stats.pendingDoctors > 0 ? (
                    <Pressable
                        style={styles.alertCard}
                        onPress={() => navigation.navigate(routes.admin.tab.doctors as never)}
                    >
                        <View style={styles.alertIcon}>
                            <MyIcons name="healthTabDoctors" size={20} stroke={theme.palette.status.warning} />
                        </View>
                        <View style={styles.alertText}>
                            <TextComp text="Action needed" style={styles.alertTitle} />
                            <TextComp
                                text={`${stats.pendingDoctors} doctor${stats.pendingDoctors > 1 ? 's' : ''} waiting for approval`}
                                style={styles.alertBody}
                            />
                        </View>
                        <MyIcons name="rightChevron" size={14} stroke={theme.palette.status.warning} />
                    </Pressable>
                ) : null}

                <TextComp text="Manage" style={styles.sectionTitle} />
                <View style={styles.quickLinkGroup}>
                    <QuickLink
                        icon="healthTabHospital"
                        title="Hospitals"
                        subtitle={`${stats.hospitals} registered`}
                        accent={theme.palette.teal.main}
                        surface={theme.palette.teal.surface}
                        onPress={() => navigation.navigate(routes.admin.tab.hospitals as never)}
                    />
                    <View style={styles.quickLinkDivider} />
                    <QuickLink
                        icon="healthTabDepartments"
                        title="Departments"
                        subtitle={`${stats.departments} active`}
                        accent={theme.palette.sky.accent}
                        surface={theme.palette.sky.main}
                        onPress={() => navigation.navigate(routes.admin.tab.departments as never)}
                    />
                    <View style={styles.quickLinkDivider} />
                    <QuickLink
                        icon="healthTabDoctors"
                        title="Doctors"
                        subtitle="Review & manage approvals"
                        accent={theme.palette.status.warning}
                        surface={theme.palette.status.warning + '18'}
                        onPress={() => navigation.navigate(routes.admin.tab.doctors as never)}
                        badge={stats.pendingDoctors || undefined}
                    />
                </View>

                <TextComp text="Account" style={styles.sectionTitle} />
                <View style={s.infoCard}>
                    <AdminInfoRow icon="userIcon" label="Name" value={user.full_name} />
                    <View style={s.rowDivider} />
                    <AdminInfoRow icon="emailIcon" label="Email" value={user.email} />
                    <View style={s.rowDivider} />
                    <View style={s.infoRow}>
                        <View style={s.infoIconWrap}>
                            <MyIcons name="greenCircleCheck" size={16} stroke={theme.palette.teal.main} />
                        </View>
                        <View style={s.infoContent}>
                            <TextComp text="Role" style={s.infoLabel} />
                            <View style={s.roleBadge}>
                                <TextComp text="ADMIN" style={s.roleText} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(24),
        gap: moderateScale(20),
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    heroText: { flex: 1, paddingRight: moderateScale(12), gap: moderateScale(3) },
    greetSub: { fontSize: moderateScale(13), color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    greetName: {
        fontSize: moderateScale(26),
        fontWeight: '800',
        color: theme.colors.text.inverse,
    },
    heroBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: moderateScale(5),
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(4),
        marginTop: moderateScale(6),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    heroBadgeText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.colors.text.inverse,
        letterSpacing: 0.3,
    },
    avatar: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: 'rgba(255,255,255,0.22)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: moderateScale(18), fontWeight: '700', color: theme.colors.text.inverse },

    heroStatsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
    },
    heroStatTile: { flex: 1, alignItems: 'center', gap: moderateScale(4) },
    heroStatDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.25)',
        marginVertical: moderateScale(4),
    },
    heroStatValue: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },
    heroStatLabel: {
        fontSize: moderateScale(10),
        color: 'rgba(255,255,255,0.75)',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
        textAlign: 'center',
    },

    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(120),
        gap: moderateScale(16),
    },

    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        backgroundColor: theme.palette.status.warning + '12',
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        borderWidth: 1,
        borderColor: theme.palette.status.warning + '33',
    },
    alertIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertText: { flex: 1 },
    alertTitle: { fontSize: moderateScale(13), fontWeight: '700', color: theme.palette.status.warning },
    alertBody: { fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: moderateScale(2) },

    sectionTitle: {
        fontSize: moderateScale(15),
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginTop: moderateScale(4),
    },

    quickLinkGroup: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    quickLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(13),
    },
    quickLinkIcon: {
        width: moderateScale(42),
        height: moderateScale(42),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickLinkText: { flex: 1 },
    quickLinkTitle: { fontSize: moderateScale(14), fontWeight: '700', color: theme.colors.text.primary },
    quickLinkSubtitle: { fontSize: moderateScale(12), color: theme.colors.text.secondary, marginTop: moderateScale(2) },
    quickLinkBadge: {
        minWidth: moderateScale(22),
        height: moderateScale(22),
        borderRadius: moderateScale(11),
        paddingHorizontal: moderateScale(6),
        backgroundColor: theme.palette.status.warning,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickLinkBadgeText: { fontSize: moderateScale(11), fontWeight: '700', color: theme.colors.text.inverse },
    quickLinkDivider: { height: 1, backgroundColor: theme.colors.border.default, marginLeft: moderateScale(14) + moderateScale(42) + moderateScale(12) },
});

export default AdminDashboard;
