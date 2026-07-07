import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import MyIcons, { type IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { plusJakarta } from '@/assets/fonts';
import { palette } from '@/styles/palette';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const FEATURE_ICON_SIZE = moderateScale(40);

type MenuFeatureRowProps = {
    icon: IconName;
    title: string;
    subtitle: string;
    onPress?: () => void;
    showDivider?: boolean;
};

const MenuFeatureRow: React.FC<MenuFeatureRowProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    showDivider = true,
}) => (
    <>
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            accessibilityRole="button"
        >
            <View style={styles.iconWrap}>
                <MyIcons name={icon} size={FEATURE_ICON_SIZE} />
            </View>
            <View style={styles.textBlock}>
                <TextComp text={title} style={styles.title} />
                <TextComp text={subtitle} style={styles.subtitle} />
            </View>
            <MyIcons name="rightChevron" size={moderateScale(18)} stroke={palette.neutral.textMuted} />
        </Pressable>
        {showDivider ? <View style={styles.divider} /> : null}
    </>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(16),
    },
    rowPressed: {
        opacity: 0.72,
    },
    iconWrap: {
        width: moderateScale(44),
        height: moderateScale(44),
        borderRadius: moderateScale(12),
        backgroundColor: palette.neutral.gray50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spaces.medium,
    },
    textBlock: {
        flex: 1,
        paddingRight: spaces.small,
    },
    title: {
        fontFamily: plusJakarta.bold,
        fontSize: moderateScale(15),
        color: theme.colors.text.primary,
        marginBottom: moderateScale(2),
    },
    subtitle: {
        fontSize: moderateScale(12),
        color: theme.colors.text.secondary,
        lineHeight: moderateScale(18),
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: palette.neutral.gray100,
    },
});

export default MenuFeatureRow;
