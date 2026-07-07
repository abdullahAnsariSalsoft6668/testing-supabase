import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import MyIcons, { type IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const ACTION_ICON_SIZE = moderateScale(36);

type MenuActionCardProps = {
    label: string;
    icon: IconName;
    onPress?: () => void;
};

const MenuActionCard: React.FC<MenuActionCardProps> = ({ label, icon, onPress }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
    >
        <MyIcons name={icon} size={ACTION_ICON_SIZE} />
        <TextComp text={label} style={styles.label} />
    </Pressable>
);

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.lg,
        paddingVertical: moderateScale(22),
        paddingHorizontal: spaces.medium,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.card,
    },
    cardPressed: {
        opacity: 0.85,
    },
    label: {
        marginTop: moderateScale(10),
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(14),
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
});

export default MenuActionCard;
