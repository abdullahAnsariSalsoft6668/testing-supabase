import { plusJakarta } from '@/assets/fonts';
import { resolveDriverFirstName } from '@/components/home/DriverHomeHeader';
import routes from '@/constants/routes';
import { useDrawer } from '@/context/DrawerContext';
import { useAuthStagger } from '@/hooks/animations/useAuthStagger';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { clearDataAction } from '@/redux/actions/auth';
import { useSelector } from '@/redux/hooks';
import { Colors } from '@/styles/colors';
import { theme } from '@/styles/theme';
import { moderateScale, width } from '@/styles/scaling';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    I18nManager,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppModal from './AppModal';
import {
    CloseIcon,
    HelpSupportIcon,
    LogoutIcon,
    ProfileIcon,
    SettingsIcon,
    WageOverviewIcon,
    WorkHistoryIcon,
} from './drawer/DrawerMenuIcons';
import TextComp from './TextComp';

const DRAWER_WIDTH = width * 0.8;
const DRAWER_MAIN_SHIFT = DRAWER_WIDTH * 0.72;
const DRAWER_BORDER_RADIUS = moderateScale(24);
const DRAWER_BG = '#001533';
const DRAWER_GLOW = '#003380';
const DRAWER_MID = '#002366';
const LOGOUT_RED = '#E53935';

const drawerLogo = require('@/assets/bootsplash/logo.png');

type MenuItem = {
    label: string;
    screen: string;
    icon: React.ReactNode;
};

const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Work History',
        screen: routes.main.workHistory,
        icon: <WorkHistoryIcon />,
    },
    {
        label: 'Wage Overview',
        screen: routes.main.wageOverview,
        icon: <WageOverviewIcon />,
    },
    {
        label: 'My Profile',
        screen: routes.main.profile,
        icon: <ProfileIcon />,
    },
    {
        label: 'Settings',
        screen: routes.main.setting,
        icon: <SettingsIcon />,
    },
    {
        label: 'Help & Support',
        screen: routes.main.helpSupport,
        icon: <HelpSupportIcon />,
    },
];

function readUserField(user: Record<string, unknown>, ...keys: string[]): string {
    for (const key of keys) {
        const value = user[key];
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return '';
}

function resolveDriverDisplayName(userData: Record<string, unknown>): string {
    const fullName = readUserField(userData, 'fullName', 'name');
    if (fullName) {
        return fullName;
    }

    const firstName = resolveDriverFirstName(userData, 'John');
    return `${firstName} Driver`;
}

function resolveDriverId(userData: Record<string, unknown>): string {
    return readUserField(userData, 'driverId', 'driverID', 'employeeId', 'id') || 'DR12345';
}

type DrawerMenuItemProps = {
    item: MenuItem;
    index: number;
    onPress: (screen: string) => void;
};

const DrawerMenuItem: React.FC<DrawerMenuItemProps> = ({ item, index, onPress }) => {
    const animatedStyle = useAuthStagger({
        index,
        baseDelay: 120,
        step: 45,
        translateY: 14,
    });
    const { animatedStyle: pressStyle, onPressIn, onPressOut } = usePressScale();

    const handlePress = useCallback(() => {
        onPress(item.screen);
    }, [item.screen, onPress]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.menuItem}
                accessibilityRole="button"
                accessibilityLabel={item.label}
            >
                <Animated.View style={[styles.menuItemInner, pressStyle]}>
                    {item.icon}
                    <TextComp text={item.label} style={styles.menuLabel} />
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const DrawerContent: React.FC = () => {
    const insets = useSafeAreaInsets();
    const { close } = useDrawer();
    const navigation = useNavigation<any>();
    const userData = useSelector(state => state.auth.userData);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const { animatedStyle: closeScale, onPressIn, onPressOut } = usePressScale();

    const driverName = useMemo(() => resolveDriverDisplayName(userData), [userData]);
    const driverId = useMemo(() => resolveDriverId(userData), [userData]);

    const handleNavigate = useCallback(
        (screen: string) => {
            navigation.navigate(routes.navigator.main as never, { screen } as never);
            setTimeout(() => close(), 0);
        },
        [close, navigation],
    );

    const handleLogout = useCallback(() => {
        setIsLogoutModalVisible(true);
    }, []);

    return (
        <View style={styles.drawerPanel}>
            <LinearGradient
                colors={['#00050a', DRAWER_BG, DRAWER_MID]}
                locations={[0, 0.55, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.drawerHeader, { paddingTop: insets.top + moderateScale(16) }]}
            >
                <LinearGradient
                    colors={[DRAWER_GLOW, 'transparent']}
                    locations={[0, 1]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.headerGlow}
                    pointerEvents="none"
                />

                <View style={styles.logoRow}>
                    <Image source={drawerLogo} style={styles.logo} resizeMode="contain" />
                    <Animated.View style={closeScale}>
                        <Pressable
                            onPress={close}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            hitSlop={moderateScale(10)}
                            accessibilityRole="button"
                            accessibilityLabel="Close menu"
                        >
                            <CloseIcon />
                        </Pressable>
                    </Animated.View>
                </View>

                <TextComp text={driverName} style={styles.profileName} />
                <TextComp text={`Driver ID: ${driverId}`} style={styles.profileId} />
            </LinearGradient>

            <ScrollView
                style={styles.menuScroll}
                contentContainerStyle={styles.menuScrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.menuSection}>
                    {MENU_ITEMS.map((item, index) => (
                        <DrawerMenuItem
                            key={item.label}
                            item={item}
                            index={index}
                            onPress={handleNavigate}
                        />
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + moderateScale(16) }]}>
                <View style={styles.footerDivider} />
                <Pressable
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    accessibilityRole="button"
                    accessibilityLabel="Logout"
                >
                    <LogoutIcon />
                    <TextComp text="Logout" style={styles.logoutLabel} />
                </Pressable>
            </View>

            <AppModal
                isVisible={isLogoutModalVisible}
                onClose={() => setIsLogoutModalVisible(false)}
                type="logout"
                title="Are you sure you want to logout?"
                primaryButtonText="Yes"
                secondaryButtonText="No"
                message=""
                onSecondaryPress={() => setIsLogoutModalVisible(false)}
                onPrimaryPress={() => {
                    setIsLogoutModalVisible(false);
                    close();
                    setTimeout(() => clearDataAction(), 400);
                }}
            />
        </View>
    );
};

interface AnimatedDrawerProps {
    children: React.ReactNode;
}

const AnimatedDrawer: React.FC<AnimatedDrawerProps> = ({ children }) => {
    const { isOpen, progress, close } = useDrawer();

    const mainAnimatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(progress.value, [0, 1], [1, 0.92]);
        const translateX = interpolate(progress.value, [0, 1], [0, DRAWER_MAIN_SHIFT]);
        const borderRadius = interpolate(progress.value, [0, 1], [0, DRAWER_BORDER_RADIUS]);

        return {
            transform: [{ translateX }, { scale }],
            borderRadius,
        };
    });

    const drawerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(progress.value, [0, 1], [-DRAWER_WIDTH, 0]),
            },
        ],
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 0.55]),
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.drawerContainer, drawerAnimatedStyle]}>
                <DrawerContent />
            </Animated.View>

            <Animated.View style={[styles.mainContainer, mainAnimatedStyle]}>
                <View style={styles.mainContent}>{children}</View>
                <Animated.View
                    style={[StyleSheet.absoluteFill, styles.overlay, overlayAnimatedStyle]}
                    pointerEvents={isOpen ? 'auto' : 'none'}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={close}
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DRAWER_BG,
    },
    drawerContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: DRAWER_WIDTH,
        zIndex: 2,
    },
    drawerPanel: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopRightRadius: moderateScale(24),
        borderBottomRightRadius: moderateScale(24),
        overflow: 'hidden',
    },
    mainContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: theme.colors.background.primary,
    },
    mainContent: {
        flex: 1,
    },
    overlay: {
        backgroundColor: Colors.black,
    },
    drawerHeader: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(24),
    },
    headerGlow: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(22),
    },
    logo: {
        width: moderateScale(150),
        height: moderateScale(52),
    },
    profileName: {
        color: Colors.white,
        fontSize: moderateScale(22),
        fontFamily: plusJakarta.bold,
        marginBottom: moderateScale(6),
    },
    profileId: {
        color: 'rgba(255, 255, 255, 0.78)',
        fontSize: moderateScale(14),
        fontFamily: plusJakarta.regular,
    },
    menuScroll: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    menuScrollContent: {
        paddingTop: moderateScale(12),
        paddingBottom: moderateScale(12),
    },
    menuSection: {
        paddingHorizontal: moderateScale(20),
        gap: moderateScale(4),
    },
    menuItem: {
        borderRadius: moderateScale(10),
    },
    menuItemInner: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(14),
        gap: moderateScale(14),
    },
    menuLabel: {
        color: '#333333',
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.regular,
    },
    footer: {
        backgroundColor: Colors.white,
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(8),
    },
    footerDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.gray200,
        marginBottom: moderateScale(8),
    },
    logoutButton: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(14),
        gap: moderateScale(14),
    },
    logoutLabel: {
        color: LOGOUT_RED,
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
    },
});

export default AnimatedDrawer;
