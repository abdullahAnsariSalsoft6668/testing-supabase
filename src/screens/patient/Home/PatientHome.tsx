import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {
    AppointmentCard,
    EmptyState,
    HomeSkeleton,
} from '@/components/health';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ButtonComp from '@/components/ui/ButtonComp';
import MotionFade from '@/components/ui/MotionFade';
import PillRefresh from '@/components/ui/PillRefresh';
import ScalePressable from '@/components/ui/ScalePressable';
import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import { PatientStackParamList } from '@/navigation/types';
import { useSelector } from '@/redux/hooks';
import { getUpcomingPatientAppointment, listPatientAppointments } from '@/services/appointmentService';
import { PRESS_SCALE_QUICK_ACTION } from '@/styles/motion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';
import { getUserDisplayName } from '@/utils/userDisplay';
import type { Appointment } from '@/types/database';

const QUICK_ACTIONS = [
    {
        id: 'book',
        label: 'Book',
        icon: 'healthTabCalendar' as const,
        route: 'PatientExplore',
        focused: true,
    },
    {
        id: 'explore',
        label: 'Find Doctor',
        icon: 'healthTabSearch' as const,
        route: 'PatientExplore',
    },
    {
        id: 'visits',
        label: 'My Visits',
        icon: 'healthTabFile' as const,
        route: 'PatientAppointments',
    },
    {
        id: 'profile',
        label: 'Profile',
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

    const load = useCallback(async () => {
        if (!user?.patient_id) {
            setLoading(false);
            return;
        }
        if (!hasFetchedRef.current) setLoading(true);
        try {
            const [upcomingRow, allRows] = await Promise.all([
                getUpcomingPatientAppointment(user.patient_id!),
                listPatientAppointments(user.patient_id!),
            ]);
            setUpcoming(upcomingRow);
            setTotalCount(allRows.length);
        } finally {
            setLoading(false);
            hasFetchedRef.current = true;
        }
    }, [user.patient_id]);

    useFocusEffect(useCallback(() => { void load(); }, [load]));

    const firstName = user?.full_name?.split(' ')[0] ?? 'Patient';
    const initials = (user?.full_name ?? 'P')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <LinearGradient colors={[...theme.gradients.screen]} style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top + moderateScale(16) }]}>
                <View style={styles.heroRow}>
                    <View style={styles.heroText}>
                        <TextComp text={getDayGreeting()} variant="homeGreeting" />
                        <TextComp text={firstName} variant="homeName" />
                        <TextComp text={todayLabel()} style={styles.greetDate} />
                    </View>
                    <View style={styles.avatar}>
                        <TextComp text={initials} style={styles.avatarText} />
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <TextComp text={String(totalCount)} style={typography.stat} />
                        <TextComp text="Total visits" style={styles.statLabel} />
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <TextComp text={upcoming ? '1' : '0'} style={typography.stat} />
                        <TextComp text="Upcoming" style={styles.statLabel} />
                    </View>
                </View>
            </View>

            <PillRefresh onRefresh={load}>
                <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                    <ScalePressable
                        style={styles.aiCard}
                        onPress={() => navigation.navigate(routes.patient.aiAssistantHub)}
                    >
                        <LinearGradient
                            colors={[...theme.gradients.primaryButton]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.aiGradient}
                        >
                            <View style={styles.aiIcon}>
                                <MyIcons name="healthTabUser" size={26} stroke={theme.palette.ink} />
                            </View>
                            <View style={styles.aiText}>
                                <TextComp text="AI Health Assistant" style={styles.aiTitle} />
                                <TextComp text="Book by chat or voice call" style={styles.aiSub} />
                            </View>
                        </LinearGradient>
                    </ScalePressable>

                    <View style={styles.actionsRow}>
                        {QUICK_ACTIONS.map((action) => {
                            const focused = action.focused;
                            return (
                                <ScalePressable
                                    key={action.id}
                                    pressedScale={PRESS_SCALE_QUICK_ACTION}
                                    style={styles.actionTile}
                                    onPress={() => navigation.navigate(action.route as never)}
                                >
                                    <View
                                        style={[
                                            styles.actionIcon,
                                            focused ? styles.actionIconFocused : styles.actionIconDefault,
                                        ]}
                                    >
                                        <MyIcons
                                            name={action.icon}
                                            size={22}
                                            stroke={focused ? theme.palette.ink : theme.palette.lime.main}
                                        />
                                    </View>
                                    <TextComp
                                        text={action.label}
                                        style={[
                                            styles.actionLabel,
                                            focused && styles.actionLabelFocused,
                                        ]}
                                    />
                                </ScalePressable>
                            );
                        })}
                    </View>

                    <View style={styles.sectionHeader}>
                        <TextComp text="Upcoming Appointment" variant="h3" />
                        <ScalePressable onPress={() => navigation.navigate(routes.patient.tab.appointments as never)}>
                            <TextComp text="See all" variant="seeAll" />
                        </ScalePressable>
                    </View>

                    <MotionFade showSkeleton={loading} skeleton={<HomeSkeleton />}>
                        {upcoming ? (
                            <AppointmentCard
                                appointment={upcoming}
                                subtitle={getUserDisplayName(upcoming.doctors?.users, 'Doctor')}
                                onPress={() =>
                                    navigation.navigate(routes.patient.appointmentDetail, {
                                        appointmentId: upcoming.id,
                                    })
                                }
                            />
                        ) : (
                            <View style={styles.emptyWrap}>
                                <EmptyState
                                    title="No upcoming visits"
                                    message="Book an appointment with a specialist to get started."
                                />
                                <ButtonComp
                                    label="Find a Doctor"
                                    onPress={() => navigation.navigate(routes.patient.tab.explore as never)}
                                    rightIcon="healthTabSearch"
                                />
                            </View>
                        )}
                    </MotionFade>

                    <View style={styles.tipCard}>
                        <View style={styles.tipIcon}>
                            <MyIcons name="healthTabHome" size={20} stroke={theme.palette.lime.main} />
                        </View>
                        <View style={styles.tipText}>
                            <TextComp text="Health Tip of the Day" style={styles.tipTitle} />
                            <TextComp text={dailyTip()} style={styles.tipBody} />
                        </View>
                    </View>
                </ScrollView>
            </PillRefresh>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1 },
    header: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(16),
        gap: moderateScale(16),
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    heroText: { flex: 1, paddingRight: moderateScale(12) },
    greetDate: {
        ...typography.bodySmall,
        marginTop: moderateScale(4),
    },
    avatar: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: theme.palette.olive.main,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...typography.label,
        color: theme.palette.lime.main,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.palette.olive.card,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
        ...theme.shadows.card,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: moderateScale(4),
    },
    statLabel: {
        ...typography.bodySmall,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border.default,
        marginVertical: moderateScale(4),
    },
    body: {
        paddingHorizontal: moderateScale(16),
        paddingTop: moderateScale(8),
        paddingBottom: moderateScale(120),
    },
    aiCard: {
        marginBottom: moderateScale(20),
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        ...theme.shadows.button,
    },
    aiGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(12),
        padding: moderateScale(16),
    },
    aiIcon: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiText: { flex: 1 },
    aiTitle: {
        ...typography.label,
        color: theme.palette.ink,
        fontSize: moderateScale(17),
        textTransform: 'none',
    },
    aiSub: {
        ...typography.bodySmall,
        color: 'rgba(255,255,255,0.9)',
        marginTop: moderateScale(4),
    },
    actionsRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginBottom: moderateScale(24),
    },
    actionTile: {
        flex: 1,
        alignItems: 'center',
        gap: moderateScale(8),
    },
    actionIcon: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIconDefault: {
        backgroundColor: theme.palette.lime.surface,
    },
    actionIconFocused: {
        backgroundColor: theme.palette.lime.main,
    },
    actionLabel: {
        ...typography.bodySmall,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        fontWeight: '600',
    },
    actionLabelFocused: {
        color: theme.palette.cream,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(12),
    },
    emptyWrap: { gap: moderateScale(12) },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(14),
        backgroundColor: theme.palette.olive.card,
        borderRadius: theme.radius.lg,
        padding: moderateScale(16),
        marginTop: moderateScale(24),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },
    tipIcon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(10),
        backgroundColor: theme.palette.lime.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    tipText: { flex: 1 },
    tipTitle: {
        ...typography.label,
        color: theme.palette.lime.main,
        marginBottom: moderateScale(4),
        textTransform: 'none',
    },
    tipBody: {
        ...typography.bodySmall,
        color: theme.colors.text.secondary,
    },
});

export default PatientHome;
