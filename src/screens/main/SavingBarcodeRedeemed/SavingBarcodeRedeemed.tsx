import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    BarcodeRedeemedCard,
    getBarcodeProduct,
    PrivacyNotice,
} from '@/components/savingBarcode';
import WrapperContainer from '@/components/WrapperContainer';
import { savingBarcodeStyles } from '@/styles/savingBarcodeStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';
import type { MainStackParamList } from '@/navigation/types';

type SavingBarcodeRedeemedRoute = RouteProp<MainStackParamList, 'SavingBarcodeRedeemed'>;

const SavingBarcodeRedeemed: React.FC = () => {
    const route = useRoute<SavingBarcodeRedeemedRoute>();
    const insets = useSafeAreaInsets();

    const product = useMemo(
        () => getBarcodeProduct(route.params?.dealId ?? ''),
        [route.params?.dealId],
    );

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
                    { paddingBottom: moderateScale(40) + insets.bottom },
                ]}
            >
                <TabScreenHeader
                    title="Saving Barcode"
                    subtitle="Show to cashier during checkout!"
                />

                <TabBodySheet style={savingBarcodeStyles.bodySheet}>
                    <BarcodeRedeemedCard product={product} />
                </TabBodySheet>

                <PrivacyNotice />
            </ScrollView>
        </WrapperContainer>
    );
};

export default SavingBarcodeRedeemed;
