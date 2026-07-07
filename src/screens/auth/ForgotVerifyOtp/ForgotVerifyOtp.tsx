// import { useVerifyCodeMutation, useVerifyEmailMutation } from '@/api/resetPassApiSlice';
import AuthPromptRow from '@/components/AuthPromptRow';
import TextComp from '@/components/TextComp';
import routes from '@/constants/routes';
import type { AuthStackParamList } from '@/navigation/types';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import * as Yup from 'yup';

import AuthScreenLayout from '../shared/AuthScreenLayout';
import AuthStaggerItem from '../shared/AuthStaggerItem';
import AuthYellowButton from '../shared/AuthYellowButton';
import authStyles from '../shared/authStyles';
import styles from '../Forgot/styles';

const OTP_LENGTH = 4;

const validationSchema = Yup.object().shape({
    otp: Yup.string()
        .required('OTP is required')
        .length(OTP_LENGTH, `OTP must be exactly ${OTP_LENGTH} digits`),
});

const ForgotVerifyOtp: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const route = useRoute<RouteProp<AuthStackParamList, 'ForgotVerifyOtp'>>();
    const email = String(route.params?.email ?? '').trim();

    const [showResend, setShowResend] = useState(false);
    const isVerifying = false;
    const isResending = false;

    useEffect(() => {
        if (!email) {
            navigation.goBack();
        }
    }, [email, navigation]);

    useEffect(() => {
        const t = setTimeout(() => setShowResend(true), 5000);
        return () => clearTimeout(t);
    }, []);

    const handleResend = useCallback(async () => {
        // Alpha: static resend
    }, []);

    const handleSubmitOtp = useCallback(
        async (values: { otp: string }) => {
            if (!email) {
                return;
            }

            navigation.navigate(routes.auth.forgotResetPassword, {
                email,
                otp: values.otp.trim(),
            });
        },
        [email, navigation],
    );

    return (
        <AuthScreenLayout
            title="Verify OTP"
            subtitle={`Enter the 4-digit code sent to ${email || 'your email'}.`}
            footerStaggerIndex={3}
            footer={
                <AuthPromptRow
                    promptText="Wrong email?"
                    linkText="Go back"
                    onLinkPress={() => navigation.goBack()}
                    lightTheme
                />
            }
        >
            <Formik
                initialValues={{ otp: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitOtp}
            >
                {({
                    handleSubmit,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                }) => (
                    <>
                        <AuthStaggerItem index={0}>
                            <View style={styles.otpWrap}>
                                <OtpInput
                                    numberOfDigits={OTP_LENGTH}
                                    type="numeric"
                                    autoFocus
                                    blurOnFilled
                                    onTextChange={(text) => {
                                        setFieldValue('otp', text, false);
                                        if (text.length === OTP_LENGTH) {
                                            setFieldTouched('otp', true, false);
                                        }
                                    }}
                                    theme={{
                                        containerStyle: styles.otpInputContainer,
                                        pinCodeContainerStyle: {
                                            width: moderateScale(52),
                                            height: moderateScale(52),
                                            borderRadius: moderateScale(14),
                                            borderWidth: 1,
                                            borderColor: palette.neutral.gray100,
                                            backgroundColor: palette.neutral.white,
                                        },
                                        focusedPinCodeContainerStyle: {
                                            borderColor: palette.purple.main,
                                            borderWidth: 1.5,
                                            transform: [{ scale: 1.04 }],
                                        },
                                        pinCodeTextStyle: {
                                            fontSize: moderateScale(20),
                                            color: palette.neutral.text,
                                        },
                                    }}
                                    textInputProps={{
                                        accessibilityLabel: 'One-time password digit',
                                    }}
                                />
                                {errors.otp && touched.otp ? (
                                    <TextComp text={String(errors.otp)} style={styles.otpError} />
                                ) : null}
                            </View>
                        </AuthStaggerItem>

                        {showResend ? (
                            <AuthStaggerItem index={1}>
                                <Pressable
                                    onPress={handleResend}
                                    style={styles.resendPressable}
                                    disabled={isResending}
                                    accessibilityRole="button"
                                    accessibilityLabel="Resend verification code"
                                >
                                    {isResending ? (
                                        <ActivityIndicator color={palette.purple.main} />
                                    ) : (
                                        <TextComp text="Resend code?" style={styles.resendText} />
                                    )}
                                </Pressable>
                            </AuthStaggerItem>
                        ) : null}

                        <AuthStaggerItem index={2}>
                            <AuthYellowButton
                                title="Continue"
                                onPress={() => handleSubmit()}
                                loading={isVerifying}
                                disabled={isVerifying}
                                style={authStyles.actionButton}
                            />
                        </AuthStaggerItem>
                    </>
                )}
            </Formik>
        </AuthScreenLayout>
    );
};

export default ForgotVerifyOtp;
