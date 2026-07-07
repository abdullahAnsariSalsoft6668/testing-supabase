import { nasalization } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyIcons from '@/components/MyIcons';

export function getTimeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning....';
    if (hour < 17) return 'Good Afternoon....';
    return 'Good Evening....';
}

export function getFirstName(userData: Record<string, unknown>, fallback = 'James'): string {
    const fullName = String(userData.fullName ?? userData.name ?? fallback).trim();
    return fullName.split(' ')[0] || fallback;
}

export interface HomeHeaderProps {
    avatarSource: ImageSourcePropType;
    userName?: string;
    title?: string;
    subtitle?: string;
    titleStyle?: TextStyle;
    subtitleStyle?: TextStyle;
    greeting?: string;
    onNotificationPress?: () => void;
    onAvatarPress?: () => void;
    showNotificationBadge?: boolean;
    showAvatarBorder?: boolean;
    style?: ViewStyle;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    avatarSource,
    userName = 'James',
    title,
    subtitle,
    titleStyle,
    subtitleStyle,
    greeting,
    onNotificationPress,
    onAvatarPress,
    showNotificationBadge = true,
    showAvatarBorder = false,
    style,
}) => {
    const navigation = useNavigation();
    const resolvedGreeting = useMemo(
        () => greeting ?? getTimeGreeting(),
        [greeting],
    );

    const handleAvatarPress = useCallback(() => {
        if (onAvatarPress) {
            onAvatarPress();
            return;
        }

        navigation.navigate(routes.main.profile as never);
    }, [navigation, onAvatarPress]);

    const displayTitle = title ?? `Hi, ${userName}`;
    const displaySubtitle = subtitle ?? (title ? undefined : resolvedGreeting);

    const avatar = (
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
    );

    const avatarContent = showAvatarBorder ? (
        <LinearGradient
            colors={[...Colors.buttonSplitBorderGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarBorder}
        >
            <View style={styles.avatarInner}>
                {avatar}
            </View>
        </LinearGradient>
    ) : (
        avatar
    );

    return (
        <View style={[styles.container, style]}>
            <View style={styles.profileRow}>
                <Pressable
                    onPress={handleAvatarPress}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Open profile"
                >
                    {avatarContent}
                </Pressable>
                <View style={styles.greetingBlock}>
                    <TextComp text={displayTitle} style={[styles.greetingName, titleStyle]} />
                    {displaySubtitle ? (
                        <TextComp
                            text={displaySubtitle}
                            style={[styles.greetingSub, subtitleStyle]}
                        />
                    ) : null}
                </View>
            </View>

            <Pressable
                onPress={onNotificationPress}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
            >
                <LinearGradient
                    colors={[...Colors.buttonSplitBorderGradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.notificationOuter}
                >
                    <View style={styles.notificationInner}>
                        <MyIcons name="notification" size={moderateScale(18)} />
                        {showNotificationBadge ? <View style={styles.notificationBadge} /> : null}
                    </View>
                </LinearGradient>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spaces.large,
        marginTop: spaces.small,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: moderateScale(12),
        marginRight: moderateScale(12),
    },
    avatar: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(24),
        backgroundColor: Colors.primary,
    },
    avatarBorder: {
        padding: moderateScale(1.6),
        borderRadius: moderateScale(100),
    },
    avatarInner: {
        borderRadius: moderateScale(100),
        overflow: 'hidden',
        borderWidth: moderateScale(4),
        borderColor: Colors.primary,
    },
    greetingBlock: {
        flex: 1,
    },
    greetingName: {
        fontSize: moderateScale(16),
        fontFamily: nasalization.regular,
        color: Colors.white,
    },
    greetingSub: {
        marginTop: moderateScale(2),
        fontSize: moderateScale(11),
        fontFamily: fontFamily.regular,
        color: Colors.gray300,
    },
    notificationOuter: {
        borderRadius: moderateScale(22),
        padding: moderateScale(1.6),
    },
    notificationInner: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: 100,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: moderateScale(4),
        borderColor: Colors.primary,
    },
    notificationBadge: {
        position: 'absolute',
        top: moderateScale(8),
        right: moderateScale(8),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: Colors.error,
        borderWidth: 1,
        borderColor: Colors.white,
    },
});

export default React.memo(HomeHeader);
