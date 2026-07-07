import React from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';

import { TabBodySheet, TabScreenHeader } from '@/components/grocery';
import {
    INSIGHTS_GROWTH,
    INSIGHTS_GOAL,
    INSIGHTS_PROGRESS,
    INSIGHT_STATS,
    INSIGHTS_TOTAL_SAVED,
    INSIGHTS_WEEK_SAVED,
    InsightsStatsGrid,
    InsightsSummaryCard,
    MonthlySavingsChart,
    SAVINGS_MILESTONES,
    SavingsMilestonesCard,
    WeeklySavingsChart,
} from '@/components/insights';
import WrapperContainer from '@/components/WrapperContainer';
import { insightsStyles } from '@/styles/insightsStyles';
import { tabScreenStyles } from '@/styles/tabScreenStyles';
import { theme } from '@/styles/theme';
import { moderateScale } from '@/styles/scaling';

const ChartIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path d="M4 19V5" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M4 19H20" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
        <Path
            d="M8 15L12 9L16 12L20 6"
            stroke="#FFFFFF"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const Insights: React.FC = () => (
    <WrapperContainer style={tabScreenStyles.screen} edges={[]} innerBackgroundColor={theme.colors.background.secondary}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.header} />
        <ScrollView
            style={[tabScreenStyles.scrollView, insightsStyles.scrollView]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tabScreenStyles.scrollContent}
        >
            <TabScreenHeader
                title="Savings Insights"
                subtitle="Your 6-month savings overview"
                rightAction={<ChartIcon />}
            />

            <TabBodySheet style={insightsStyles.bodySheet}>
                <InsightsSummaryCard total={INSIGHTS_TOTAL_SAVED} growth={INSIGHTS_GROWTH} />
                <InsightsStatsGrid stats={INSIGHT_STATS} />
                <MonthlySavingsChart />
                <WeeklySavingsChart savedLabel={INSIGHTS_WEEK_SAVED} />
                <SavingsMilestonesCard
                    milestones={SAVINGS_MILESTONES}
                    progress={INSIGHTS_PROGRESS}
                    goalLabel={INSIGHTS_GOAL}
                />
            </TabBodySheet>
        </ScrollView>
    </WrapperContainer>
);

export default Insights;
