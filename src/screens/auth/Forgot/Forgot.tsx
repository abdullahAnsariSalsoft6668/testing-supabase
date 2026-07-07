import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import AuthPromptRow from '@/components/AuthPromptRow';
import routes from '@/constants/routes';
import { AuthStackParamList } from '@/navigation/types';
import { resetPassword } from '@/services/authService';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';

const Forgot = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
    });

    const handleForgotPassword = async (values: { email: string }) => {
        setIsLoading(true);
        try {
            await resetPassword(values.email.trim());
            Toast.show({ type: 'success', text1: 'Reset email sent', text2: 'Check your inbox.' });
            navigation.navigate(routes.auth.login);
        } catch (e: unknown) {
            Toast.show({ type: 'error', text1: 'Failed to send reset email', text2: String(e) });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthScreenLayout
            title="Forgot Password"
            subtitle="Enter your email and we'll send a reset link."
            footerStaggerIndex={2}
            footer={
                <AuthPromptRow
                    promptText="Remember your password?"
                    linkText="Back to login"
                    onLinkPress={() => navigation.goBack()}
                    lightTheme
                />
            }
        >
            <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleForgotPassword}
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
                        <AuthStaggerItem index={1}>
                            <AuthYellowButton
                                title="Send Reset Link"
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

export default Forgot;
