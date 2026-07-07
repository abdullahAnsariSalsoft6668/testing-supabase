import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import type { BarcodeSavingsBadge } from './constants';

type SavingsBadgeRowProps = {
    badges: BarcodeSavingsBadge[];
};

const SavingsBadgeRow: React.FC<SavingsBadgeRowProps> = ({ badges }) => (
    <View style={styles.row}>
        {badges.map(badge => (
            <View key={badge.id} style={[styles.badge, { backgroundColor: badge.bg }]}>
                <TextComp text={badge.amount} style={[styles.amount, { color: badge.color }]} />
                <TextComp text={badge.label} style={[styles.label, { color: badge.color }]} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: moderateScale(8),
        marginTop: spaces.medium,
    },
    badge: {
        flex: 1,
        borderRadius: moderateScale(12),
        paddingVertical: moderateScale(12),
        alignItems: 'center',
    },
    amount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        marginBottom: moderateScale(4),
    },
    label: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
    },
});

export default SavingsBadgeRow;
