import React from 'react';
import { StyleSheet, View } from 'react-native';

import AppShimmerBox from '@/components/ui/AppShimmerBox';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';

const s = (width: number | `${number}%`, height: number, radius = moderateScale(8)) =>
    ({ width, height, borderRadius: radius }) as const;

const CardRowSkeleton = () => (
    <View style={sk.card}>
        <View style={sk.cardHeader}>
            <AppShimmerBox palette="onWhite" style={s(moderateScale(48), moderateScale(48), moderateScale(14))} />
            <View style={sk.lines}>
                <AppShimmerBox palette="onWhite" style={s('68%', moderateScale(14))} />
                <AppShimmerBox palette="onWhite" style={[s('48%', moderateScale(12)), { marginTop: moderateScale(8) }]} />
                <AppShimmerBox palette="onWhite" style={[s('36%', moderateScale(11)), { marginTop: moderateScale(6) }]} />
            </View>
        </View>
        <View style={sk.cardDivider} />
        <View style={sk.cardActions}>
            <AppShimmerBox palette="onWhite" style={s('45%', moderateScale(34), moderateScale(10))} />
            <AppShimmerBox palette="onWhite" style={s('45%', moderateScale(34), moderateScale(10))} />
        </View>
    </View>
);

export const CardListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <CardRowSkeleton key={i} />
        ))}
    </>
);

const AppointmentRowSkeleton = () => (
    <View style={sk.card}>
        <View style={sk.cardHeader}>
            <AppShimmerBox palette="onWhite" style={s(moderateScale(52), moderateScale(60), moderateScale(10))} />
            <View style={sk.lines}>
                <View style={sk.apptTitleRow}>
                    <AppShimmerBox palette="onWhite" style={s('55%', moderateScale(14))} />
                    <AppShimmerBox palette="onWhite" style={s(moderateScale(60), moderateScale(20), moderateScale(20))} />
                </View>
                <AppShimmerBox palette="onWhite" style={[s('75%', moderateScale(12)), { marginTop: moderateScale(8) }]} />
                <AppShimmerBox palette="onWhite" style={[s('45%', moderateScale(11)), { marginTop: moderateScale(6) }]} />
            </View>
        </View>
    </View>
);

export const AppointmentSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <AppointmentRowSkeleton key={i} />
        ))}
    </>
);

export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <View style={sk.statsRow}>
        {Array.from({ length: count }).map((_, i) => (
            <View key={i} style={sk.statCard}>
                <AppShimmerBox palette="childProfile" style={s(moderateScale(44), moderateScale(44), moderateScale(12))} />
                <AppShimmerBox palette="childProfile" style={[s('60%', moderateScale(26)), { marginTop: moderateScale(10) }]} />
                <AppShimmerBox palette="childProfile" style={[s('80%', moderateScale(10)), { marginTop: moderateScale(6) }]} />
            </View>
        ))}
    </View>
);

export const HomeSkeleton = () => (
    <View style={sk.homeWrap}>
        <AppShimmerBox palette="childProfile" style={s('55%', moderateScale(28), moderateScale(8))} />
        <AppShimmerBox palette="childProfile" style={[s('40%', moderateScale(14)), { marginTop: moderateScale(8) }]} />
        <StatsSkeleton count={3} />
        <View style={sk.chipRow}>
            {[0, 1, 2].map((i) => (
                <AppShimmerBox key={i} palette="childProfile" style={s(moderateScale(96), moderateScale(56), moderateScale(16))} />
            ))}
        </View>
        <AppShimmerBox palette="onWhite" style={s('100%', moderateScale(140), theme.radius.card)} />
        <AppShimmerBox palette="onWhite" style={s(moderateScale(88), moderateScale(88), moderateScale(44))} />
    </View>
);

export const DetailSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
    <>
        <View style={[sk.card, sk.profileCard]}>
            <AppShimmerBox palette="onWhite" style={s(moderateScale(72), moderateScale(72), moderateScale(36))} />
            <AppShimmerBox palette="onWhite" style={[s('55%', moderateScale(18)), { marginTop: moderateScale(12) }]} />
            <AppShimmerBox palette="onWhite" style={[s('38%', moderateScale(13)), { marginTop: moderateScale(8) }]} />
            <AppShimmerBox palette="onWhite" style={[s(moderateScale(70), moderateScale(24), moderateScale(20)), { marginTop: moderateScale(12) }]} />
        </View>
        <View style={sk.card}>
            {Array.from({ length: rows }).map((_, i) => (
                <View key={i}>
                    {i > 0 ? <View style={sk.rowDivider} /> : null}
                    <View style={sk.infoRow}>
                        <AppShimmerBox palette="onWhite" style={s(moderateScale(32), moderateScale(32), moderateScale(8))} />
                        <View style={sk.lines}>
                            <AppShimmerBox palette="onWhite" style={s('30%', moderateScale(10))} />
                            <AppShimmerBox palette="onWhite" style={[s('65%', moderateScale(14)), { marginTop: moderateScale(5) }]} />
                        </View>
                    </View>
                </View>
            ))}
        </View>
        <AppShimmerBox palette="onWhite" style={s('100%', moderateScale(50), moderateScale(12))} />
        <AppShimmerBox palette="onWhite" style={[s('100%', moderateScale(50), moderateScale(12)), { marginTop: moderateScale(10) }]} />
    </>
);

export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
    <View style={sk.card}>
        {Array.from({ length: fields }).map((_, i) => (
            <View key={i}>
                {i > 0 ? <View style={sk.rowDivider} /> : null}
                <View style={sk.formFieldRow}>
                    <AppShimmerBox palette="onWhite" style={s(moderateScale(36), moderateScale(36), moderateScale(10))} />
                    <View style={sk.lines}>
                        <AppShimmerBox palette="onWhite" style={s('30%', moderateScale(10))} />
                        <AppShimmerBox palette="onWhite" style={[s('100%', moderateScale(40), moderateScale(8)), { marginTop: moderateScale(6) }]} />
                    </View>
                </View>
            </View>
        ))}
    </View>
);

const sk = StyleSheet.create({
    homeWrap: {
        gap: moderateScale(12),
        paddingTop: moderateScale(8),
    },
    chipRow: {
        flexDirection: 'row',
        gap: moderateScale(10),
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
