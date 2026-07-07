import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

import type { HelpFaqSection } from './constants';
import { FaqAccordionList } from './FaqAccordionItem';

type HelpFaqSectionCardProps = {
    section: HelpFaqSection;
};

const HelpFaqSectionCard: React.FC<HelpFaqSectionCardProps> = ({ section }) => (
    <View style={styles.card}>
        <View style={[styles.header, { backgroundColor: section.headerBg }]}>
            <Text style={styles.headerEmoji}>{section.emoji}</Text>
            <TextComp text={section.title} style={styles.headerTitle} />
        </View>
        <View style={styles.body}>
            <FaqAccordionList questions={section.questions} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(12),
        gap: moderateScale(8),
    },
    headerEmoji: {
        fontSize: moderateScale(16),
    },
    headerTitle: {
        flex: 1,
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
    },
    body: {
        paddingHorizontal: spaces.medium,
    },
});

export default HelpFaqSectionCard;
