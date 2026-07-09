import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type HealthScreenHeaderProps = {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
    style?: ViewStyle;
};

const HealthScreenHeader: React.FC<HealthScreenHeaderProps> = ({
    title,
    subtitle,
    onBack,
    rightAction,
    children,
    style,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={[...theme.gradients.header]}
            style={[styles.hero, { paddingTop: insets.top + moderateScale(12) }, style]}
        >
            <View style={styles.content}>
                {onBack ? (
                    <Pressable onPress={onBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <View style={styles.backIconWrap}>
                            <MyIcons name="arrowChevron" size={16} stroke={theme.colors.text.inverse} />
                        </View>
                        <TextComp text="Back" style={styles.backBtnText} />
                    </Pressable>
                ) : null}
                <View style={styles.titleRow}>
                    <View style={styles.titleBlock}>
                        <TextComp text={title} style={styles.title} />
                        {subtitle ? <TextComp text={subtitle} style={styles.subtitle} /> : null}
                    </View>
                    {rightAction}
                </View>
                {children}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    hero: {
        paddingHorizontal: spaces.medium,
        paddingBottom: moderateScale(24),
    },
    content: { gap: moderateScale(12) },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    titleBlock: { flex: 1, paddingRight: spaces.small },
    title: {
        fontSize: moderateScale(22),
        fontWeight: '700',
        color: theme.colors.text.inverse,
    },
    subtitle: {
        fontSize: moderateScale(13),
        color: 'rgba(255,255,255,0.88)',
        marginTop: moderateScale(4),
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: moderateScale(8),
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(7),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
    },
    backIconWrap: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backBtnText: {
        color: theme.colors.text.inverse,
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
});

export default HealthScreenHeader;
