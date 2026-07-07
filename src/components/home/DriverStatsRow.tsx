import React from 'react';
import { StyleSheet, View } from 'react-native';
import { moderateScale } from '@/styles/scaling';

import DriverStatCard from './DriverStatCard';
import type { DriverStat } from './types';

type DriverStatsRowProps = {
    stats: DriverStat[];
};

const DriverStatsRow: React.FC<DriverStatsRowProps> = ({ stats }) => (
    <View style={styles.row}>
        {stats.map((stat, index) => (
            <DriverStatCard key={stat.id} stat={stat} index={index} />
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: moderateScale(10),
        marginTop: moderateScale(18),
    },
});

export default React.memo(DriverStatsRow);
