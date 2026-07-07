import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    ViewStyle,
    View,
    TextStyle,
    TouchableOpacity,
    I18nManager,
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import fontFamily from '@/styles/fontFamily';
import { height, moderateScale } from '@/styles/scaling';
import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import TextComp from './TextComp';
import { borders, heights, spaces } from '@/styles/sizes';
import MyIcons, { IconName } from './MyIcons';

interface TextInputCompProps extends TextInputProps {
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    error?: boolean | string;
    touched?: boolean;
    placeholder?: string;
    leftIcon?: React.ReactNode;
    onLeftIconPress?: () => void;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    underline?: boolean;
    label?: string;
    required?: boolean;
    labelStyle?: TextStyle;
    placeholderTextColor?: string;
    inputContainerStyle?: ViewStyle;
    /** Shows eye / eyeclose toggle and manages secureTextEntry */
    isPassword?: boolean;
    /** Enables focus border glow + error shake (auth screens) */
    enableFocusAnimation?: boolean;
}

const TextInputComp: React.FC<TextInputCompProps> = ({
    containerStyle,
    inputStyle,
    error,
    touched,
    placeholder = '',
    leftIcon,
    onLeftIconPress,
    rightIcon,
    onRightIconPress,
    underline,
    label,
    required,
    labelStyle,
    placeholderTextColor,
    inputContainerStyle,
    isPassword = false,
    enableFocusAnimation = false,
    secureTextEntry,
    onFocus,
    onBlur,
    ...props
}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const focused = useSharedValue(0);
    const shakeX = useSharedValue(0);
    const hasError = Boolean(error && touched);
    const resolvedPlaceholderColor = placeholderTextColor ?? Colors.inputPlaceholder;
    const resolvedSecureTextEntry = isPassword ? !passwordVisible : secureTextEntry;

    const passwordToggleIcon =
        isPassword && !rightIcon ? (
            <MyIcons name={passwordVisible ? 'eye' : 'eyeclose'} size={20} />
        ) : null;

    const resolvedRightIcon = rightIcon ?? passwordToggleIcon;
    const resolvedOnRightIconPress =
        onRightIconPress ??
        (isPassword && !rightIcon ? () => setPasswordVisible((v) => !v) : undefined);

    useEffect(() => {
        if (!enableFocusAnimation || !hasError) {
            shakeX.value = 0;
            return;
        }
        shakeX.value = 0;
    }, [enableFocusAnimation, hasError, shakeX]);

    const animatedInputStyle = useAnimatedStyle(() => {
        if (!enableFocusAnimation) {
            return {};
        }

        return {
            borderColor: hasError
                ? Colors.error
                : isFocused
                  ? palette.purple.main
                  : Colors.gray100,
            borderWidth: isFocused && !hasError ? 1.5 : 1,
        };
    }, [enableFocusAnimation, hasError, isFocused]);

    const InputShell = enableFocusAnimation ? Animated.View : View;

    return (
        <View style={containerStyle}>
            {label && (
                <View style={styles.labelContainer}>
                    <TextComp text={label} style={[styles.label, labelStyle]} />
                    {required && <TextComp text="*" style={styles.requiredStar} />}
                </View>
            )}
            <InputShell
                style={[
                    styles.container,
                    underline && styles.underlineContainer,
                    !enableFocusAnimation && error && touched && styles.errorContainer,
                    inputContainerStyle,
                    enableFocusAnimation && animatedInputStyle,
                ]}
            >
                {leftIcon && (
                    <TouchableOpacity
                        onPress={onLeftIconPress}
                        disabled={!onLeftIconPress}
                        style={styles.leftIconWrap}
                    >
                        <MyIcons name={leftIcon as IconName} size={20} />
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[
                        styles.input,
                        underline && styles.underlineInput,
                        error && touched && styles.errorInput,
                        inputStyle,
                    ]}
                    placeholderTextColor={resolvedPlaceholderColor}
                    placeholder={placeholder}
                    textAlign={I18nManager.isRTL ? 'right' : 'left'}
                    secureTextEntry={resolvedSecureTextEntry}
                    onFocus={(event) => {
                        setIsFocused(true);
                        focused.value = 1;
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setIsFocused(false);
                        focused.value = 0;
                        onBlur?.(event);
                    }}
                    {...props}
                />
                {resolvedRightIcon ? (
                    <TouchableOpacity
                        onPress={resolvedOnRightIconPress}
                        disabled={!resolvedOnRightIconPress}
                        style={styles.rightIconWrap}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                        {resolvedRightIcon}
                    </TouchableOpacity>
                ) : null}
            </InputShell>
            {error && touched && typeof error === 'string' && (
                <TextComp text={error} style={styles.errorText} />
            )}
            {error && touched && typeof error !== 'string' && placeholder && (
                <TextComp text={`${placeholder} is required`} style={styles.errorText} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: borders.input,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBackground,
        height: heights.input,
        paddingHorizontal: spaces.medium,

    },
    leftIconWrap: {
        marginEnd: moderateScale(10),
    },
    rightIconWrap: {
        marginStart: moderateScale(8),
        marginRight: moderateScale(8)
    },
    underlineContainer: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: Colors.white,
        borderRadius: 0,
        paddingHorizontal: 0,
    },
    input: {
        flex: 1,
        fontFamily: fontFamily.regular,
        fontSize: moderateScale(14),
        color: Colors.black,
        padding: 0,
        margin: 0,
    },
    underlineInput: {
        color: Colors.white,
    },
    labelContainer: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        marginBottom: moderateScale(8),
        marginLeft: 0,
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.label,
        color: Colors.text,
    },
    requiredStar: {
        color: Colors.error,
        marginStart: moderateScale(4),
    },
    errorContainer: {
        borderColor: Colors.error,
    },
    errorInput: {
        color: Colors.error,
    },
    errorText: {
        color: Colors.error,
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        marginTop: moderateScale(4),
        textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
});

export default React.memo(TextInputComp);
