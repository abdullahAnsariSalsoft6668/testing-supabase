import React, { useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
    CashbackStatusCards,
    CashbackTransactionList,
    CASHBACK_INFO_MESSAGE,
    CASHBACK_STATUS_CARDS,
    CASHBACK_TRANSACTIONS,
    HOW_CASHBACK_WORKS,
    HowCashbackWorks,
    LifetimeCashbackCard,
    LIFETIME_CASHBACK,
} from '@/components/cashback';
import { InfoBanner, TabBodySheet, TabScreenHeader } from '@/components/grocery';
import WrapperContainer from '@/components/WrapperContainer';
import type { CashbackStatus } from '@/components/grocery/types';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';

const Cashback: React.FC = () => {
    const [activeStatus, setActiveStatus] = useState<CashbackStatus>('pending');

    const filteredTransactions = useMemo(
        () => CASHBACK_TRANSACTIONS.filter(item => item.status === activeStatus),
        [activeStatus],
    );

    const transactions =
        filteredTransactions.length > 0 ? filteredTransactions : CASHBACK_TRANSACTIONS;

    return (
        <WrapperContainer style={tabScreenStyles.screen} edges={[]} innerBackgroundColor={theme.colors.background.primary}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
            <ScrollView
                style={tabScreenStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tabScreenStyles.scrollContent}
            >
                <TabScreenHeader title="Cashback Center" subtitle="Settled within 1–2 days" />

                <TabBodySheet>
                    <LifetimeCashbackCard amount={LIFETIME_CASHBACK} />
                    <CashbackStatusCards
                        cards={CASHBACK_STATUS_CARDS}
                        activeId={activeStatus}
                        onSelect={setActiveStatus}
                    />
                    <InfoBanner message={CASHBACK_INFO_MESSAGE} />
                    <CashbackTransactionList items={transactions} />
                    <HowCashbackWorks steps={HOW_CASHBACK_WORKS} />
                </TabBodySheet>
            </ScrollView>
        </WrapperContainer>
    );
};

export default Cashback;
