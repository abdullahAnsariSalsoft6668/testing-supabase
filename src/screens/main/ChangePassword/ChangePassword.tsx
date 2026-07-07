import ButtonComp from '@/components/ButtonComp';
import ExtraWorkFormField from '@/components/extraWorkSubmit/ExtraWorkFormField';
import { SUBMIT_GRADIENT } from '@/components/extraWorkSubmit/constants';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import {
    PROFILE_GRADIENT_GLOW,
    PROFILE_GRADIENT_MID,
} from '@/components/profile/constants';
import { moderateScale } from '@/styles/scaling';
import React, { useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import ChangePasswordScreenHeader from './ChangePasswordScreenHeader';
import styles, { CHANGE_PASSWORD_BG } from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdatePassword = async () => {
        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert('Missing fields', 'Please fill in all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Password mismatch', 'New password and confirmation do not match.');
            return;
        }

        setIsUpdating(true);
        try {
            await new Promise<void>(resolve => {
                setTimeout(resolve, 800);
            });
            Alert.alert('Password Updated', 'Your password has been changed successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={CHANGE_PASSWORD_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={CHANGE_PASSWORD_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <LinearGradient
                    colors={['#00050a', CHANGE_PASSWORD_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[PROFILE_GRADIENT_GLOW, PROFILE_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />

                    <ChangePasswordScreenHeader />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <TextComp text="Security" style={styles.sectionTitle} />
                    <TextComp
                        text="Update your password to keep your account secure."
                        style={styles.sectionSubtitle}
                    />

                    <View style={styles.formSection}>
                        <ExtraWorkFormField
                            index={0}
                            label="Current Password"
                            leftIcon={
                                <MyIcons
                                    name="userIcon"
                                    size={moderateScale(20)}
                                    fill="#001533"
                                />
                            }
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter current password"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <ExtraWorkFormField
                            index={1}
                            label="New Password"
                            leftIcon={
                                <MyIcons
                                    name="userIcon"
                                    size={moderateScale(20)}
                                    fill="#001533"
                                />
                            }
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                        <ExtraWorkFormField
                            index={2}
                            label="Confirm New Password"
                            leftIcon={
                                <MyIcons
                                    name="userIcon"
                                    size={moderateScale(20)}
                                    fill="#001533"
                                />
                            }
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <ButtonComp
                        title="Update Password"
                        onPress={handleUpdatePassword}
                        loading={isUpdating}
                        disabled={isUpdating}
                        style={styles.updateButton}
                        textStyle={styles.updateButtonText}
                        gradientColors={SUBMIT_GRADIENT}
                    />
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default ChangePassword;
