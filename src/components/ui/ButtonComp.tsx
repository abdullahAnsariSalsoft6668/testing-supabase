import React from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MyIcons, { type IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { hapticLight } from '@/utils/haptics';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type ButtonSize = 's' | 'm' | 'l';

const HEIGHTS: Record<ButtonSize, number> = {
    s: moderateScale(44),
    m: moderateScale(50),
    l: moderateScale(56),
};

type ButtonCompProps = {
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    size?: ButtonSize;
    variant?: 'primary' | 'secondary' | 'outline';
    rightIcon?: IconName;
    style?: StyleProp<ViewStyle>;
    testID?: string;
};

const ButtonComp = ({
    label,
    onPress,
    disabled,
    loading,
    size = 'm',
    variant = 'primary',
    rightIcon,
    style,
    testID,
}: ButtonCompProps) => {
    const height = HEIGHTS[size];
    const isPrimary = variant === 'primary';

    const handlePress = () => {
        if (disabled || loading) return;
        hapticLight();
        onPress?.();
    };

    if (isPrimary) {
        return (
            <ScalePressable
                onPress={handlePress}
                disabled={disabled || loading}
                style={[styles.wrapper, { height, opacity: disabled ? 0.5 : 1 }, style]}
                testID={testID}
                accessibilityRole="button"
            >
                <LinearGradient
                    colors={[...theme.gradients.primaryButton]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.primaryGradient, { height }]}
                >
                    <TextComp text={label} style={typography.button} />
                    {rightIcon ? (
                        <View style={styles.iconPanel}>
                            <MyIcons name={rightIcon} size={moderateScale(16)} stroke={Colors.ink} />
                        </View>
                    ) : null}
                    {loading ? (
                        <View style={styles.loaderOverlay}>
                            <ActivityIndicator color={Colors.ink} />
                        </View>
                    ) : null}
                </LinearGradient>
            </ScalePressable>
        );
    }

    return (
        <ScalePressable
            onPress={handlePress}
            disabled={disabled || loading}
            style={[
                styles.secondary,
                variant === 'outline' && styles.outline,
                { height, opacity: disabled ? 0.5 : 1 },
                style,
            ]}
            testID={testID}
            accessibilityRole="button"
        >
            {loading ? (
                <ActivityIndicator color={theme.colors.text.primary} />
            ) : (
                <TextComp
                    text={label}
                    style={[typography.label, { color: theme.colors.text.primary, textTransform: 'none' }]}
                />
            )}
        </ScalePressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: theme.radius.button,
        overflow: 'hidden',
        ...theme.shadows.button,
    },
    primaryGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
        gap: moderateScale(10),
    },
    iconPanel: {
        width: moderateScale(32),
        height: moderateScale(32),
        borderRadius: moderateScale(10),
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(30, 117, 229, 0.35)',
    },
    secondary: {
        borderRadius: theme.radius.button,
        backgroundColor: theme.colors.button.secondaryBackground,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(20),
    },
    outline: {
        backgroundColor: theme.colors.card.background,
        borderWidth: 1,
        borderColor: theme.colors.border.default,
    },
});

export default ButtonComp;
