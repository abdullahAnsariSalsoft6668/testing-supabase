import { localImages } from '@/assets/images';
import {
    SETTINGS_BG,
    SETTINGS_GRADIENT_GLOW,
    SETTINGS_GRADIENT_MID,
    SETTINGS_SECTIONS,
    SettingsHeader,
    SettingsSection,
} from '@/components/settings';
import WrapperContainer from '@/components/WrapperContainer';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const Setting: React.FC = () => {
    const navigation = useNavigation();
    const [toggleValues, setToggleValues] = useState({
        notifications: true,
        darkMode: false,
    });

    const handleToggle = useCallback((id: string, value: boolean) => {
        setToggleValues(current => ({
            ...current,
            [id]: value,
        }));
    }, []);

    const handleNavigate = useCallback(
        (screen?: string) => {
            if (!screen) {
                return;
            }

            navigation.navigate(screen as never);
        },
        [navigation],
    );

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={SETTINGS_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={SETTINGS_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#00050a', SETTINGS_BG, '#00081a']}
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
                    <SettingsHeader avatarSource={localImages.user} />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    {SETTINGS_SECTIONS.map((section, index) => (
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

export default Setting;
