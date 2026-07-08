/**
 * Skeleton loading layouts — drop-in replacements for ActivityIndicator.
 * Each component mirrors the visual structure of the real content it replaces.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Shimmer from './Shimmer';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const SHIMMER_COLORS: [string, string, string] = ['#F1F5F9', '#FFFFFF', '#F1F5F9'];
const s = (width: number | string, height: number, radius = 8) =>
    ({ width, height, borderRadius: radius } as const);

/* ─── Row skeleton (avatar + lines) ─────────────────────────────────────── */
const CardRowSkeleton = () => (
    <View style={sk.card}>
        <View style={sk.cardHeader}>
            <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(48), moderateScale(48), moderateScale(14))} />
            <View style={sk.lines}>
                <Shimmer shimmerColors={SHIMMER_COLORS} style={s('68%', moderateScale(14))} />
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('48%', moderateScale(12)), { marginTop: moderateScale(8) }]} />
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('36%', moderateScale(11)), { marginTop: moderateScale(6) }]} />
            </View>
        </View>
        <View style={sk.cardDivider} />
        <View style={sk.cardActions}>
            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('45%', moderateScale(34), moderateScale(10))]} />
            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('45%', moderateScale(34), moderateScale(10))]} />
        </View>
    </View>
);

/** Card list skeleton — for hospital / department / doctor list screens. */
export const CardListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <CardRowSkeleton key={i} />
        ))}
    </>
);

/* ─── Appointment card skeleton ─────────────────────────────────────────── */
const AppointmentRowSkeleton = () => (
    <View style={sk.card}>
        <View style={sk.cardHeader}>
            <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(52), moderateScale(60), moderateScale(10))} />
            <View style={sk.lines}>
                <View style={sk.apptTitleRow}>
                    <Shimmer shimmerColors={SHIMMER_COLORS} style={s('55%', moderateScale(14))} />
                    <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(60), moderateScale(20), moderateScale(20))} />
                </View>
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('75%', moderateScale(12)), { marginTop: moderateScale(8) }]} />
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('45%', moderateScale(11)), { marginTop: moderateScale(6) }]} />
            </View>
        </View>
    </View>
);

/** Appointment list skeleton — for visits/appointments screens. */
export const AppointmentSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <AppointmentRowSkeleton key={i} />
        ))}
    </>
);

/* ─── Stats skeleton ─────────────────────────────────────────────────────── */

/** Dashboard stats grid skeleton. */
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <View style={sk.statsRow}>
        {Array.from({ length: count }).map((_, i) => (
            <View key={i} style={sk.statCard}>
                <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(44), moderateScale(44), moderateScale(12))} />
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('60%', moderateScale(26)), { marginTop: moderateScale(10) }]} />
                <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('80%', moderateScale(10)), { marginTop: moderateScale(6) }]} />
            </View>
        ))}
    </View>
);

/* ─── Profile detail skeleton ────────────────────────────────────────────── */

/** Profile hero + info rows skeleton — for detail screens. */
export const DetailSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
    <>
        {/* Hero card */}
        <View style={[sk.card, sk.profileCard]}>
            <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(72), moderateScale(72), moderateScale(36))} />
            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('55%', moderateScale(18)), { marginTop: moderateScale(12) }]} />
            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('38%', moderateScale(13)), { marginTop: moderateScale(8) }]} />
            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s(moderateScale(70), moderateScale(24), moderateScale(20)), { marginTop: moderateScale(12) }]} />
        </View>
        {/* Info rows card */}
        <View style={sk.card}>
            {Array.from({ length: rows }).map((_, i) => (
                <View key={i}>
                    {i > 0 ? <View style={sk.rowDivider} /> : null}
                    <View style={sk.infoRow}>
                        <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(32), moderateScale(32), moderateScale(8))} />
                        <View style={sk.lines}>
                            <Shimmer shimmerColors={SHIMMER_COLORS} style={s('30%', moderateScale(10))} />
                            <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('65%', moderateScale(14)), { marginTop: moderateScale(5) }]} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
        {/* Action buttons */}
        <Shimmer shimmerColors={SHIMMER_COLORS} style={s('100%', moderateScale(50), moderateScale(12))} />
        <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('100%', moderateScale(50), moderateScale(12)), { marginTop: moderateScale(10) }]} />
    </>
);

/* ─── Form skeleton ──────────────────────────────────────────────────────── */

/** Form field rows skeleton — for create/edit form screens. */
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
    <View style={sk.card}>
        {Array.from({ length: fields }).map((_, i) => (
            <View key={i}>
                {i > 0 ? <View style={sk.rowDivider} /> : null}
                <View style={sk.formFieldRow}>
                    <Shimmer shimmerColors={SHIMMER_COLORS} style={s(moderateScale(36), moderateScale(36), moderateScale(10))} />
                    <View style={sk.lines}>
                        <Shimmer shimmerColors={SHIMMER_COLORS} style={s('30%', moderateScale(10))} />
                        <Shimmer shimmerColors={SHIMMER_COLORS} style={[s('100%', moderateScale(40), moderateScale(8)), { marginTop: moderateScale(6) }]} />
                    </View>
                </View>
            </View>
        ))}
    </View>
);

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const sk = StyleSheet.create({
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
        gap: moderateScale(14),
    },
    lines: { flex: 1 },
    cardDivider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
        marginHorizontal: moderateScale(16),
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: moderateScale(12),
    },

    apptTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    statsRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginBottom: moderateScale(16),
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
    },

    profileCard: {
        alignItems: 'center',
        padding: moderateScale(24),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
    rowDivider: {
        height: 1,
        backgroundColor: theme.colors.border.default,
    },
    formFieldRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(14),
        gap: moderateScale(12),
    },
});
