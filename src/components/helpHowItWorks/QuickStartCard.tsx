import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import { QUICK_START_STEPS } from './constants';

const QuickStartCard: React.FC = () => (
    <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.headerEmoji}>⚡</Text>
            <TextComp text="Quick Start (60 seconds)" style={styles.headerTitle} />
        </View>

        {QUICK_START_STEPS.map((step, index) => (
            <View
                key={step.id}
                style={[styles.stepRow, index < QUICK_START_STEPS.length - 1 && styles.stepBorder]}
            >
                <View style={styles.stepBadge}>
                    <TextComp text={String(step.step)} style={styles.stepNumber} />
                </View>
                <Text style={styles.stepEmoji}>{step.emoji}</Text>
                <View style={styles.stepContent}>
                    <TextComp text={step.title} style={styles.stepTitle} />
                    <TextComp text={step.description} style={styles.stepDescription} />
                </View>
            </View>
        ))}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette.neutral.cream,
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(12),
        gap: moderateScale(8),
    },
    headerEmoji: {
        fontSize: moderateScale(16),
    },
    headerTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(14),
    },
    stepBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: palette.neutral.gray100,
    },
    stepBadge: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: palette.yellow.main,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(8),
        marginTop: moderateScale(2),
    },
    stepNumber: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(12),
        color: theme.colors.text.primary,
    },
    stepEmoji: {
        fontSize: moderateScale(18),
        marginRight: moderateScale(10),
        marginTop: moderateScale(2),
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(2),
    },
    stepDescription: {
        fontSize: moderateScale(12),
        lineHeight: moderateScale(18),
        color: theme.colors.text.secondary,
    },
});

export default QuickStartCard;
