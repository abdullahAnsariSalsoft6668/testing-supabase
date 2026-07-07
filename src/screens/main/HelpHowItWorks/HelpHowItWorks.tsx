import React, { useCallback } from 'react';
import { Alert, Linking, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DrawerScreenBackButton from '@/components/drawer/DrawerScreenBackButton';
import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    HELP_FAQ_SECTIONS,
    HelpContactFooter,
    HelpFaqSectionCard,
    QuickStartCard,
} from '@/components/helpHowItWorks';
import WrapperContainer from '@/components/WrapperContainer';
import { helpHowItWorksStyles } from '@/styles/helpHowItWorksStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';

const SUPPORT_EMAIL = 'support@ultimategrocery.com';

const HelpHowItWorks: React.FC = () => {
    const handleContactPress = useCallback(() => {
        Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Ultimate%20Grocery%20Support`).catch(() => {
            Alert.alert('Contact Support', `Email us at ${SUPPORT_EMAIL}`);
        });
    }, []);

    return (
        <WrapperContainer
            style={tabScreenStyles.screen}
            edges={[]}
            innerBackgroundColor={theme.colors.background.primary}
        >
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
            <ScrollView
                style={[tabScreenStyles.scrollView, helpHowItWorksStyles.scrollView]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tabScreenStyles.scrollContent}
            >
                <TabScreenHeader
                    title="Help & How It Works"
                    subtitle="Everything you need to start saving"
                    leadingAction={<DrawerScreenBackButton />}
                />

                <TabBodySheet>
                    <QuickStartCard />

                    {HELP_FAQ_SECTIONS.map(section => (
                        <HelpFaqSectionCard key={section.id} section={section} />
                    ))}

                    <HelpContactFooter onContactPress={handleContactPress} />
                </TabBodySheet>
            </ScrollView>
        </WrapperContainer>
    );
};

export default HelpHowItWorks;
