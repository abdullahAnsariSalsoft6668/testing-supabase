import React, { useCallback } from 'react';
import { Alert, Share, StatusBar, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    MENU_ACTIONS,
    MENU_FEATURES,
    MenuActionCard,
    MenuFeatureRow,
} from '@/components/menu';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';

const MenuTab: React.FC = () => {
    const navigation = useNavigation<BottomTabNavigationProp<Record<string, object | undefined>>>();

    const handleFeaturePress = useCallback(
        (route?: (typeof MENU_FEATURES)[number]['route']) => {
            switch (route) {
                case 'insights':
                    navigation.navigate(routes.tab.insights);
                    break;
                case 'helpHowItWorks':
                    navigation.getParent()?.navigate(routes.main.helpHowItWorks as never);
                    break;
                case 'privacyFirst':
                    navigation.getParent()?.navigate(routes.main.privacyFirst as never);
                    break;
                case 'supportedStores':
                    navigation.getParent()?.navigate(routes.main.supportedStores as never);
                    break;
                default:
                    break;
            }
        },
        [navigation],
    );

    const handleShare = useCallback(async () => {
        try {
            await Share.share({
                message: 'Save more on every grocery trip with Ultimate Grocery!',
            });
        } catch {
            // User dismissed share sheet
        }
    }, []);

    const handleRate = useCallback(() => {
        Alert.alert('Rate Us', 'Thanks for using Ultimate Grocery!');
    }, []);

    return (
        <WrapperContainer style={tabScreenStyles.screen} edges={[]} innerBackgroundColor={theme.colors.background.primary}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
            <ScrollView
                style={tabScreenStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tabScreenStyles.scrollContent}
            >
                <TabScreenHeader title="More Features" subtitle="Explore all features" />

                <TabBodySheet>
                    <View style={styles.list}>
                        {MENU_FEATURES.map((item, index) => (
                            <MenuFeatureRow
                                key={item.id}
                                icon={item.icon}
                                title={item.title}
                                subtitle={item.subtitle}
                                onPress={() => handleFeaturePress(item.route)}
                                showDivider={index < MENU_FEATURES.length - 1}
                            />
                        ))}
                    </View>

                    <View style={styles.actionsRow}>
                        <MenuActionCard
                            label={MENU_ACTIONS[0].label}
                            icon={MENU_ACTIONS[0].icon}
                            onPress={handleShare}
                        />
                        <MenuActionCard
                            label={MENU_ACTIONS[1].label}
                            icon={MENU_ACTIONS[1].icon}
                            onPress={handleRate}
                        />
                    </View>
                </TabBodySheet>
            </ScrollView>
        </WrapperContainer>
    );
};

const styles = StyleSheet.create({
    list: {
        marginBottom: spaces.large,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: moderateScale(12),
    },
});

export default MenuTab;
