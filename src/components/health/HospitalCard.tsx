import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { listItemEntering } from '@/hooks/animations/listMotion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type HospitalCardProps = {
    name: string;
    address?: string | null;
    phone?: string | null;
    index?: number;
    onPress?: () => void;
};

const HospitalCard = ({ name, address, phone, index = 0, onPress }: HospitalCardProps) => (
    <ScalePressable onPress={onPress}>
        <Animated.View entering={listItemEntering(index)} style={styles.card}>
            <View style={styles.iconWash}>
                <MyIcons name="healthTabHome" size={moderateScale(20)} stroke={theme.palette.lime.main} />
            </View>
            <View style={styles.info}>
                <TextComp text={name} style={typography.label} />
                {address ? <TextComp text={address} style={styles.meta} numberOfLines={2} /> : null}
                {phone ? <TextComp text={phone} style={styles.meta} /> : null}
            </View>
        </Animated.View>
    </ScalePressable>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        ...theme.shadows.card,
        gap: moderateScale(14),
    },
    iconWash: {
        width: theme.iconWash.size,
        height: theme.iconWash.size,
        borderRadius: theme.iconWash.radius,
        backgroundColor: theme.iconWash.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: { flex: 1, gap: moderateScale(4) },
    meta: {
        ...typography.bodySmall,
    },
});

export default HospitalCard;
