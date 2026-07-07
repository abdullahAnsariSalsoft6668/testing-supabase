import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type SectionHeaderProps = {
    title: string;
    trailing?: string;
    onSeeAll?: () => void;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, trailing, onSeeAll }) => (
    <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {trailing ? <TextComp text={trailing} style={styles.trailing} /> : null}
        {onSeeAll ? (
            <Pressable onPress={onSeeAll} hitSlop={8}>
                <TextComp text="See All" style={styles.seeAll} />
            </Pressable>
        ) : null}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spaces.medium,
    },
    title: {
        flex: 1,
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontFamily: plusJakarta.bold,
    },
    trailing: {
        ...theme.typography.bodySmall,
        color: theme.colors.text.secondary,
        marginRight: spaces.small,
    },
    seeAll: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(13),
        color: theme.colors.brand.primary,
    },
});

export default SectionHeader;
