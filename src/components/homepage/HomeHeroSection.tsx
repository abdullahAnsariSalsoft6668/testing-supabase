import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AuthGridOverlay from '@/screens/auth/shared/AuthGridOverlay';
import AuthHeaderBadge from '@/screens/auth/shared/AuthHeaderBadge';
import AuthYellowButton from '@/screens/auth/shared/AuthYellowButton';
import TextComp from '@/components/TextComp';
import { homeStyles } from '@/styles/homeStyles';
import { moderateScale } from '@/styles/scaling';

type HomeHeroSectionProps = {
    onStartSaving?: () => void;
};

const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({ onStartSaving }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[homeStyles.hero, { paddingTop: insets.top + moderateScale(12) }]}>
            <View style={homeStyles.heroGrid} pointerEvents="none">
                <AuthGridOverlay />
            </View>
            <View style={homeStyles.heroContent}>
                <AuthHeaderBadge text="2,847 Active deals right now" />

                <View style={homeStyles.heroTitleRow}>
                    <Text style={homeStyles.heroTitle}>Save Up To </Text>
                    <View style={homeStyles.heroHighlight}>
                        <Text style={homeStyles.heroHighlightText}>3x More</Text>
                    </View>
                    <Text style={homeStyles.heroTitle}> On Every Grocery Trip</Text>
                </View>

                <TextComp
                    text="No account needed. Find the best discounts across multiple supermarkets and apply them instantly at checkout."
                    style={homeStyles.heroSubtitle}
                />

                <AuthYellowButton
                    title="Start Saving Now"
                    onPress={onStartSaving ?? (() => {})}
                />

                <TextComp
                    text="No account • No password • 100% free"
                    style={homeStyles.heroNote}
                />
            </View>
        </View>
    );
};

export default HomeHeroSection;
