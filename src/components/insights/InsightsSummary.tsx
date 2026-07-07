import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { InsightStatItem } from '@/components/grocery/types';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import MyIcons from '@/components/MyIcons';

const STAT_ICON_SIZE = moderateScale(40);

type InsightsSummaryCardProps = {
    total: string;
    growth: string;
};

export const InsightsSummaryCard: React.FC<InsightsSummaryCardProps> = ({ total, growth }) => (
    <View style={styles.card}>
        <View style={styles.iconWrap}>
            <MyIcons name="coin" size={moderateScale(24)} />
        </View>
        <View style={styles.content}>
            <TextComp text="Total saved in 6 months" style={styles.label} />
            <TextComp text={total} style={styles.total} />
            <View style={styles.badge}>
                <TextComp text={growth} style={styles.badgeText} />
            </View>
        </View>
    </View>
);

type InsightsStatsGridProps = {
    stats: InsightStatItem[];
};

export const InsightsStatsGrid: React.FC<InsightsStatsGridProps> = ({ stats }) => (
    <View style={styles.grid}>
        {stats.map(item => (
            <View key={item.id} style={styles.statCard}>
                <View style={styles.statIconWrap}>
                    <MyIcons name={item.icon} size={STAT_ICON_SIZE} />
                </View>
                <TextComp text={item.value} style={styles.statValue} />
                <TextComp text={item.label} style={styles.statLabel} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    iconWrap: {
        width: moderateScale(56),
        height: moderateScale(56),
        borderRadius: moderateScale(28),
        backgroundColor: palette.neutral.cream,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    emoji: {
        fontSize: moderateScale(28),
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
    },
    total: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(28),
        color: theme.colors.text.primary,
        marginVertical: moderateScale(4),
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF8E1',
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5),
    },
    badgeText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: '#B45309',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spaces.medium,
    },
    statCard: {
        width: '48%',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    statIconWrap: {
        alignSelf: 'flex-start',
        marginBottom: moderateScale(6),
    },
    statValue: {
        ...theme.typography.stat,
        fontSize: moderateScale(20),
        color: theme.colors.text.stat,
        marginBottom: moderateScale(2),
    },
    statLabel: {
        fontSize: moderateScale(12),
        color: theme.colors.text.primary,
    },
});
