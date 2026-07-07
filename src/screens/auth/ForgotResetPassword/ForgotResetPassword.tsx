// import { useResetPassMutation } from '@/api/resetPassApiSlice';
import AuthPromptRow from '@/components/AuthPromptRow';
import routes from '@/constants/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import * as Yup from 'yup';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';

const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'At least 6 characters').required('Required'),
    confirmPassword: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ForgotResetPassword: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'ForgotResetPassword'>>();
    const email = String(route.params?.email ?? '').trim();
    const otp = String(route.params?.otp ?? '').trim();

    const isLoading = false;

    useEffect(() => {
        if (!email || !otp) {
            navigation.goBack();
        }
    }, [email, otp, navigation]);

    const handleReset = useCallback(
        async (_values: { password: string; confirmPassword: string }) => {
            navigation.reset({
                index: 0,
                routes: [{ name: routes.auth.login }],
            });
        },
        [navigation],
    );

    const handleBackToLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: routes.auth.login }],
        });
    };

    return (
        <AuthScreenLayout
            title="Reset Password"
            subtitle="Choose a strong new password for your account."
            footerStaggerIndex={3}
            footer={
                <AuthPromptRow
                    promptText="Remember your password?"
                    linkText="Back to login"
                    onLinkPress={handleBackToLogin}
                    lightTheme
                />
            }
        >
            <Formik
                initialValues={{ password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={handleReset}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <>
                        <AuthTextInput
                            index={0}
                            label="New Password"
                            required
                            placeholder="New password"
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

                        <AuthTextInput
                            index={1}
                            label="Confirm Password"
                            required
                            placeholder="Confirm password"
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            isPassword
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />

                        <AuthStaggerItem index={2}>
                            <AuthYellowButton
                                title="Update Password"
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

export default ForgotResetPassword;
