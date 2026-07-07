import MyIcons, { IconName } from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { TAB_ICON_SIZE, tabBarStyles } from '@/navigation/tabBarStyles';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabConfig = {
    label: string;
    icon: IconName;
    iconActive: IconName;
};

const TAB_CONFIG: Record<string, TabConfig> = {
    [routes.tab.home]: {
        label: 'Home',
        icon: 'home',
        iconActive: 'homeActive',
    },
    [routes.tab.deals]: {
        label: 'Deals',
        icon: 'deals',
        iconActive: 'dealsActive',
    },
    [routes.tab.cashback]: {
        label: 'Cashback',
        icon: 'cashbacks',
        iconActive: 'cashbacksActive',
    },
    [routes.tab.insights]: {
        label: 'Insights',
        icon: 'insights',
        iconActive: 'insightActive',
    },
    [routes.tab.menu]: {
        label: 'Menu',
        icon: 'menu',
        iconActive: 'menuActive',
    },
};

function getTabConfig(routeName: string): TabConfig {
    return (
        TAB_CONFIG[routeName] ?? {
            label: routeName,
            icon: 'home',
            iconActive: 'homeActive',
        }
    );
}

interface TabItemProps {
    route: { name: string; key: string };
    isFocused: boolean;
    onPress: () => void;
    options: Record<string, unknown>;
}

const TabItem = React.memo(({ route, isFocused, onPress, options }: TabItemProps) => {
    const config = getTabConfig(route.name);
    const iconName = isFocused ? config.iconActive : config.icon;

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={(options.tabBarAccessibilityLabel as string) ?? config.label}
            testID={options.tabBarTestID as string | undefined}
            onPress={onPress}
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
});

const MyTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[tabBarStyles.outer, { paddingBottom: Math.max(insets.bottom, 8) }]}
            pointerEvents="box-none"
        >
            <View style={tabBarStyles.bar}>
                <View style={tabBarStyles.tabsRow}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate({
                                    name: route.name,
                                    params: undefined,
                                    merge: true,
                                });
                            }
                        };

                        return (
                            <TabItem
                                key={route.key}
                                route={route}
                                isFocused={isFocused}
                                onPress={onPress}
                                options={options as Record<string, unknown>}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default React.memo(MyTabBar);
