import ButtonComp from '@/components/ButtonComp';
import ExtraWorkFormField from '@/components/extraWorkSubmit/ExtraWorkFormField';
import { SUBMIT_GRADIENT } from '@/components/extraWorkSubmit/constants';
import { MOCK_PROFILE } from '@/components/profile/constants';
import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import { localImages } from '@/assets/images';
import type { AuthUser } from '@/models/auth.types';
import { RootState } from '@/redux/store';
import { moderateScale } from '@/styles/scaling';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import EditProfileScreenHeader from './EditProfileScreenHeader';
import styles, { EDIT_PROFILE_BG } from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const PROFILE_GRADIENT_GLOW = '#003380';
const PROFILE_GRADIENT_MID = '#002366';

function readUserField(user: AuthUser, ...keys: string[]): string {
    for (const key of keys) {
        const value = user[key];
        if (value != null && value !== '') {
            return String(value).trim();
        }
    }

    return '';
}

const EditProfile: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.userData);

    const profileFromRedux = useMemo(
        () => ({
            fullName: readUserField(userData, 'fullName', 'name') || MOCK_PROFILE.fullName,
            email: readUserField(userData, 'email') || MOCK_PROFILE.email,
            phone:
                readUserField(userData, 'phone', 'phoneNumber', 'mobile') || MOCK_PROFILE.phone,
        }),
        [userData],
    );

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFullName(profileFromRedux.fullName);
        setEmail(profileFromRedux.email);
        setPhone(profileFromRedux.phone);
    }, [profileFromRedux.email, profileFromRedux.fullName, profileFromRedux.phone]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise<void>(resolve => {
                setTimeout(resolve, 800);
            });
            Alert.alert('Profile Updated', 'Your profile changes have been saved.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={EDIT_PROFILE_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={EDIT_PROFILE_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <LinearGradient
                    colors={['#00050a', EDIT_PROFILE_BG, '#00081a']}
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

                    <EditProfileScreenHeader avatarSource={localImages.user} />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <TextComp text="Account Details" style={styles.sectionTitle} />

                    <View style={styles.formSection}>
                        <ExtraWorkFormField
                            index={0}
                            label="Full Name"
                            leftIcon={
                                <MyIcons
                                    name="userIcon"
                                    size={moderateScale(20)}
                                    fill="#001533"
                                />
                            }
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder={MOCK_PROFILE.fullName}
                        />
                        <ExtraWorkFormField
                            index={1}
                            label="Email Address"
                            leftIcon={<MyIcons name="messageBlue" size={moderateScale(20)} />}
                            value={email}
                            onChangeText={setEmail}
                            placeholder={MOCK_PROFILE.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <ExtraWorkFormField
                            index={2}
                            label="Phone Number"
                            leftIcon={<MyIcons name="callBlue" size={moderateScale(20)} />}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder={MOCK_PROFILE.phone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <ButtonComp
                        title="Save Changes"
                        onPress={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                        style={styles.updateButton}
                        textStyle={styles.updateButtonText}
                        gradientColors={SUBMIT_GRADIENT}
                    />
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default EditProfile;
