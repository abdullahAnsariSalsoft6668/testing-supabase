import { getFirstName } from '@/components/HomeHeader';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { useDrawerSafe } from '@/context/DrawerContext';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const MenuIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 20 20" fill="none">
        <Path d="M3 5h14M3 10h14M3 15h14" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

type DriverHomeHeaderProps = {
    avatarSource: ImageSourcePropType;
    userName: string;
    onNotificationPress?: () => void;
};

const DriverHomeHeader: React.FC<DriverHomeHeaderProps> = ({
    avatarSource,
    userName,
    onNotificationPress,
}) => {
    const navigation = useNavigation();
    const drawer = useDrawerSafe();
    const headerStyle = useEntranceAnimation({ baseDelay: 40, translateY: 14 });
    const { animatedStyle: menuScale, onPressIn, onPressOut } = usePressScale();

    const openDrawer = useCallback(() => {
        drawer?.open();
    }, [drawer]);

    const openNotifications = useCallback(() => {
        if (onNotificationPress) {
            onNotificationPress();
            return;
        }
        navigateToAlertsTab(navigation);
    }, [navigation, onNotificationPress]);

    const openProfile = useCallback(() => {
        navigation.navigate(routes.main.profile as never);
    }, [navigation]);

    return (
        <Animated.View style={[styles.container, headerStyle]}>
            <Animated.View style={menuScale}>
                <Pressable
                    onPress={openDrawer}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={styles.iconButton}
                    accessibilityRole="button"
                    accessibilityLabel="Open menu"
                >
                    <MenuIcon />
                </Pressable>
            </Animated.View>

            <View style={styles.greetingBlock}>
                <TextComp text={`Hi, ${userName}! 👋`} style={styles.title} />
                <TextComp text="Have a Safe Drive Today!" style={styles.subtitle} />
            </View>

            <View style={styles.actions}>
                <Pressable
                    onPress={openNotifications}
                    style={styles.iconButton}
                    accessibilityRole="button"
                    accessibilityLabel="Notifications"
                >
                    <MyIcons name="notificationWhite" size={moderateScale(18)}/>
                    {/* <View style={styles.badge} /> */}
                </Pressable>

                <Pressable
                    onPress={openProfile}
                    accessibilityRole="button"
                    accessibilityLabel="Open profile"
                >
                    <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
                </Pressable>
            </View>
        </Animated.View>
    );
};

export function resolveDriverFirstName(
    userData: Record<string, unknown>,
    fallback = 'Myles',
): string {
    return getFirstName(userData, fallback);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
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
    greetingBlock: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(18),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
    subtitle: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.68)',
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

export default React.memo(DriverHomeHeader);
