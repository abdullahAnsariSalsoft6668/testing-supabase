import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { HealthScreenHeader, StatsSkeleton } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import type { AuthUserProfile } from '@/models/auth.types';
import { useSelector } from '@/redux/hooks';
import { listDoctorsByStatus } from '@/services/doctorService';
import { listHospitals } from '@/services/hospitalService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getLocalDateIso } from '@/utils/date';
import { getSupabase } from '@/utils/supabase';

type StatCardProps = {
    icon: React.ReactNode;
    value: number;
    label: string;
    accent: string;
    surface: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, accent, surface }) => (
    <View style={[styles.statCard, { borderTopColor: accent }]}>
        <View style={[styles.statIconWrap, { backgroundColor: surface }]}>{icon}</View>
        <TextComp text={String(value)} style={[styles.statValue, { color: accent }]} />
        <TextComp text={label} style={styles.statLabel} />
    </View>
);

const AdminDashboard = () => {
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const [stats, setStats] = useState({ hospitals: 0, pendingDoctors: 0, todayAppts: 0 });
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            if (!hasFetchedRef.current) setLoading(true);
            const today = getLocalDateIso();
            Promise.all([
                listHospitals(),
                listDoctorsByStatus('PENDING'),
                getSupabase()
                    .from('appointments')
                    .select('*', { count: 'exact', head: true })
                    .eq('appointment_date', today),
            ])
                .then(([hospitals, pending, appts]) => {
                    setStats({
                        hospitals: hospitals.length,
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

    return (
        <View style={styles.screen}>
            <HealthScreenHeader
                title={`Hello, ${firstName}`}
                subtitle="Hospital management overview"
            />
            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <>
                        <StatsSkeleton count={3} />
                        <View style={styles.infoCard}>
                            {[0, 1, 2].map((i) => (
                                <React.Fragment key={i}>
                                    {i > 0 ? <View style={styles.divider} /> : null}
                                    <View style={styles.infoRow}>
                                        <View style={[styles.infoIconWrap, { backgroundColor: theme.palette.neutral.gray100 }]} />
                                        <View style={{ flex: 1, gap: 6 }}>
                                            <View style={{ width: '30%', height: 10, backgroundColor: theme.palette.neutral.gray200, borderRadius: 6 }} />
                                            <View style={{ width: '65%', height: 14, backgroundColor: theme.palette.neutral.gray100, borderRadius: 6 }} />
                                        </View>
                                    </View>
                                </React.Fragment>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Stats grid */}
                        <View style={styles.statsGrid}>
                            <StatCard
                                icon={<MyIcons name="healthTabHospital" size={22} stroke={theme.palette.teal.main} />}
                                value={stats.hospitals}
                                label="Hospitals"
                                accent={theme.palette.teal.main}
                                surface={theme.palette.teal.surface}
                            />
                            <StatCard
                                icon={<MyIcons name="healthTabDoctors" size={22} stroke="#E67700" />}
                                value={stats.pendingDoctors}
                                label="Pending Doctors"
                                accent="#E67700"
                                surface="#FFF3E0"
                            />
                            <StatCard
                                icon={<MyIcons name="healthTabCalendar" size={22} stroke={theme.palette.sky.accent} />}
                                value={stats.todayAppts}
                                label="Today's Visits"
                                accent={theme.palette.sky.accent}
                                surface={theme.palette.sky.main}
                            />
                        </View>

                        {/* Quick info */}
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <MyIcons name="userIcon" size={16} stroke={theme.colors.text.secondary} />
                                <TextComp text={user.full_name ?? ''} style={styles.infoText} />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <MyIcons name="emailIcon" size={16} stroke={theme.colors.text.secondary} />
                                <TextComp text={user.email ?? ''} style={styles.infoText} />
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <MyIcons name="checkVerified" size={16} stroke={theme.palette.teal.main} />
                                <View style={styles.roleBadge}>
                                    <TextComp text="ADMIN" style={styles.roleText} />
                                </View>
                            </View>
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
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(120),
        gap: moderateScale(16),
    },

    statsGrid: {
        flexDirection: 'row',
        gap: moderateScale(10),
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        alignItems: 'center',
        borderTopWidth: 3,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    statIconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(10),
    },
    statValue: {
        fontSize: moderateScale(26),
        fontWeight: '700',
    },
    statLabel: {
        fontSize: moderateScale(10),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },

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
        gap: moderateScale(12),
    },
    infoText: {
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        flex: 1,
    },
    divider: { height: 1, backgroundColor: theme.colors.border.default },
    roleBadge: {
        backgroundColor: theme.palette.teal.surface,
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(3),
        borderRadius: moderateScale(20),
    },
    roleText: {
        fontSize: moderateScale(11),
        fontWeight: '700',
        color: theme.palette.teal.main,
        letterSpacing: 0.5,
    },
});

export default AdminDashboard;
