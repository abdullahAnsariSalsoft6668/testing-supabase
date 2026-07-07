import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import AuthPromptRow from '@/components/AuthPromptRow';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import { AuthStackParamList } from '@/navigation/types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { signUp } from '@/services/authService';
import type { UserRole } from '@/types/database';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';
import styles from './styles';

const Register = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<UserRole>('PATIENT');

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().trim().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        phone: Yup.string().trim(),
        password: Yup.string().min(6, 'Password too short').required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Required'),
        acceptedTerms: Yup.boolean().oneOf([true], 'Please accept the terms to continue'),
    });

    const handleRegister = async (values: {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
        acceptedTerms: boolean;
    }) => {
        setIsLoading(true);
        try {
            await signUp({
                email: values.email.trim(),
                password: values.password,
                fullName: values.fullName.trim(),
                phone: values.phone.trim(),
                role,
            });
            await syncAuthFromSupabase();
            Toast.show({
                type: 'success',
                text1: 'Account created',
                text2: 'Check your email to verify your account.',
            });
        } catch (e: unknown) {
            const message =
                e && typeof e === 'object' && 'message' in e
                    ? String((e as { message: string }).message)
                    : String(e);
            Toast.show({
                type: 'error',
                text1: 'Registration failed',
                text2:
                    message === 'Database error saving new user' ||
                    message.includes('handle_new_user failed')
                        ? 'Run supabase/migrations/006_signup_works_with_name_column.sql in Supabase SQL Editor, then retry.'
                        : message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthScreenLayout
            title="Sign Up"
            subtitle="Create your health account in seconds."
            cardStyle={styles.cardContainerTall}
            footerStaggerIndex={7}
            footer={
                <AuthPromptRow
                    promptText="Already have an account?"
                    linkText="Sign in"
                    onLinkPress={() => navigation.navigate(routes.auth.login)}
                    lightTheme
                />
            }
        >
            <Formik
                initialValues={{
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    acceptedTerms: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                    submitCount,
                }) => (
                    <>
                        <AuthStaggerItem index={0}>
                            <TextComp text="I am a" style={{ marginBottom: moderateScale(8), fontWeight: '600' }} />
                            <View style={{ flexDirection: 'row', gap: 8, marginBottom: moderateScale(16) }}>
                                {(['PATIENT', 'DOCTOR'] as UserRole[]).map((r) => (
                                    <Pressable
                                        key={r}
                                        onPress={() => setRole(r)}
                                        style={{
                                            flex: 1,
                                            paddingVertical: moderateScale(10),
                                            borderRadius: moderateScale(10),
                                            borderWidth: 1,
                                            borderColor: role === r ? palette.teal.main : palette.neutral.border,
                                            backgroundColor: role === r ? palette.teal.surface : palette.neutral.white,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TextComp text={r === 'PATIENT' ? 'Patient' : 'Doctor'} />
                                    </Pressable>
                                ))}
                            </View>
                        </AuthStaggerItem>
                        <AuthTextInput
                            index={1}
                            label="Full Name"
                            required
                            placeholder="James Anderson"
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value={values.fullName}
                            error={errors.fullName}
                            touched={touched.fullName}
                            autoCapitalize="words"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={2}
                            label="Email"
                            required
                            placeholder="you@email.com"
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
                            index={3}
                            label="Phone"
                            placeholder="+1 555 000 0000"
                            onChangeText={handleChange('phone')}
                            onBlur={handleBlur('phone')}
                            value={values.phone}
                            keyboardType="phone-pad"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={4}
                            label="Password"
                            required
                            placeholder="Password"
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
                            index={5}
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
                        <AuthStaggerItem index={6}>
                            <Pressable
                                onPress={() => setFieldValue('acceptedTerms', !values.acceptedTerms)}
                                style={styles.termsRow}
                                hitSlop={8}
                            >
                                <View style={styles.checkboxOuter}>
                                    {values.acceptedTerms && <View style={styles.checkboxInner} />}
                                </View>
                                <View style={styles.termsTextBlock}>
                                    <Text style={styles.termsText}>
                                        I agree to the Terms of Service and Privacy Policy.
                                    </Text>
                                </View>
                            </Pressable>
                            {errors.acceptedTerms && (touched.acceptedTerms || submitCount > 0) ? (
                                <TextComp text={errors.acceptedTerms} style={styles.termsError} />
                            ) : null}
                        </AuthStaggerItem>
                        <AuthStaggerItem index={7}>
                            <AuthYellowButton
                                title="Create Account"
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

export default Register;
