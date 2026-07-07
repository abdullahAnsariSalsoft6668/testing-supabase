import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const MoreStoresCard: React.FC = () => (
    <View style={styles.card}>
        <View style={styles.iconWrap}>
            <Text style={styles.icon}>📍</Text>
        </View>
        <View style={styles.content}>
            <TextComp text="More Stores Coming Soon" style={styles.title} />
            <TextComp
                text="We add new grocery partners every week. Available in US, CA, and UK."
                style={styles.description}
            />
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
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(22),
        backgroundColor: palette.neutral.cream,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    icon: {
        fontSize: moderateScale(20),
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

export default MoreStoresCard;
