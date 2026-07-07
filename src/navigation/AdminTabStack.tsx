import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import routes, { adminTabRoutes } from '@/constants/routes';
import HealthTabBar from '@/navigation/HealthTabBar';
import { AdminTabParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Tab = createBottomTabNavigator<AdminTabParamList>();

const ADMIN_TABS = [
    { name: routes.admin.tab.dashboard, label: 'Home', icon: 'dashboard' as const, iconActive: 'dashboardActive' as const },
    { name: routes.admin.tab.hospitals, label: 'Hospitals', icon: 'shop' as const, iconActive: 'shop' as const },
    { name: routes.admin.tab.departments, label: 'Depts', icon: 'documentIcon' as const, iconActive: 'documentIcon' as const },
    { name: routes.admin.tab.doctors, label: 'Doctors', icon: 'supportStore' as const, iconActive: 'supportStore' as const },
    { name: routes.admin.tab.menu, label: 'Menu', icon: 'menu' as const, iconActive: 'menuActive' as const },
];

export const AdminTabs = () => (
    <Tab.Navigator
        screenOptions={{ headerShown: false, sceneStyle: { flex: 1, backgroundColor: theme.colors.background.secondary } }}
        tabBar={(props) => <HealthTabBar {...props} tabConfig={ADMIN_TABS} />}
        initialRouteName={routes.admin.tab.dashboard}
    >
        {Object.entries(adminTabRoutes).map(([name, Component]) => (
            <Tab.Screen key={name} name={name as keyof AdminTabParamList} component={Component} />
        ))}
    </Tab.Navigator>
);

export default AdminTabs;
