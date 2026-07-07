import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { TAB_ICON_SIZE, tabBarStyles } from '@/navigation/tabBarStyles';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabConfigItem = {
    name: string;
    label: string;
    icon: IconName;
    iconActive: IconName;
};

type HealthTabBarProps = BottomTabBarProps & {
    tabConfig: TabConfigItem[];
};

const HealthTabBar = ({ state, descriptors, navigation, tabConfig }: HealthTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[tabBarStyles.outer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            <View style={tabBarStyles.bar}>
                <View style={tabBarStyles.tabsRow}>
                    {state.routes.map((route, index) => {
                        const config = tabConfig.find((t) => t.name === route.name) ?? tabConfig[0];
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconName = isFocused ? config.iconActive : config.icon;

                        return (
                            <TouchableOpacity
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
                                activeOpacity={0.7}
                            >
                                <MyIcons name={iconName} size={TAB_ICON_SIZE} />
                                <TextComp
                                    text={config.label}
                                    style={[
                                        tabBarStyles.tabLabel,
                                        isFocused ? tabBarStyles.tabLabelActive : tabBarStyles.tabLabelInactive,
                                    ]}
                                    numberOfLines={1}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default HealthTabBar;
