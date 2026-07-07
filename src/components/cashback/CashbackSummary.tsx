import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import MyIcons from '../MyIcons';

type LifetimeCashbackCardProps = {
    amount: string;
};

const LifetimeCashbackCard: React.FC<LifetimeCashbackCardProps> = ({ amount }) => (
    <View style={styles.card}>
        <View style={styles.iconWrap}>
            <MyIcons name="refund" size={moderateScale(32)} />
        </View>
        <View style={styles.content}>
            <TextComp text="Lifetime Cashback Earned" style={styles.label} />
            <TextComp text={amount} style={styles.amount} />
        </View>
    </View>
);

type HowCashbackWorksProps = {
    steps: readonly string[];
};

export const HowCashbackWorks: React.FC<HowCashbackWorksProps> = ({ steps }) => (
    <View style={styles.footer}>
        <View style={styles.footerHeader}>
            <View style={styles.checkCircle}>
                <TextComp text="✓" style={styles.checkMark} />
            </View>
            <TextComp text="How Cashback Works" style={styles.footerTitle} />
        </View>
        {steps.map((step, index) => (
            <TextComp
                key={step}
                text={`${index + 1} – ${step}`}
                style={styles.footerStep}
            />
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
        width: moderateScale(64),
        height: moderateScale(64),
        borderRadius: moderateScale(32),
        backgroundColor: palette.neutral.cream,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    emoji: {
        fontSize: moderateScale(32),
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: moderateScale(13),
        color: theme.colors.text.secondary,
        marginBottom: moderateScale(4),
    },
    amount: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(32),
        color: theme.colors.text.primary,
        lineHeight: moderateScale(38),
    },
    footer: {
        backgroundColor: theme.colors.background.footer,
        borderRadius: theme.radius.xl,
        padding: spaces.large,
    },
    footerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
        marginBottom: spaces.medium,
    },
    checkCircle: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        borderWidth: 2,
        borderColor: theme.colors.text.inverse,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkMark: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.inverse,
        lineHeight: moderateScale(16),
    },
    footerTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(18),
        color: theme.colors.text.inverse,
    },
    footerStep: {
        fontSize: moderateScale(14),
        lineHeight: moderateScale(22),
        color: 'rgba(255, 255, 255, 0.92)',
        marginBottom: moderateScale(4),
    },
});

export default LifetimeCashbackCard;
