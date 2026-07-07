import React from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DrawerScreenBackButton from '@/components/drawer/DrawerScreenBackButton';
import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    HOW_MULTI_STORE_WORKS,
    HowMultiStoreWorks,
    MoreStoresCard,
    PARTNER_STORES,
    PartnerStoreCard,
    StoreStatsRow,
} from '@/components/stores';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import { supportedStoresStyles } from '@/styles/supportedStoresStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';

const SupportedStores: React.FC = () => (
    <WrapperContainer
        style={tabScreenStyles.screen}
        edges={[]}
        innerBackgroundColor={theme.colors.background.secondary}
    >
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
        <ScrollView
            style={[tabScreenStyles.scrollView, supportedStoresStyles.scrollView]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tabScreenStyles.scrollContent}
        >
            <TabScreenHeader
                title="Supported Stores"
                subtitle="One app. Multiple stores."
                leadingAction={<DrawerScreenBackButton />}
            />

            <StoreStatsRow />

            <TabBodySheet style={supportedStoresStyles.bodySheet}>
                <TextComp text="🤖 All Partner Stores" style={supportedStoresStyles.sectionTitle} />
                <TextComp
                    text="Deals are updated in real-time across all stores"
                    style={supportedStoresStyles.sectionSubtitle}
                />

                {PARTNER_STORES.map(store => (
                    <PartnerStoreCard key={store.id} store={store} />
                ))}

                <MoreStoresCard />
                <HowMultiStoreWorks steps={HOW_MULTI_STORE_WORKS} />
            </TabBodySheet>
        </ScrollView>
    </WrapperContainer>
);

export default SupportedStores;
