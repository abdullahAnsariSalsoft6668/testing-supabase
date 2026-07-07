import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import { usePressScale } from '@/hooks/animations/usePressScale';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import Animated from 'react-native-reanimated';

const BackIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M15 6l-6 6 6 6"
            stroke={palette.neutral.text}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const ProductDetailsBackButton: React.FC = () => {
    const navigation = useNavigation();
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    const handleBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handleBack}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.button}
                accessibilityRole="button"
                accessibilityLabel="Go back"
            >
                <BackIcon />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: palette.neutral.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...{
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 3,
        },
    },
});

export default ProductDetailsBackButton;
