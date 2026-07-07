import DrawerScreenBackButton from '@/components/drawer/DrawerScreenBackButton';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { navigateToAlertsTab } from '@/navigation/navigateToAlerts';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

type ProfileHeaderProps = {
    avatarSource: ImageSourcePropType;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarSource }) => {
    const navigation = useNavigation();
    const headerStyle = useEntranceAnimation({ baseDelay: 30, translateY: 12 });

    const openNotifications = useCallback(() => {
        navigateToAlertsTab(navigation);
    }, [navigation]);

    return (
        <Animated.View style={[styles.wrapper, headerStyle]}>
            <View style={styles.topRow}>
                <DrawerScreenBackButton />

                <TextComp text="My Profile" style={styles.screenTitle} />

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
                    <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
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

export default React.memo(ProfileHeader);
