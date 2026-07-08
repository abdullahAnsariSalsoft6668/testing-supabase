import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import routes, { patientTabRoutes } from '@/constants/routes';
import HealthTabBar from '@/navigation/HealthTabBar';
import { PatientTabParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Tab = createBottomTabNavigator<PatientTabParamList>();

const PATIENT_TABS = [
    { name: routes.patient.tab.home, label: 'Home', icon: 'healthTabHome' as const },
    { name: routes.patient.tab.explore, label: 'Explore', icon: 'healthTabSearch' as const },
    { name: routes.patient.tab.appointments, label: 'Visits', icon: 'healthTabVisits' as const },
    { name: routes.patient.tab.reports, label: 'Reports', icon: 'healthTabFile' as const },
    { name: routes.patient.tab.profile, label: 'Profile', icon: 'healthTabUser' as const },
];

export const PatientTabs = () => (
    <Tab.Navigator
        screenOptions={{ headerShown: false, sceneStyle: { flex: 1, backgroundColor: theme.colors.background.secondary } }}
        tabBar={(props) => <HealthTabBar {...props} tabConfig={PATIENT_TABS} />}
        initialRouteName={routes.patient.tab.home}
    >
        {Object.entries(patientTabRoutes).map(([name, Component]) => (
            <Tab.Screen key={name} name={name as keyof PatientTabParamList} component={Component} />
        ))}
    </Tab.Navigator>
);

export default PatientTabs;
