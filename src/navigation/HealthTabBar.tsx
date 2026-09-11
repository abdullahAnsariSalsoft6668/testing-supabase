import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { TAB_ACTIVE_COLOR, TAB_ICON_SIZE, TAB_INACTIVE_COLOR, tabBarStyles } from '@/navigation/tabBarStyles';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { LayoutChangeEvent, Pressable, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOTION_SPRING } from '@/styles/motion';
import { moderateScale } from '@/styles/scaling';

export type TabConfigItem = {
    name: string;
    label: string;
    icon: IconName;
};

type HealthTabBarProps = BottomTabBarProps & {
    tabConfig: TabConfigItem[];
};

const HealthTabBar = ({ state, descriptors, navigation, tabConfig }: HealthTabBarProps) => {
    const insets = useSafeAreaInsets();
    const tabWidth = useSharedValue(0);
    const underlineX = useSharedValue(0);

    useEffect(() => {
        if (tabWidth.value <= 0) return;
        underlineX.value = withSpring(state.index * tabWidth.value, MOTION_SPRING.tabPill);
    }, [state.index, tabWidth.value, underlineX]);

    const onTabsLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width - moderateScale(16);
        tabWidth.value = width / state.routes.length;
        underlineX.value = state.index * tabWidth.value;
    };

    const underlineStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: underlineX.value + (tabWidth.value - moderateScale(22)) / 2 }],
    }));

    const focusedRoute = state.routes[state.index];
    const focusedOptions = descriptors[focusedRoute.key].options;
    const hidden =
        focusedOptions.tabBarStyle != null &&
        (focusedOptions.tabBarStyle as { display?: string }).display === 'none';

    const barAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: hidden ? moderateScale(72) : 0 },
            { scale: hidden ? 0.94 : 1 },
        ],
        opacity: hidden ? 0 : 1,
    }));

    return (
        <Animated.View
            style={[
                tabBarStyles.outer,
                { paddingBottom: Math.max(insets.bottom, moderateScale(8)) },
                barAnimatedStyle,
            ]}
        >
            <View style={tabBarStyles.bar}>
                <View style={tabBarStyles.tabsRow} onLayout={onTabsLayout}>
                    {state.routes.map((route, index) => {
                        const config = tabConfig.find((t) => t.name === route.name) ?? tabConfig[0];
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconColor = isFocused ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR;

                        return (
                            <Pressable
                                key={route.key}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                onPress={() => {
                                    const event = navigation.emit({
                                        type: 'tabPress',
                                        target: route.key,
                                        canPreventDefault: true,
                                    });
                                    if (!isFocused && !event.defaultPrevented) {
                                        navigation.navigate(route.name);
                                    }
                                }}
                                style={tabBarStyles.tabItem}
                            >
                                <MyIcons name={config.icon} size={TAB_ICON_SIZE} stroke={iconColor} />
                                <TextComp
                                    text={config.label}
                                    style={[
                                        tabBarStyles.tabLabel,
                                        isFocused ? tabBarStyles.tabLabelActive : tabBarStyles.tabLabelInactive,
                                    ]}
                                    numberOfLines={1}
                                />
                            </Pressable>
                        );
                    })}
                </View>
                <View style={tabBarStyles.underlineTrack} pointerEvents="none">
                    <Animated.View style={[tabBarStyles.underline, underlineStyle]} />
                </View>
            </View>
        </Animated.View>
    );
};

export default HealthTabBar;
