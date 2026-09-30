import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

import AuthPromptRow from '@/components/AuthPromptRow';
import TextComp from '@/components/TextComp';
import { US_CLINIC_TIMEZONES } from '@/constants/timezones';
import routes from '@/constants/routes';
import { AuthStackParamList } from '@/navigation/types';
import { syncAuthFromSupabase } from '@/redux/actions/auth';
import { signUpHospital } from '@/services/authService';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthTextInput from '../shared/AuthTextInput';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';

const validationSchema = Yup.object().shape({
    fullName: Yup.string().trim().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
    hospitalName: Yup.string().trim().required('Required'),
    address: Yup.string(),
});

const HospitalApply = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [isLoading, setIsLoading] = useState(false);
    const [timezone, setTimezone] = useState('America/New_York');

    return (
        <AuthScreenLayout
            title="Hospital apply"
            subtitle="Submit your clinic. CareHub reviews it before you add doctors."
            cardStyle={{ paddingBottom: 24 }}
            footerStaggerIndex={9}
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
                    password: '',
                    hospitalName: '',
                    address: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    setIsLoading(true);
                    try {
                        await signUpHospital({
                            email: values.email.trim(),
                            password: values.password,
                            fullName: values.fullName.trim(),
                            hospitalName: values.hospitalName.trim(),
                            hospitalAddress: values.address.trim() || undefined,
                            hospitalTimezone: timezone,
                        });
                        await syncAuthFromSupabase();
                        Toast.show({
                            type: 'success',
                            text1: 'Application submitted',
                            text2: 'Check your email if you need to verify, then wait for CareHub approval.',
                        });
                    } catch (e: unknown) {
                        Toast.show({
                            type: 'error',
                            text1: 'Application failed',
                            text2: e instanceof Error ? e.message : String(e),
                        });
                    } finally {
                        setIsLoading(false);
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <AuthTextInput
                            index={0}
                            label="Your name"
                            required
                            value={values.fullName}
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            error={errors.fullName}
                            touched={touched.fullName}
                            autoCapitalize="words"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={1}
                            label="Work email"
                            required
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            error={errors.email}
                            touched={touched.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={2}
                            label="Password"
                            required
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={errors.password}
                            touched={touched.password}
                            isPassword
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={3}
                            label="Hospital name"
                            required
                            value={values.hospitalName}
                            onChangeText={handleChange('hospitalName')}
                            onBlur={handleBlur('hospitalName')}
                            error={errors.hospitalName}
                            touched={touched.hospitalName}
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthTextInput
                            index={4}
                            label="Address"
                            value={values.address}
                            onChangeText={handleChange('address')}
                            placeholder="Austin, TX"
                            containerStyle={authStyles.inputContainer}
                            labelStyle={authStyles.inputLabel}
                            inputContainerStyle={authStyles.inputField}
                        />
                        <AuthStaggerItem index={5}>
                            <TextComp text="Timezone" style={{ marginBottom: moderateScale(8), fontWeight: '600' }} />
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {US_CLINIC_TIMEZONES.map((z) => {
                                    const selected = timezone === z.value;
                                    return (
                                        <Pressable
                                            key={z.value}
                                            onPress={() => setTimezone(z.value)}
                                            style={{
                                                borderRadius: 16,
                                                paddingHorizontal: 12,
                                                paddingVertical: 6,
                                                borderWidth: 1,
                                                borderColor: selected
                                                    ? theme.palette.teal.main
                                                    : theme.colors.border.default,
                                                backgroundColor: selected
                                                    ? 'rgba(13,148,136,0.12)'
                                                    : theme.colors.card.background,
                                            }}
                                        >
                                            <TextComp text={z.label} />
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </AuthStaggerItem>
                        <AuthStaggerItem index={6}>
                            <AuthYellowButton
                                title="Submit application"
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

export default HospitalApply;
