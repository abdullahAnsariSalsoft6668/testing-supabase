import { localImages } from '@/assets/images';
import {
    buildProfileInfoItems,
    MOCK_PROFILE,
    PersonalInformationSection,
    PROFILE_BG,
    PROFILE_GRADIENT_GLOW,
    PROFILE_GRADIENT_MID,
    ProfileHeader,
    ProfileSummaryCard,
    type ProfileData,
} from '@/components/profile';
import WrapperContainer from '@/components/WrapperContainer';
import type { AuthUser } from '@/models/auth.types';
import { RootState } from '@/redux/store';
import React, { useMemo } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

function readUserField(user: AuthUser, ...keys: string[]): string {
    for (const key of keys) {
        const value = user[key];
        if (value != null && value !== '') {
            return String(value).trim();
        }
    }

    return '';
}

function resolveProfile(userData: AuthUser): ProfileData {
    return {
        fullName: readUserField(userData, 'fullName', 'name') || MOCK_PROFILE.fullName,
        driverId:
            readUserField(userData, 'driverId', 'driverID', 'employeeId', 'id') ||
            MOCK_PROFILE.driverId,
        totalRoutes:
            readUserField(userData, 'totalRoutes', 'routesCount') || MOCK_PROFILE.totalRoutes,
        rating: readUserField(userData, 'rating') || MOCK_PROFILE.rating,
        email: readUserField(userData, 'email') || MOCK_PROFILE.email,
        phone:
            readUserField(userData, 'phone', 'phoneNumber', 'mobile') || MOCK_PROFILE.phone,
        license:
            readUserField(userData, 'license', 'driverLicense', 'licenseNumber') ||
            MOCK_PROFILE.license,
        address: readUserField(userData, 'address') || MOCK_PROFILE.address,
        joinDate: readUserField(userData, 'joinDate', 'joinedAt') || MOCK_PROFILE.joinDate,
    };
}

const Profile: React.FC = () => {
    const userData = useSelector((state: RootState) => state.auth.userData);

    const profile = useMemo(() => resolveProfile(userData), [userData]);
    const infoItems = useMemo(() => buildProfileInfoItems(profile), [profile]);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={PROFILE_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={PROFILE_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#00050a', PROFILE_BG, '#00081a']}
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
                    <ProfileHeader avatarSource={localImages.user} />
                    <ProfileSummaryCard profile={profile} avatarSource={localImages.user} />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <PersonalInformationSection items={infoItems} />
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default Profile;
