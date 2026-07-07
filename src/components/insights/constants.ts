import type { InsightStatItem, SavingsMilestone } from '@/components/grocery/types';

export const INSIGHTS_TOTAL_SAVED = '$110.80';
export const INSIGHTS_GROWTH = '↑ +18% vs last 6 months';
export const INSIGHTS_WEEK_SAVED = '$24.30 Saved';
export const INSIGHTS_PROGRESS = 72;
export const INSIGHTS_GOAL = 'Save $200 Total';

export const INSIGHT_STATS: InsightStatItem[] = [
    { id: '1', icon: 'dollarHand', value: '$144.80', label: 'Total Saving (6 Mo)' },
    { id: '2', icon: 'timeCheck', value: '4.7 Hrs', label: 'Time Saved' },
    { id: '3', icon: 'calendarClock', value: '$24.40', label: 'This Month' },
    { id: '4', icon: 'cartYello', value: '$5.36', label: 'Avg Per Trip' },
];

export const MONTHLY_SAVINGS = [
    { label: 'Jan', value: 16 },
    { label: 'Feb', value: 22 },
    { label: 'Mar', value: 18 },
    { label: 'Apr', value: 28 },
    { label: 'May', value: 24 },
    { label: 'Jun', value: 32 },
] as const;

export const WEEKLY_SAVINGS = [
    { id: 'sun', label: 'S', value: 2.1 },
    { id: 'mon', label: 'M', value: 3.4 },
    { id: 'tue', label: 'T', value: 2.8 },
    { id: 'wed', label: 'W', value: 4.2 },
    { id: 'thu', label: 'T', value: 3.9 },
    { id: 'fri', label: 'F', value: 4.8 },
] as const;

export const SAVINGS_MILESTONES: SavingsMilestone[] = [
    {
        id: '1',
        title: 'First $10 Saved',
        date: 'Achieved Jan 5, 2026',
        amount: '-$1.00',
        amountColor: '#22C55E',
        iconBg: '#DCFCE7',
    },
    {
        id: '2',
        title: 'Saved $25',
        date: 'Reached Feb 18, 2026',
        amount: '-$0.50',
        amountColor: '#2563EB',
        iconBg: '#DBEAFE',
    },
    {
        id: '3',
        title: 'Saved $50 Total',
        date: 'Achieved Mar 12, 2026',
        amount: '-$0.26',
        amountColor: '#CA8A04',
        iconBg: '#FEF9C3',
    },
];
