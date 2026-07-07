import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import type { PrivacyFeatureItem } from './constants';

type PrivacyFeatureCardProps = {
    feature: PrivacyFeatureItem;
};

const PrivacyFeatureCard: React.FC<PrivacyFeatureCardProps> = ({ feature }) => (
    <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: feature.iconBg }]}>
            <Text style={styles.emoji}>{feature.emoji}</Text>
        </View>
        <View style={styles.content}>
            <TextComp text={feature.title} style={styles.title} />
            <TextComp text={feature.description} style={styles.description} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        marginBottom: spaces.medium,
        ...theme.shadows.card,
    },
    iconWrap: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    emoji: {
        fontSize: moderateScale(22),
    },
    content: {
        flex: 1,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(4),
    },
    description: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.secondary,
    },
});

export default PrivacyFeatureCard;
