import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import MyIcons from '@/components/MyIcons';

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

type RouteDetailsHeaderProps = {
    routeName: string;
    date: string;
    timeRange: string;
    avatarSource: ImageSourcePropType;
    onBack?: () => void;
    onNotificationPress?: () => void;
};

const RouteDetailsHeader: React.FC<RouteDetailsHeaderProps> = ({
    routeName,
    date,
    timeRange,
    avatarSource,
    onBack,
    onNotificationPress,
}) => {
    const navigation = useNavigation();
    const headerStyle = useEntranceAnimation({ baseDelay: 30, translateY: 12 });
    const infoStyle = useEntranceAnimation({ baseDelay: 120, translateY: 14 });
    const { animatedStyle: backScale, onPressIn, onPressOut } = usePressScale();

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
        <View style={styles.wrapper}>
            <Animated.View style={headerStyle}>
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

                    <TextComp text="Route Details" style={styles.screenTitle} />

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
                        <Pressable onPress={openProfile} accessibilityRole="button" accessibilityLabel="Profile">
                            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
                        </Pressable>
                    </View>
                </View>
            </Animated.View>

            <Animated.View style={infoStyle}>
                <TextComp text={routeName} style={styles.routeName} />
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <MyIcons name="dateIcon" size={moderateScale(14)} />
                        <TextComp text={date} style={styles.metaText} />
                    </View>
                    <View style={styles.metaItem}>
                        <MyIcons name="time" size={moderateScale(14)} />
                        <TextComp text={timeRange} style={styles.metaText} />
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: moderateScale(28),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(18),
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
    routeName: {
        fontSize: moderateScale(22),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
        marginBottom: moderateScale(10),
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: moderateScale(16),
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    metaText: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: 'rgba(255, 255, 255, 0.78)',
    },
});

export default React.memo(RouteDetailsHeader);
