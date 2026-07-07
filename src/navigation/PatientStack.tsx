import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from '@/constants/routes';
import * as Screens from '@/screens';
import PatientTabs from '@/navigation/PatientTabStack';
import { PatientStackParamList } from '@/navigation/types';
import { theme } from '@/styles/theme';

const Stack = createNativeStackNavigator<PatientStackParamList>();

export const PatientStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background.secondary } }} id={undefined}>
        <Stack.Screen name="PatientTabs" component={PatientTabs} />
        <Stack.Screen name={routes.patient.hospitalDepartments} component={Screens.HospitalDepartments} />
        <Stack.Screen name={routes.patient.departmentDoctors} component={Screens.DepartmentDoctors} />
        <Stack.Screen name={routes.patient.doctorDetail} component={Screens.DoctorDetail} />
        <Stack.Screen name={routes.patient.bookAppointment} component={Screens.BookAppointment} />
        <Stack.Screen name={routes.patient.appointmentDetail} component={Screens.AppointmentDetail} />
    </Stack.Navigator>
);

export default PatientStack;
