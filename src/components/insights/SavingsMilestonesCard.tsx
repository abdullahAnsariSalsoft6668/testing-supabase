import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import type { SavingsMilestone } from '@/components/grocery/types';
import { INSIGHTS_GOAL, INSIGHTS_PROGRESS } from '@/components/insights/constants';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type SavingsMilestonesCardProps = {
    milestones: SavingsMilestone[];
    progress: number;
    goalLabel: string;
};

const SavingsMilestonesCard: React.FC<SavingsMilestonesCardProps> = ({
    milestones,
    progress,
    goalLabel,
}) => (
    <View style={styles.card}>
        <View style={styles.headerBand}>
            <Text style={styles.trophy}>🏆</Text>
            <TextComp text="Savings Milestones" style={styles.headerTitle} />
        </View>
        {milestones.map(item => (
            <View key={item.id} style={styles.row}>
                <View style={[styles.icon, { backgroundColor: item.iconBg }]}>
                    <Text style={styles.iconEmoji}>🏆</Text>
                </View>
                <View style={styles.rowBody}>
                    <TextComp text={item.title} style={styles.rowTitle} />
                    <TextComp text={item.date} style={styles.rowDate} />
                </View>
                <TextComp
                    text={item.amount}
                    style={StyleSheet.flatten([styles.rowAmount, { color: item.amountColor }])}
                />
            </View>
        ))}
        <View style={styles.progressSection}>
            <View style={styles.progressRing}>
                <TextComp text={`${progress}%`} style={styles.progressText} />
            </View>
            <View style={styles.progressBody}>
                <TextComp text={goalLabel} style={styles.goalLabel} />
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    headerBand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        backgroundColor: '#FFF8E1',
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(12),
    },
    trophy: {
        fontSize: moderateScale(18),
    },
    headerTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: '#B45309',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: palette.neutral.gray100,
    },
    icon: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.small,
    },
    iconEmoji: {
        fontSize: moderateScale(14),
    },
    rowBody: {
        flex: 1,
    },
    rowTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        color: theme.colors.text.primary,
    },
    rowDate: {
        fontSize: moderateScale(11),
        color: theme.colors.text.secondary,
        marginTop: moderateScale(2),
    },
    rowAmount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spaces.medium,
        gap: spaces.medium,
    },
    progressRing: {
        width: moderateScale(52),
        height: moderateScale(52),
        borderRadius: moderateScale(26),
        backgroundColor: theme.colors.brand.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        color: theme.colors.text.inverse,
    },
    progressBody: {
        flex: 1,
    },
    goalLabel: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(8),
    },
    progressTrack: {
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: palette.neutral.gray100,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: moderateScale(4),
        backgroundColor: palette.green.main,
    },
});

export default SavingsMilestonesCard;

export { INSIGHTS_GOAL, INSIGHTS_PROGRESS };
