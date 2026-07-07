import React, { useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import WrapperContainer from '@/components/WrapperContainer';
import {
    HomeFooterCta,
    HomeHeroSection,
    HomeHowItWorks,
    HomeStatsGrid,
    HomeTestimonials,
} from '@/components/homepage';
import routes from '@/constants/routes';
import { theme } from '@/styles/theme';
import { homeStyles } from '@/styles/homeStyles';

const Home: React.FC = () => {
    const navigation = useNavigation<BottomTabNavigationProp<Record<string, object | undefined>>>();

    const handleStartSaving = useCallback(() => {
        navigation.navigate(routes.tab.deals);
    }, [navigation]);

    const handleBrowseDeals = useCallback(() => {
        navigation.navigate(routes.tab.deals);
    }, [navigation]);

    return (
        <WrapperContainer
            style={homeStyles.screen}
            edges={[]}
            innerBackgroundColor={theme.colors.background.primary}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.colors.background.header}
            />
            <ScrollView
                style={homeStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={homeStyles.scrollContent}
            >
                <HomeHeroSection onStartSaving={handleStartSaving} />

                <View style={homeStyles.bodySection}>
                    <HomeStatsGrid />
                    <HomeHowItWorks />
                    <HomeTestimonials />
                    <HomeFooterCta onBrowseDeals={handleBrowseDeals} />
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default Home;
