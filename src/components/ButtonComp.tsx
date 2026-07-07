import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    DimensionValue,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { I18nManager } from 'react-native';

import { brittiSans } from '@/assets/fonts';
import TextComp from './TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { borders } from '@/styles/sizes';
import MyIcons from './MyIcons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonType = 'animated' | 'normal';
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 's' | 'm' | 'l';
type IconSizeToken = 's' | 'm' | 'l';

const BORDER_WIDTH = moderateScale(2);
const ICON_PANEL_RATIO = 0.2;

const SIZE_TOKENS: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
    s: {
        height: moderateScale(44),
        paddingHorizontal: moderateScale(16),
        fontSize: moderateScale(13),
    },
    m: {
        height: moderateScale(50),
        paddingHorizontal: moderateScale(20),
        fontSize: moderateScale(15),
    },
    l: {
        height: moderateScale(56),
        paddingHorizontal: moderateScale(24),
        fontSize: moderateScale(16),
    },
};

const ICON_SIZE_TOKENS: Record<IconSizeToken, number> = {
    s: moderateScale(12),
    m: moderateScale(14),
    l: moderateScale(16),
};

function resolveIconSize(iconSize: IconSizeToken | number | undefined, size: ButtonSize): number {
    if (typeof iconSize === 'number') return iconSize;
    const token = iconSize ?? size;
    return ICON_SIZE_TOKENS[token];
}

function isSplitVariant(variant: ButtonVariant | 'premium'): boolean {
    return variant === 'primary' || variant === 'premium';
}

export interface ButtonCompProps {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    loading?: boolean;
    /** animated = loading shrinks to loader circle; normal = loading shows spinner only */
    type?: ButtonType;
    /** primary / premium = split gradient CTA; secondary / outline = flat styles */
    variant?: ButtonVariant | 'premium';
    size?: ButtonSize;
    iconSize?: IconSizeToken | number;
    style?: ViewStyle;
    textStyle?: TextStyle;
    width?: DimensionValue;
    height?: number;
    gradientColors?: readonly string[];
    leftIcon?: React.ReactNode;
    /** `true` shows default enter icon panel; pass a node to override */
    rightIcon?: boolean | React.ReactNode;
    contentStyle?: ViewStyle;
}

const DEFAULT_RADIUS = borders.button;

function stripWidthAndBorderRadius(s: ViewStyle): ViewStyle {
    const flat = StyleSheet.flatten(s) as Record<string, unknown> | undefined;
    if (!flat) {
        return {};
    }
    const { width: _w, borderRadius: _r, ...rest } = flat;
    return rest as ViewStyle;
}

const ButtonComp: React.FC<ButtonCompProps> = ({
    onPress,
    title,
    disabled = false,
    loading = false,
    type = 'normal',
    variant: variantProp = 'primary',
    size = 'm',
    iconSize,
    style = {},
    textStyle,
    width = '100%',
    height,
    gradientColors,
    leftIcon,
    rightIcon,
    contentStyle,
}) => {
    const variant: ButtonVariant | 'premium' = variantProp;
    const hasCustomGradient = hasCustomFillGradient(gradientColors);
    /** Custom fill without icon panel → flat gradient (no split border outline). */
    const split = isSplitVariant(variant) && !(hasCustomGradient && !rightIcon);
    const isOutline = variant === 'outline';
    const showIconPanel = split && Boolean(rightIcon);

    const [fullWidth, setFullWidth] = useState<number | null>(null);
    const loadingProgress = useSharedValue(loading ? 1 : 0);

    const sizeToken = SIZE_TOKENS[size];
    const effectiveHeight = height ?? sizeToken.height;
    const resolvedIconSize = resolveIconSize(iconSize, size);
    const iconPanelWidth = showIconPanel
        ? Math.max(effectiveHeight - BORDER_WIDTH * 2, effectiveHeight * ICON_PANEL_RATIO)
        : 0;

    const flattenedStyle = StyleSheet.flatten(style) as { borderRadius?: number } | undefined;
    const radius = flattenedStyle?.borderRadius ?? DEFAULT_RADIUS;
    const innerRadius = Math.max(radius - BORDER_WIDTH, 0);

    useEffect(() => {
        loadingProgress.value = withTiming(loading ? 1 : 0, { duration: 0 });
    }, [loading, loadingProgress]);

    const onLayout = useCallback(
        (e: LayoutChangeEvent) => {
            if (!loading && fullWidth === null) {
                setFullWidth(e.nativeEvent.layout.width);
            }
        },
        [loading, fullWidth],
    );

    const useAnimatedLoadingLayout = type === 'animated' && fullWidth != null;

    const animatedLoadingLayoutStyle = useAnimatedStyle(() => {
        if (!useAnimatedLoadingLayout || fullWidth == null) {
            return {};
        }
        return {
            width: interpolate(loadingProgress.value, [0, 1], [fullWidth, effectiveHeight]),
            borderRadius: interpolate(loadingProgress.value, [0, 1], [radius, effectiveHeight / 2]),
        };
    }, [fullWidth, effectiveHeight, radius, useAnimatedLoadingLayout]);

    const contentOpacityStyle = useAnimatedStyle(() => {
        if (type === 'normal') {
            return { opacity: loading ? 0 : 1 };
        }
        return {
            opacity: interpolate(loadingProgress.value, [0, 0.5], [1, 0]),
        };
    });

    const loaderOpacityStyle = useAnimatedStyle(() => {
        if (type === 'normal') {
            return { opacity: loading ? 1 : 0 };
        }
        return {
            opacity: interpolate(loadingProgress.value, [0.5, 1], [0, 1]),
        };
    });

    const fillGradient =
        disabled && split
            ? ([Colors.gray200, Colors.gray200] as const)
            : hasCustomGradient
                ? gradientColors!
                : ([
                    Colors.buttonSplitFillStart,
                    Colors.buttonSplitFillMid,
                    Colors.buttonSplitFillEnd,
                ] as const);

    const borderGradient: readonly [string, string, ...string[]] =
        disabled && split
            ? [Colors.gray300, Colors.gray300]
            : Colors.buttonSplitBorderGradient;

    const labelColor = split
        ? Colors.buttonSplitLabel
        : isOutline
            ? Colors.text
            : Colors.white;

    const loaderColor = isOutline ? Colors.text : Colors.white;

    const userStyleForRoot = useAnimatedLoadingLayout ? stripWidthAndBorderRadius(style) : style;

    const rootStyle = [
        styles.root,
        useAnimatedLoadingLayout
            ? { height: effectiveHeight + BORDER_WIDTH * 2 }
            : { width, height: effectiveHeight + (split ? BORDER_WIDTH * 2 : 0), borderRadius: radius },
        userStyleForRoot,
        (disabled || loading) && styles.disabled,
        useAnimatedLoadingLayout ? animatedLoadingLayoutStyle : null,
    ];

    const renderRightArrowIcon = () => (
        <MyIcons
            name="rightArrow"
            size={resolvedIconSize}
            fill={Colors.buttonSplitIconStroke}
        />
    );

    const iconNode =
        rightIcon === true
            ? renderRightArrowIcon()
            : typeof rightIcon === 'object'
              ? rightIcon
              : null;

    const renderIconPanel = () => {
        if (!showIconPanel) {
            return null;
        }

        return (
            <>
                <View style={styles.divider} />
                <View
                    style={[
                        styles.iconPanel,
                        {
                            width: iconPanelWidth,
                            backgroundColor: disabled
                                ? Colors.gray600
                                : Colors.buttonSplitIconBackground,
                        },
                    ]}
                >
                    {iconNode}
                </View>
            </>
        );
    };

    const renderSplitBody = () => (
        <LinearGradient
            colors={[...borderGradient]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.borderShell, { borderRadius: radius, padding: BORDER_WIDTH }]}
        >
            <View
                style={[
                    styles.splitInner,
                    {
                        borderRadius: innerRadius,
                        minHeight: effectiveHeight,
                    },
                ]}
            >
                <LinearGradient
                    colors={fillGradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={[
                        styles.fillSection,
                        {
                            paddingHorizontal: sizeToken.paddingHorizontal,
                        },
                    ]}
                >
                    <Animated.View style={[styles.splitLabelRow, contentOpacityStyle, contentStyle]}>
                        {leftIcon ? <View style={styles.leftIconSlot}>{leftIcon}</View> : null}
                        <TextComp
                            text={title}
                            style={[
                                styles.splitLabel,
                                { fontSize: sizeToken.fontSize, color: labelColor },
                                textStyle,
                            ]}
                        />
                    </Animated.View>
                </LinearGradient>
                {renderIconPanel()}
            </View>
        </LinearGradient>
    );

    const renderClassicBody = () => {
        const useCustomGradient = hasCustomGradient && !isOutline;
        const gradientColorsResolved =
            disabled && !isOutline
                ? [Colors.gray200, Colors.gray200]
                : useCustomGradient
                    ? [...gradientColors!]
                    : variant === 'primary' || variant === 'premium'
                        ? [...Colors.gradientButtonPrimary]
                        : [...Colors.gradientSecondary];

        const gradientStyle = [
            styles.classicGradient,
            { paddingHorizontal: sizeToken.paddingHorizontal, minHeight: effectiveHeight },
        ];

        const content = (
            <>
                <Animated.View style={[styles.classicContent, contentOpacityStyle, contentStyle]}>
                    {leftIcon ? <View style={styles.classicIconSlot}>{leftIcon}</View> : null}
                    <TextComp
                        text={title}
                        style={[
                            styles.classicLabel,
                            { fontSize: sizeToken.fontSize, color: labelColor },
                            textStyle,
                        ]}
                    />
                    {rightIcon ? (
                        <View style={styles.classicIconSlot}>
                            {rightIcon === true ? (
                                <MyIcons name="rightArrow" size={resolvedIconSize} fill={Colors.white} />
                            ) : (
                                rightIcon
                            )}
                        </View>
                    ) : null}
                </Animated.View>
                <Animated.View style={[styles.loaderWrap, loaderOpacityStyle]} pointerEvents="none">
                    <ActivityIndicator color={loaderColor} size="small" />
                </Animated.View>
            </>
        );

        if (isOutline) {
            return (
                <View style={[gradientStyle, styles.outlineInner, { borderRadius: radius }]}>
                    {content}
                </View>
            );
        }

        return (
            <LinearGradient
                colors={gradientColorsResolved as [string, string, ...string[]]}
                style={[gradientStyle, { borderRadius: radius }]}
            >
                {content}
            </LinearGradient>
        );
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            disabled={disabled || loading}
            onLayout={onLayout}
            style={rootStyle}
        >
            {split ? renderSplitBody() : renderClassicBody()}
            {split ? (
                <Animated.View style={[styles.loaderWrap, loaderOpacityStyle]} pointerEvents="none">
                    <ActivityIndicator color={Colors.buttonSplitLabel} size="small" />
                </Animated.View>
            ) : null}
        </AnimatedPressable>
    );
};

function hasCustomFillGradient(colors?: readonly string[]): boolean {
    return (colors?.length ?? 0) > 0;
}

const styles = StyleSheet.create({
    root: {
        overflow: 'hidden',
        alignSelf: 'stretch',
    },
    borderShell: {
        width: '100%',
    },
    splitInner: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        overflow: 'hidden',
        backgroundColor: Colors.transparent,
    },
    fillSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splitLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: moderateScale(8),
    },
    splitLabel: {
        fontFamily: brittiSans.semiBold,
        textAlign: 'center',
        letterSpacing: moderateScale(1.2),
        textTransform: 'uppercase',
    },
    divider: {
        width: StyleSheet.hairlineWidth,
        minWidth: 1,
        backgroundColor: Colors.buttonSplitDivider,
        alignSelf: 'stretch',
    },
    iconPanel: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftIconSlot: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderWrap: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.72,
    },
    classicGradient: {
        flex: 1,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    outlineInner: {
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    classicContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
        flex: 1,
    },
    classicLabel: {
        fontFamily: fontFamily.bold,
        textAlign: 'center',
        flex: 1,
    },
    classicIconSlot: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ButtonComp;
