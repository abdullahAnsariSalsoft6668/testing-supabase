import { PRIVACY_SECTIONS } from '@/components/privacy';
import {
    SETTINGS_GRADIENT_GLOW,
    SETTINGS_GRADIENT_MID,
    SettingsSection,
} from '@/components/settings';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import React, { useCallback, useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import PrivacySettingsScreenHeader from './PrivacySettingsScreenHeader';
import styles, { PRIVACY_SETTINGS_BG } from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const PrivacySettings: React.FC = () => {
    const [toggleValues, setToggleValues] = useState({
        locationSharing: true,
        usageAnalytics: false,
        personalizedContent: true,
    });

    const handleToggle = useCallback((id: string, value: boolean) => {
        setToggleValues(current => ({
            ...current,
            [id]: value,
        }));
    }, []);

    const handleNavigate = useCallback((screen?: string) => {
        if (screen === 'downloadData') {
            Alert.alert(
                'Download Requested',
                'We will email you a copy of your data within 48 hours.',
            );
            return;
        }

        if (screen === 'deleteAccount') {
            Alert.alert(
                'Delete Account',
                'Are you sure you want to permanently delete your account? This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => {} },
                ],
            );
        }
    }, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={PRIVACY_SETTINGS_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={PRIVACY_SETTINGS_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#00050a', PRIVACY_SETTINGS_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[SETTINGS_GRADIENT_GLOW, SETTINGS_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <PrivacySettingsScreenHeader />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <TextComp text="Privacy Controls" style={styles.sectionTitle} />
                    <TextComp
                        text="Manage how your data is collected and used."
                        style={styles.sectionSubtitle}
                    />

                    {PRIVACY_SECTIONS.map((section, index) => (
                        <SettingsSection
                            key={section.id}
                            section={section}
                            sectionIndex={index}
                            toggleValues={toggleValues}
                            onToggle={handleToggle}
                            onNavigate={handleNavigate}
                        />
                    ))}
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default PrivacySettings;
