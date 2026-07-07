import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import TextComp from '@/components/TextComp';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

type HealthScreenHeaderProps = {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
    children?: React.ReactNode;
    style?: ViewStyle;
};

const HealthScreenHeader: React.FC<HealthScreenHeaderProps> = ({
    title,
    subtitle,
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
});

export default HealthScreenHeader;
