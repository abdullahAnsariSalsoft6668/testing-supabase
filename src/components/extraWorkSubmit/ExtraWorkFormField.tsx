import TextComp from '@/components/TextComp';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { borders, heights, spaces } from '@/styles/sizes';
import React, { useEffect } from 'react';
import {
    I18nManager,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { FORM_STAGGER_BASE, FORM_STAGGER_STEP } from './constants';

type ExtraWorkFormFieldProps = TextInputProps & {
    index: number;
    label: string;
    required?: boolean;
    leftIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    error?: boolean | string;
    touched?: boolean;
};

const ExtraWorkFormField: React.FC<ExtraWorkFormFieldProps> = ({
    index,
    label,
    required,
    leftIcon,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    error,
    touched,
    placeholder = '',
    onFocus,
    onBlur,
    ...props
}) => {
    const animatedStyle = useAuthStagger({
        index,
        baseDelay: FORM_STAGGER_BASE,
        step: FORM_STAGGER_STEP,
    });
    const focused = useSharedValue(0);
    const shakeX = useSharedValue(0);
    const hasError = Boolean(error && touched);

    useEffect(() => {
        shakeX.value = 0;
    }, [hasError, shakeX]);

    const inputAnimatedStyle = useAnimatedStyle(() => ({
        borderColor: hasError ? Colors.error : Colors.gray100,
    }));

    return (
        <Animated.View style={[styles.wrapper, containerStyle, animatedStyle]}>
            <View style={styles.labelRow}>
                <TextComp text={label} style={styles.label} />
                {required ? <TextComp text="*" style={styles.required} /> : null}
            </View>
            <Animated.View style={[styles.inputShell, inputContainerStyle, inputAnimatedStyle]}>
                {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.inputPlaceholder}
                    textAlign={I18nManager.isRTL ? 'right' : 'left'}
                    onFocus={event => {
                        onFocus?.(event);
                    }}
                    onBlur={event => {
                        onBlur?.(event);
                    }}
                    {...props}
                />
            </Animated.View>
            {hasError && typeof error === 'string' ? (
                <TextComp text={error} style={styles.errorText} />
            ) : null}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: moderateScale(16),
    },
    labelRow: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        marginBottom: moderateScale(8),
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    required: {
        color: Colors.error,
        marginStart: moderateScale(4),
        fontSize: moderateScale(14),
    },
    inputShell: {
        borderWidth: 1,
        borderColor: Colors.gray100,
        borderRadius: borders.input,
        backgroundColor: Colors.inputBackgroundApp,
        minHeight: heights.input,
        paddingHorizontal: spaces.medium,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
    },
    leftIcon: {
        marginEnd: moderateScale(10),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: Colors.text,
        padding: 0,
        margin: 0,
    },
    errorText: {
        color: Colors.error,
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        marginTop: moderateScale(6),
    },
});

export default React.memo(ExtraWorkFormField);
