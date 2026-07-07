import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import routes from '@/constants/routes';
import * as Screens from '@/screens';
import DoctorTabs from '@/navigation/DoctorTabStack';
import { DoctorStackParamList } from '@/navigation/types';
import type { AuthUserProfile } from '@/models/auth.types';
import { RootState } from '@/redux/store';
import { theme } from '@/styles/theme';

const Stack = createNativeStackNavigator<DoctorStackParamList>();

export const DoctorStack = () => {
    const user = useSelector((s: RootState) => s.auth.userData) as AuthUserProfile;
    const isPending = user?.doctor_status === 'PENDING';

    if (isPending) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
                <Stack.Screen name={routes.doctor.pendingApproval} component={Screens.DoctorPendingApproval} />
            </Stack.Navigator>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background.secondary } }}
            id={undefined}
        >
            <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
            <Stack.Screen name={routes.doctor.slotForm} component={Screens.SlotForm} />
            <Stack.Screen name={routes.doctor.appointmentDetail} component={Screens.DoctorAppointmentDetail} />
        </Stack.Navigator>
    );
};

export default DoctorStack;
