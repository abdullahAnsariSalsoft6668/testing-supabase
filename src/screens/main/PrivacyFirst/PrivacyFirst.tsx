import React from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { TabBodySheet } from '@/components/grocery';
import {
    HOW_WE_VERIFY_POINTS,
    HowWeVerifyCard,
    PRIVACY_FEATURES,
    PrivacyFeatureCard,
    PrivacyFirstHero,
    PrivacyPromiseCard,
} from '@/components/privacyFirst';
import WrapperContainer from '@/components/WrapperContainer';
import { privacyFirstStyles } from '@/styles/privacyFirstStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';

const PrivacyFirst: React.FC = () => (
    <WrapperContainer
        style={tabScreenStyles.screen}
        edges={[]}
        innerBackgroundColor={theme.colors.background.primary}
    >
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
        <ScrollView
            style={[tabScreenStyles.scrollView, privacyFirstStyles.scrollView]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tabScreenStyles.scrollContent}
        >
            <PrivacyFirstHero />

            <TabBodySheet style={privacyFirstStyles.bodySheet}>
                {PRIVACY_FEATURES.map(feature => (
                    <PrivacyFeatureCard key={feature.id} feature={feature} />
                ))}

                <HowWeVerifyCard points={HOW_WE_VERIFY_POINTS} />
                <PrivacyPromiseCard />
            </TabBodySheet>
        </ScrollView>
    </WrapperContainer>
);

export default PrivacyFirst;
