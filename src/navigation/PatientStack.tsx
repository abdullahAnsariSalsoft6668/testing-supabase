import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import routes from '@/constants/routes';
import * as Screens from '@/screens';
import PatientTabs from '@/navigation/PatientTabStack';
import { PatientStackParamList } from '@/navigation/types';
import type { AuthUserProfile } from '@/models/auth.types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { RootState } from '@/redux/store';
import { theme } from '@/styles/theme';

const Stack = createNativeStackNavigator<PatientStackParamList>();

export const PatientStack = () => {
    const user = useSelector((s: RootState) => s.auth.userData) as AuthUserProfile;

    useEffect(() => {
        void syncAuthFromSupabase();
    }, []);

    const hasPatientProfile = Boolean(user?.patient_id ?? user?.patient?.id);

    if (!hasPatientProfile) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
                <Stack.Screen name={routes.auth.completeProfile} component={Screens.CompleteProfile} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background.secondary } }}
            id={undefined}
        >
            <Stack.Screen name="PatientTabs" component={PatientTabs} />
            <Stack.Screen name={routes.patient.hospitalDepartments} component={Screens.HospitalDepartments} />
            <Stack.Screen name={routes.patient.departmentDoctors} component={Screens.DepartmentDoctors} />
            <Stack.Screen name={routes.patient.doctorDetail} component={Screens.DoctorDetail} />
            <Stack.Screen name={routes.patient.bookAppointment} component={Screens.BookAppointment} />
            <Stack.Screen name={routes.patient.appointmentDetail} component={Screens.AppointmentDetail} />
        </Stack.Navigator>
    );
};

export default PatientStack;
