import TextComp from '@/components/TextComp';
import MyIcons from '@/components/MyIcons';
import routes from '@/constants/routes';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import DrawerScreenBackButton from '@/components/drawer/DrawerScreenBackButton';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

type HelpSupportHeaderProps = {
    avatarSource: ImageSourcePropType;
    title?: string;
    subtitle?: string;
};

const HelpSupportHeader: React.FC<HelpSupportHeaderProps> = ({
    avatarSource,
    title = 'Help & Support',
    subtitle = 'Get assistance and find answers',
}) => {
    const navigation = useNavigation();
    const navStyle = useEntranceAnimation({ baseDelay: 30, translateY: 12 });
    const subtitleStyle = useEntranceAnimation({ baseDelay: 100, translateY: 14 });

    const openNotifications = useCallback(() => {
        navigateToAlertsTab(navigation);
    }, [navigation]);

    const openProfile = useCallback(() => {
        navigation.navigate(routes.main.profile as never);
    }, [navigation]);

    return (
        <View style={styles.wrapper}>
            <Animated.View style={navStyle}>
                <View style={styles.topRow}>
                    <DrawerScreenBackButton />

                    <TextComp text={title} style={styles.screenTitle} />

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

            <Animated.View style={subtitleStyle}>
                <TextComp text={subtitle} style={styles.subtitle} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: moderateScale(18),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(10),
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
    subtitle: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
        color: '#8BB8FF',
    },
});

export default React.memo(HelpSupportHeader);
