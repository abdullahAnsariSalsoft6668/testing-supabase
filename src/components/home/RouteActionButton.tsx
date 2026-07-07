import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import type { RouteActionVariant } from './types';
import { ROUTE_CONTINUE_GRADIENT, ROUTE_START_GRADIENT } from './constants';

type RouteActionButtonProps = {
    variant: RouteActionVariant;
    onPress?: () => void;
    style?: ViewStyle;
};

const ACTION_COPY: Record<RouteActionVariant, string> = {
    continue: 'Continue Route',
    start: 'Start Route',
    details: 'View Details',
};

const RouteActionButton: React.FC<RouteActionButtonProps> = ({
    variant,
    onPress,
    style,
}) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();
    const isDetails = variant === 'details';

    const labelStyle = isDetails ? styles.detailsLabel : styles.label;

    const content = (
        <Animated.View style={[styles.content, animatedStyle]}>
            {variant === 'start' ? (
                <MyIcons name="buttonPlay" size={moderateScale(14)} />
            ) : null}
            <TextComp text={ACTION_COPY[variant]} style={labelStyle} />
            {isDetails ? (
                <MyIcons name="rightChevron" size={moderateScale(12)} />
            ) : (
                <MyIcons name="rightArrow" size={moderateScale(14)} fill={Colors.white} />
            )}
        </Animated.View>
    );

    if (isDetails) {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.detailsButton, style]}
            >
                {content}
            </Pressable>
        );
    }

    const gradient =
        variant === 'continue' ? ROUTE_CONTINUE_GRADIENT : ROUTE_START_GRADIENT;

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.pressable, style]}
        >
            <LinearGradient
                colors={[...gradient]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientButton}
            >
                {content}
            </LinearGradient>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        flex: 1,
    },
    gradientButton: {
        minHeight: moderateScale(48),
        borderRadius: moderateScale(12),
        justifyContent: 'center',
        paddingHorizontal: moderateScale(16),
    },
    detailsButton: {
        minHeight: moderateScale(48),
        borderRadius: moderateScale(12),
        backgroundColor: Colors.gray100,
        justifyContent: 'center',
        paddingHorizontal: moderateScale(16),
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(8),
    },
    label: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        textAlign: 'center',
    },
    detailsLabel: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: Colors.gray500,
        textAlign: 'center',
    },
});

export default React.memo(RouteActionButton);
