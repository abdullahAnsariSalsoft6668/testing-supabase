import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import routes, { doctorTabRoutes } from '@/constants/routes';
import HealthTabBar from '@/navigation/HealthTabBar';
import { DoctorTabParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

const DOCTOR_TABS = [
    { name: routes.doctor.tab.dashboard, label: 'Home', icon: 'dashboard' as const, iconActive: 'dashboardActive' as const },
    { name: routes.doctor.tab.schedule, label: 'Schedule', icon: 'calendar' as const, iconActive: 'calendarBlue' as const },
    { name: routes.doctor.tab.appointments, label: 'Visits', icon: 'calendarClock' as const, iconActive: 'calendarClock' as const },
    { name: routes.doctor.tab.profile, label: 'Profile', icon: 'menu' as const, iconActive: 'menuActive' as const },
];

export const DoctorTabs = () => (
    <Tab.Navigator
        screenOptions={{ headerShown: false, sceneStyle: { flex: 1, backgroundColor: theme.colors.background.secondary } }}
        tabBar={(props) => <HealthTabBar {...props} tabConfig={DOCTOR_TABS} />}
        initialRouteName={routes.doctor.tab.dashboard}
    >
        {Object.entries(doctorTabRoutes).map(([name, Component]) => (
            <Tab.Screen key={name} name={name as keyof DoctorTabParamList} component={Component} />
        ))}
    </Tab.Navigator>
);

export default DoctorTabs;
