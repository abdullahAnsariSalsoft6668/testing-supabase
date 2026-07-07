import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import routes from '@/constants/routes';
import type { AuthUserProfile } from '@/models/auth.types';
import AuthStack from '@/navigation/AuthStack';
import { AdminStack } from '@/navigation/AdminStack';
import { DoctorStack } from '@/navigation/DoctorStack';
import { PatientStack } from '@/navigation/PatientStack';
import { RootStackParamList } from '@/navigation/types';
import { RootState } from '@/redux/store';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { onAuthStateChange } from '@/services/authService';
import { theme } from '@/styles/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background.secondary,
    },
};

export const Routes = () => {
    const { auth_token, userData } = useSelector((state: RootState) => state.auth);
    const user = userData as AuthUserProfile;
    const isAuthenticated = Boolean(auth_token?.trim());

    useEffect(() => {
        let authSubscription: { unsubscribe: () => void } | undefined;

        void syncAuthFromSupabase();

        try {
            const { data } = onAuthStateChange((_event, session) => {
                if (session) {
                    void syncAuthFromSupabase();
                }
            });
            authSubscription = data.subscription;
        } catch (error) {
            console.warn('[Auth] onAuthStateChange setup failed:', error);
        }

        return () => authSubscription?.unsubscribe();
    }, []);

    let screen: React.ReactNode;
    if (!isAuthenticated) {
        screen = <Stack.Screen name="Auth" component={AuthStack} />;
    } else if (user?.role === 'ADMIN') {
        screen = <Stack.Screen name="Admin" component={AdminStack} />;
    } else if (user?.role === 'DOCTOR') {
        screen = <Stack.Screen name="Doctor" component={DoctorStack} />;
    } else {
        screen = <Stack.Screen name="Patient" component={PatientStack} />;
    }

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator
                key={isAuthenticated ? user?.role ?? 'auth' : 'guest'}
                screenOptions={{ headerShown: false }}
                id={undefined}
            >
                {screen}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;
