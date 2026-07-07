import routes from '@/constants/routes';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const BackIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M15 6l-6 6 6 6"
            stroke={Colors.white}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type DrawerScreenBackButtonProps = {
    onBack?: () => void;
    style?: StyleProp<ViewStyle>;
};

const DrawerScreenBackButton: React.FC<DrawerScreenBackButtonProps> = ({ onBack, style }) => {
    const navigation = useNavigation();
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
            return;
        }
        if (navigation.canGoBack()) {
            navigation.goBack();
            return;
        }
        navigation.navigate(routes.tab.home as never);
    }, [navigation, onBack]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handleBack}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.iconButton, style]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
            >
                <BackIcon />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(DrawerScreenBackButton);
