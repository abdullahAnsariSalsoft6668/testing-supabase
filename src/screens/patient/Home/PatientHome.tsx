import React, { useCallback, useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import { AppointmentCard, AppointmentSkeleton, EmptyState } from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { getUpcomingPatientAppointment, listPatientAppointments } from '@/services/appointmentService';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const QUICK_ACTIONS = [
    {
        id: 'explore',
        label: 'Find Doctor',
        icon: 'healthTabSearch' as const,
        route: 'PatientExplore',
    },
    {
        id: 'visits',
        label: 'My Visits',
        icon: 'healthTabCalendar' as const,
        route: 'PatientAppointments',
    },
    {
        id: 'profile',
        label: 'My Profile',
        icon: 'healthTabUser' as const,
        route: 'PatientProfile',
    },
];

const HEALTH_TIPS = [
    'Drink 8 glasses of water daily to stay hydrated and energised.',
    'A 30-minute walk each day improves heart health significantly.',
    'Getting 7–9 hours of sleep helps your body recover and heal.',
    'Regular check-ups catch health issues before they become serious.',
    'Eating colourful vegetables provides essential vitamins and minerals.',
];

const getDayGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

const todayLabel = () =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const dailyTip = () => HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length];

const PatientHome = () => {
    const navigation = useNavigation<NativeStackNavigationProp<PatientStackParamList>>();
    const user = useSelector((s) => s.auth.userData) as AuthUserProfile;
    const insets = useSafeAreaInsets();
    const [upcoming, setUpcoming] = useState<Appointment | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const hasFetchedRef = useRef(false);

    const load = useCallback(() => {
        if (!user?.patient_id) {
            setLoading(false);
            return;
        }
        if (!hasFetchedRef.current) setLoading(true);
        Promise.all([
            getUpcomingPatientAppointment(user.patient_id!),
            listPatientAppointments(user.patient_id!),
        ])
            .then(([upcomingRow, allRows]) => {
                setUpcoming(upcomingRow);
                setTotalCount(allRows.length);
            })
            .finally(() => {
                setLoading(false);
                hasFetchedRef.current = true;
            });
    }, [user.patient_id]);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    const firstName = user?.full_name?.split(' ')[0] ?? 'Patient';
    const initials = (user?.full_name ?? 'P')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <View style={styles.screen}>
            {/* ── Header ── */}
            <LinearGradient
                colors={[...theme.gradients.header]}
                style={[styles.hero, { paddingTop: insets.top + moderateScale(16) }]}
            >
                <View style={styles.heroRow}>
                    <View style={styles.heroText}>
                        <TextComp text={getDayGreeting()} style={styles.greetSub} />
                        <TextComp text={firstName} style={styles.greetName} />
                        <TextComp text={todayLabel()} style={styles.greetDate} />
                    </View>
                    <View style={styles.avatar}>
                        <TextComp text={initials} style={styles.avatarText} />
                    </View>
                </View>

                {/* Stats bar */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <TextComp text={String(totalCount)} style={styles.statValue} />
                        <TextComp text="Total visits" style={styles.statLabel} />
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <TextComp text={upcoming ? '1' : '0'} style={styles.statValue} />
                        <TextComp text="Upcoming" style={styles.statLabel} />
                    </View>
                    <View style={styles.statDivider} />
                        <Pressable
                            style={styles.statItem}
                            onPress={() => navigation.navigate(routes.patient.tab.explore as never)}
                        >
                        <MyIcons name="healthTabSearch" size={20} stroke={theme.colors.text.inverse} />
                        <TextComp text="Find care" style={styles.statLabel} />
                    </Pressable>
                </View>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
            >
                {/* Quick actions */}
                <View style={styles.actionsRow}>
                    {QUICK_ACTIONS.map((a) => (
                        <Pressable
                            key={a.id}
                            style={styles.actionCard}
                            onPress={() => navigation.navigate(a.route as never)}
                        >
                            <View style={styles.actionIcon}>
                                <MyIcons name={a.icon} size={22} stroke={theme.palette.teal.main} />
                            </View>
                            <TextComp text={a.label} style={styles.actionLabel} />
                        </Pressable>
                    ))}
                </View>

                {/* Upcoming appointment */}
                <View style={styles.sectionHeader}>
                    <TextComp text="Upcoming Appointment" style={styles.sectionTitle} />
                    <Pressable onPress={() => navigation.navigate(routes.patient.tab.appointments as never)}>
                        <TextComp text="See all" style={styles.sectionLink} />
                    </Pressable>
                </View>

                {loading ? (
                    <AppointmentSkeleton count={1} />
                ) : upcoming ? (
                    <AppointmentCard
                        appointment={upcoming}
                        subtitle={getUserDisplayName(upcoming.doctors?.users, 'Doctor')}
                        onPress={() =>
                            navigation.navigate(routes.patient.appointmentDetail, { appointmentId: upcoming.id })
                        }
                    />
                ) : (
                    <View style={styles.emptyWrap}>
                        <EmptyState
                            title="No upcoming visits"
                            message="Book an appointment with a specialist to get started."
                        />
                        <Pressable
                            style={styles.ctaBtn}
                            onPress={() => navigation.navigate(routes.patient.tab.explore as never)}
                        >
                            <MyIcons name="healthTabSearch" size={16} stroke={theme.colors.text.inverse} />
                            <TextComp text="Find a Doctor" style={styles.ctaBtnText} />
                        </Pressable>
                    </View>
                )}

                {/* Health tip */}
                <View style={styles.tipCard}>
                    <View style={styles.tipIcon}>
                        <MyIcons name="healthTabHome" size={20} stroke={theme.palette.teal.main} />
                    </View>
                    <View style={styles.tipText}>
                        <TextComp text="Health Tip of the Day" style={styles.tipTitle} />
                        <TextComp text={dailyTip()} style={styles.tipBody} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background.secondary },

    /* Hero */
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
    heroText: { flex: 1, paddingRight: moderateScale(12) },
    greetSub: {
        fontSize: moderateScale(13),
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    greetName: {
        fontSize: moderateScale(26),
        fontWeight: '800',
        color: theme.colors.text.inverse,
        marginTop: moderateScale(2),
    },
    greetDate: {
        fontSize: moderateScale(12),
        color: 'rgba(255,255,255,0.7)',
        marginTop: moderateScale(4),
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
    avatarText: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },

    /* Stats bar inside header */
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: moderateScale(14),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: moderateScale(4),
    },
    statValue: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },
    statLabel: {
        fontSize: moderateScale(11),
        color: 'rgba(255,255,255,0.75)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.25)',
        marginVertical: moderateScale(4),
    },

    /* Body */
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(20),
        paddingBottom: moderateScale(120),
        gap: moderateScale(0),
    },

    /* Quick actions */
    actionsRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginBottom: moderateScale(24),
    },
    actionCard: {
        flex: 1,
        alignItems: 'center',
        gap: moderateScale(8),
        backgroundColor: theme.colors.card.background,
        borderRadius: moderateScale(14),
        paddingVertical: moderateScale(16),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    actionIcon: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: theme.palette.teal.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: moderateScale(11),
        fontWeight: '600',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    /* Section header */
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(12),
    },
    sectionTitle: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    sectionLink: {
        fontSize: moderateScale(13),
        color: theme.palette.teal.main,
        fontWeight: '600',
    },

    /* Empty + CTA */
    emptyWrap: { gap: moderateScale(12) },
    ctaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        backgroundColor: theme.palette.teal.main,
        borderRadius: moderateScale(12),
        paddingVertical: moderateScale(14),
    },
    ctaBtnText: {
        color: theme.colors.text.inverse,
        fontSize: moderateScale(15),
        fontWeight: '700',
    },

    /* Health tip */
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(14),
        backgroundColor: theme.palette.teal.surface,
        borderRadius: moderateScale(14),
        padding: moderateScale(16),
        marginTop: moderateScale(24),
        borderWidth: 1,
        borderColor: theme.palette.teal.main + '33',
    },
    tipIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(10),
        backgroundColor: theme.colors.card.background,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    tipText: { flex: 1 },
    tipTitle: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: theme.palette.teal.dark,
        marginBottom: moderateScale(4),
    },
    tipBody: {
        fontSize: moderateScale(13),
        color: theme.palette.teal.dark,
        lineHeight: moderateScale(19),
    },
});

export default PatientHome;
