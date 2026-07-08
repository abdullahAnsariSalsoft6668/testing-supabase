import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import AuthPromptRow from '@/components/AuthPromptRow';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AuthStackParamList } from '@/navigation/types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { signIn } from '@/services/authService';
import { secureStorage } from '@/utils/secureStorage';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';
import styles from './styles';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

const Login = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formReady, setFormReady] = useState(false);
    const [initialValues, setInitialValues] = useState({ email: '', password: '' });

    useEffect(() => {
        void (async () => {
            try {
                const savedRemember = await secureStorage.getItem('REMEMBER_ME');
                const savedEmail = await secureStorage.getItem('REMEMBER_EMAIL');
                const shouldRemember = savedRemember === 'true' && Boolean(savedEmail?.trim());

                setRememberMe(shouldRemember);
                if (shouldRemember && savedEmail) {
                    setInitialValues({ email: savedEmail.trim(), password: '' });
                }
            } finally {
                setFormReady(true);
            }
        })();
    }, []);

    const persistRememberMe = useCallback(async (email: string, remember: boolean) => {
        if (remember) {
            await secureStorage.setItem('REMEMBER_ME', 'true');
            await secureStorage.setItem('REMEMBER_EMAIL', email.trim());
        } else {
            await secureStorage.removeItem('REMEMBER_ME');
            await secureStorage.removeItem('REMEMBER_EMAIL');
        }
    }, []);

    const toggleRememberMe = useCallback(async () => {
        const next = !rememberMe;
        setRememberMe(next);
        if (!next) {
            await persistRememberMe('', false);
        }
    }, [rememberMe, persistRememberMe]);

    const handleLogin = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            await signIn(values.email.trim(), values.password);
            await syncAuthFromSupabase();
            await persistRememberMe(values.email, rememberMe);
            Toast.show({ type: 'success', text1: 'Welcome back' });
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Login failed', text2: String(e) });
        } finally {
            setIsLoading(false);
        }
    };

    if (!formReady) {
        return (
            <AuthScreenLayout title="Login" subtitle="Sign in to manage your health appointments.">
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                    <ActivityIndicator color="#0B7285" />
                </View>
            </AuthScreenLayout>
        );
    }

    return (
        <AuthScreenLayout
            title="Login"
            subtitle="Sign in to manage your health appointments."
            footerStaggerIndex={4}
            footer={
                <AuthPromptRow
                    promptText="Don't have an account?"
                    linkText="Sign up free"
                    onLinkPress={() => navigation.navigate(routes.auth.register)}
                    lightTheme
                />
            }
        >
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <AuthTextInput
                            index={0}
                            label="Email"
                            required
                            placeholder="Enter your email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            error={errors.email}
                            touched={touched.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={1}
                            label="Password"
                            required
                            placeholder="Enter password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            error={errors.password}
                            touched={touched.password}
                            isPassword
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthStaggerItem index={2}>
                            <View style={styles.optionsRow}>
                                <TouchableOpacity
                                    style={styles.rememberRow}
                                    onPress={() => void toggleRememberMe()}
                                    activeOpacity={0.7}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: rememberMe }}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe ? (
                                            <TextComp text="✓" style={styles.checkMark} />
                                        ) : null}
                                    </View>
                                    <TextComp text="Remember me" style={styles.rememberText} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate(routes.auth.forgot)}>
                                    <TextComp text="Forgot password?" style={styles.forgotLink} />
                                </TouchableOpacity>
                            </View>
                        </AuthStaggerItem>
                        <AuthStaggerItem index={3}>
                            <AuthYellowButton
                                title="Sign In"
                                onPress={() => handleSubmit()}
                                loading={isLoading}
                                disabled={isLoading}
                                style={authStyles.actionButton}
                            />
                        </AuthStaggerItem>
                    </>
                )}
            </Formik>
        </AuthScreenLayout>
    );
};

export default Login;
