import TextComp from '@/components/TextComp';
import MyIcons from '@/components/MyIcons';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { localImages } from '@/assets/images';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
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

const PrivacySettingsScreenHeader: React.FC = () => {
    const navigation = useNavigation();
    const headerStyle = useEntranceAnimation({ baseDelay: 30, translateY: 12 });
    const { animatedStyle: backScale, onPressIn, onPressOut } = usePressScale();

    const handleBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    const openNotifications = useCallback(() => {
        navigateToAlertsTab(navigation);
    }, [navigation]);

    return (
        <Animated.View style={[styles.wrapper, headerStyle]}>
            <View style={styles.topRow}>
                <Animated.View style={backScale}>
                    <Pressable
                        onPress={handleBack}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={styles.iconButton}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <BackIcon />
                    </Pressable>
                </Animated.View>

                <TextComp text="Privacy Settings" style={styles.screenTitle} />

                <View style={styles.actions}>
                    <Pressable
                        onPress={openNotifications}
                        style={styles.iconButton}
                        accessibilityRole="button"
                        accessibilityLabel="Notifications"
                    >
                        <MyIcons name="notification" size={moderateScale(18)} stroke={Colors.white} />
                        <View style={styles.badge} />
                    </Pressable>
                    <Image source={localImages.user} style={styles.avatar} resizeMode="cover" />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: moderateScale(18),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
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
    screenTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
    },
    badge: {
        position: 'absolute',
        top: moderateScale(9),
        right: moderateScale(9),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        backgroundColor: Colors.gray600,
    },
});

export default React.memo(PrivacySettingsScreenHeader);
