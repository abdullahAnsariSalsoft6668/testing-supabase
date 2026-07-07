import React, { useCallback, useMemo } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    BarcodeCard,
    BarcodeTimerCard,
    generateBarcodeCode,
    getBarcodeProduct,
    PrivacyNotice,
} from '@/components/savingBarcode';
import WrapperContainer from '@/components/WrapperContainer';
import AuthYellowButton from '@/screens/auth/shared/AuthYellowButton';
import routes from '@/constants/routes';
import { savingBarcodeStyles } from '@/styles/savingBarcodeStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import type { MainStackParamList } from '@/navigation/types';

type SavingBarcodeRoute = RouteProp<MainStackParamList, 'SavingBarcode'>;
type SavingBarcodeNavigation = NativeStackNavigationProp<
    MainStackParamList,
    typeof routes.main.savingBarcode
>;

const SavingBarcode: React.FC = () => {
    const navigation = useNavigation<SavingBarcodeNavigation>();
    const route = useRoute<SavingBarcodeRoute>();
    const insets = useSafeAreaInsets();

    const product = useMemo(
        () => getBarcodeProduct(route.params?.dealId ?? ''),
        [route.params?.dealId],
    );
    const barcodeCode = useMemo(
        () => generateBarcodeCode(route.params?.dealId ?? '1'),
        [route.params?.dealId],
    );

    const handleMarkUsed = useCallback(() => {
        navigation.replace(routes.main.savingBarcodeRedeemed, {
            dealId: route.params?.dealId ?? product.id,
        });
    }, [navigation, product.id, route.params?.dealId]);

    return (
        <WrapperContainer
            style={tabScreenStyles.screen}
            edges={[]}
            innerBackgroundColor={theme.colors.background.secondary}
        >
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
            <ScrollView
                style={[tabScreenStyles.scrollView, savingBarcodeStyles.scrollView]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    tabScreenStyles.scrollContent,
                    { paddingBottom: moderateScale(170) + insets.bottom },
                ]}
            >
                <TabScreenHeader
                    title="Saving Barcode"
                    subtitle="Show to cashier during checkout!"
                />

                <TabBodySheet style={savingBarcodeStyles.bodySheet}>
                    <BarcodeCard product={product} barcodeCode={barcodeCode} />
                    <BarcodeTimerCard />
                </TabBodySheet>
            </ScrollView>

            <View
                style={[
                    styles.footer,
                    savingBarcodeStyles.footer,
                    { paddingBottom: Math.max(insets.bottom, spaces.small) },
                ]}
            >
                <AuthYellowButton
                    title="Mark as Used at Checkout"
                    onPress={handleMarkUsed}
                />
                <View style={styles.privacyWrap}>
                    <PrivacyNotice />
                </View>
            </View>
        </WrapperContainer>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: theme.colors.background.secondary,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border.default,
    },
    privacyWrap: {
        marginTop: spaces.medium,
    },
});

export default SavingBarcode;
