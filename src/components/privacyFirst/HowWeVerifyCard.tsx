import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { HOW_WE_VERIFY_POINTS } from './constants';

const LockIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M7 11V8a5 5 0 0110 0v3"
            stroke={theme.colors.brand.primary}
            strokeWidth={2}
            strokeLinecap="round"
        />
        <Path
            d="M5 11h14v9H5z"
            stroke={theme.colors.brand.primary}
            strokeWidth={2}
            strokeLinejoin="round"
        />
    </Svg>
);

type HowWeVerifyCardProps = {
    points: readonly string[];
};

const HowWeVerifyCard: React.FC<HowWeVerifyCardProps> = ({ points }) => (
    <View style={styles.card}>
        <View style={styles.header}>
            <LockIcon />
            <TextComp text="How We Verify Savings Without Your Data" style={styles.title} />
        </View>
        {points.map(point => (
            <View key={point} style={styles.row}>
                <View style={styles.bullet} />
                <TextComp text={point} style={styles.point} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.purple.surface,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        marginBottom: spaces.medium,
    },
    title: {
        flex: 1,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        lineHeight: moderateScale(20),
        color: theme.colors.brand.primary,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: moderateScale(8),
    },
    bullet: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: theme.colors.brand.primary,
        marginTop: moderateScale(6),
        marginRight: moderateScale(10),
    },
    point: {
        flex: 1,
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.primary,
    },
});

export default HowWeVerifyCard;
