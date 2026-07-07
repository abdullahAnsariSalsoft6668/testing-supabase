import React from 'react';
import { StyleSheet, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type SavingsSummaryBoxProps = {
    totalSaved: string;
    savedPercentLabel: string;
    savePercentBadge: string;
};

const SavingsSummaryBox: React.FC<SavingsSummaryBoxProps> = ({
    totalSaved,
    savedPercentLabel,
    savePercentBadge,
}) => (
    <View style={styles.box}>
        <View style={styles.textBlock}>
            <TextComp text={`You Save ${totalSaved}`} style={styles.title} />
            <TextComp text={savedPercentLabel} style={styles.subtitle} />
        </View>
        <View style={styles.badge}>
            <TextComp text={savePercentBadge} style={styles.badgeText} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    box: {
        backgroundColor: theme.colors.brand.primary,
        borderRadius: theme.radius.lg,
        padding: spaces.medium,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spaces.small,
    },
    textBlock: {
        flex: 1,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(16),
        color: theme.colors.text.inverse,
        marginBottom: moderateScale(2),
    },
    subtitle: {
        fontSize: moderateScale(12),
        color: 'rgba(255, 255, 255, 0.9)',
    },
    badge: {
        backgroundColor: palette.green.main,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(6),
    },
    badgeText: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(11),
        color: theme.colors.text.inverse,
    },
});

export default SavingsSummaryBox;
