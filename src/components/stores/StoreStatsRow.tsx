import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { STORE_STATS } from './constants';

const StoreStatsRow: React.FC = () => (
    <View style={styles.row}>
        {STORE_STATS.map(item => (
            <View key={item.id} style={styles.card}>
                <TextComp text={item.value} style={styles.value} />
                <TextComp text={item.label} style={styles.label} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: moderateScale(10),
        paddingHorizontal: spaces.medium,
        marginTop: moderateScale(-36),
        marginBottom: moderateScale(8),
        zIndex: 3,
    },
    card: {
        flex: 1,
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(8),
        alignItems: 'center',
        ...theme.shadows.card,
    },
    value: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        color: theme.colors.text.stat,
        marginBottom: moderateScale(2),
    },
    label: {
        fontSize: moderateScale(11),
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
});

export default StoreStatsRow;
