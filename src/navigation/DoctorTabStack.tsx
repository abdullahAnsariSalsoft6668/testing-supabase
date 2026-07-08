import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import routes, { doctorTabRoutes } from '@/constants/routes';
import HealthTabBar from '@/navigation/HealthTabBar';
import { DoctorTabParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Tab = createBottomTabNavigator<DoctorTabParamList>();

const DOCTOR_TABS = [
    { name: routes.doctor.tab.dashboard, label: 'Home', icon: 'healthTabHome' as const },
    { name: routes.doctor.tab.schedule, label: 'Schedule', icon: 'healthTabCalendar' as const },
    { name: routes.doctor.tab.appointments, label: 'Visits', icon: 'healthTabVisits' as const },
    { name: routes.doctor.tab.profile, label: 'Profile', icon: 'healthTabUser' as const },
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
