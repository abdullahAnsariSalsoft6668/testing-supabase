import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from '@/constants/routes';
import * as Screens from '@/screens';
import AdminTabs from '@/navigation/AdminTabStack';
import { AdminStackParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background.secondary } }} id={undefined}>
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name={routes.admin.hospitalForm} component={Screens.HospitalForm} />
        <Stack.Screen name={routes.admin.departmentForm} component={Screens.DepartmentForm} />
        <Stack.Screen name={routes.admin.doctorDetailAdmin} component={Screens.DoctorDetailAdmin} />
    </Stack.Navigator>
);

export default AdminStack;
