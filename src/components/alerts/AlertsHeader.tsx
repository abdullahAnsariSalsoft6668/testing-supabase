import TextComp from '@/components/TextComp';
import MyIcons from '@/components/MyIcons';
import routes from '@/constants/routes';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { UNREAD_ACCENT } from './constants';

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

type AlertsHeaderProps = {
    avatarSource: ImageSourcePropType;
    unreadCount: number;
    showBackButton?: boolean;
    onBack?: () => void;
};

const AlertsHeader: React.FC<AlertsHeaderProps> = ({
    avatarSource,
    unreadCount,
    showBackButton = true,
    onBack,
}) => {
    const navigation = useNavigation();
    const navStyle = useEntranceAnimation({ baseDelay: 30, translateY: 12 });
    const { animatedStyle: backScale, onPressIn, onPressOut } = usePressScale();

    const unreadLabel = useMemo(() => {
        if (unreadCount === 0) {
            return 'No unread notifications';
        }

        return `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`;
    }, [unreadCount]);

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

    const openProfile = useCallback(() => {
        navigation.navigate(routes.main.profile as never);
    }, [navigation]);

    return (
        <View style={styles.wrapper}>
            <Animated.View style={navStyle}>
                <View style={styles.topRow}>
                    {showBackButton ? (
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
                    ) : (
                        <View style={styles.iconSpacer} />
                    )}

                    <TextComp text="Notifications" style={styles.screenTitle} />

                    <View style={styles.actions}>
                        <View style={styles.iconButton}>
                            <MyIcons name="notification" size={moderateScale(18)} stroke={Colors.white} />
                            {unreadCount > 0 ? <View style={styles.badge} /> : null}
                        </View>
                        <Pressable onPress={openProfile} accessibilityRole="button" accessibilityLabel="Profile">
                            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
                        </Pressable>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.summaryRow}>
                <TextComp text={unreadLabel} style={styles.unreadSummary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: moderateScale(14),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(12),
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
    iconSpacer: {
        width: moderateScale(40),
        height: moderateScale(40),
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
    unreadSummary: {
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.bold,
        color: UNREAD_ACCENT,
    },
    summaryRow: {
        minHeight: moderateScale(20),
    },
});

export default React.memo(AlertsHeader);
