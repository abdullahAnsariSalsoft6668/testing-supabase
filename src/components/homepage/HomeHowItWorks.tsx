import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TextComp from '@/components/TextComp';
import { HOME_STEPS } from '@/components/homepage/constants';
import routes from '@/constants/routes';
import { navigateMainStack } from '@/navigation/navigateMainStack';
import { homeStyles } from '@/styles/homeStyles';

const SHOWCASE_DEAL_ID = '1';

const HomeHowItWorks = () => {
    const navigation = useNavigation();

    const openShowcaseDeal = useCallback(() => {
        navigateMainStack(navigation, routes.main.productDetails, { dealId: SHOWCASE_DEAL_ID });
    }, [navigation]);

    return (
        <View style={homeStyles.stepList}>
            <TextComp text="How It Works" style={homeStyles.sectionTitle} />
            {HOME_STEPS.map((item, index) => (
                <View key={item.id} style={homeStyles.stepRow}>
                    <View style={homeStyles.stepRail}>
                        <View style={homeStyles.stepDot}>
                            <TextComp text={String(item.step)} style={homeStyles.stepDotText} />
                        </View>
                        {index < HOME_STEPS.length - 1 ? <View style={homeStyles.stepLine} /> : null}
                    </View>

                    {item.id === '3' ? (
                        <Pressable
                            onPress={openShowcaseDeal}
                            style={({ pressed }) => [
                                homeStyles.stepCard,
                                pressed && { opacity: 0.85 },
                            ]}
                            accessibilityRole="button"
                        >
                            <TextComp text={item.title} style={homeStyles.stepTitle} />
                            <TextComp text={item.description} style={homeStyles.stepDescription} />
                        </Pressable>
                    ) : (
                        <View style={homeStyles.stepCard}>
                            <TextComp text={item.title} style={homeStyles.stepTitle} />
                            <TextComp text={item.description} style={homeStyles.stepDescription} />
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default HomeHowItWorks;
