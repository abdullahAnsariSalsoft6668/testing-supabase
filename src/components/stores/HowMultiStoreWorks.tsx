import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type HowMultiStoreWorksProps = {
    steps: readonly string[];
};

const HowMultiStoreWorks: React.FC<HowMultiStoreWorksProps> = ({ steps }) => (
    <View style={styles.footer}>
        <TextComp text="How Multi-Store Savings Works" style={styles.title} />
        {steps.map(step => (
            <View key={step} style={styles.stepRow}>
                <Text style={styles.bullet}>•</Text>
                <TextComp text={step} style={styles.step} />
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    footer: {
        backgroundColor: theme.colors.background.footer,
        borderRadius: theme.radius.xl,
        padding: spaces.large,
        marginBottom: spaces.medium,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(17),
        color: theme.colors.text.inverse,
        marginBottom: spaces.medium,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: moderateScale(6),
    },
    bullet: {
        fontSize: moderateScale(14),
        color: theme.colors.text.inverse,
        lineHeight: moderateScale(22),
        marginRight: moderateScale(8),
    },
    step: {
        flex: 1,
        fontSize: moderateScale(13),
        lineHeight: moderateScale(22),
        color: 'rgba(255, 255, 255, 0.92)',
    },
});

export default HowMultiStoreWorks;
