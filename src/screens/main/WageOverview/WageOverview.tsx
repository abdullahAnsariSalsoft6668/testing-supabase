import { localImages } from '@/assets/images';
import {
    CurrentPeriodCard,
    EarningsStatCard,
    MOCK_CURRENT_PERIOD,
    MOCK_EARNINGS_STATS,
    MOCK_PAYMENT_HISTORY,
    PaymentHistoryCard,
    SectionTitle,
    WAGE_BG,
    WAGE_GRADIENT_GLOW,
    WAGE_GRADIENT_MID,
    WageInfoCards,
    WageOverviewHeader,
} from '@/components/wageOverview';
import WrapperContainer from '@/components/WrapperContainer';
import React, { useMemo } from 'react';
import { StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

const WageOverview: React.FC = () => {
    const earningsStats = useMemo(() => MOCK_EARNINGS_STATS, []);
    const paymentHistory = useMemo(() => MOCK_PAYMENT_HISTORY, []);

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={WAGE_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={WAGE_BG} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#00050a', WAGE_BG, '#00081a']}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <LinearGradient
                        colors={[WAGE_GRADIENT_GLOW, WAGE_GRADIENT_MID, 'transparent']}
                        locations={[0, 0.45, 1]}
                        start={{ x: 0.62, y: 0 }}
                        end={{ x: 0.2, y: 0.9 }}
                        style={GRADIENT_OVERLAY}
                        pointerEvents="none"
                    />
                    <WageOverviewHeader avatarSource={localImages.user} />
                    <CurrentPeriodCard period={MOCK_CURRENT_PERIOD} />
                </LinearGradient>

                <View style={styles.contentPanel}>
                    <SectionTitle title="Earnings Breakdown" />
                    <View style={styles.statsGrid}>
                        {earningsStats.map((stat, index) => (
                            <EarningsStatCard key={stat.id} stat={stat} index={index} />
                        ))}
                    </View>

                    <SectionTitle title="Payment History" baseDelay={220} />
                    {paymentHistory.map((item, index) => (
                        <PaymentHistoryCard key={item.id} item={item} index={index} />
                    ))}

                    <WageInfoCards />
                </View>
            </ScrollView>
        </WrapperContainer>
    );
};

export default WageOverview;
