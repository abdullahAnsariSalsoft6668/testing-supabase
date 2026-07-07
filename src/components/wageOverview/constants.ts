import type { CurrentPeriodData, EarningsStat, PaymentHistoryItem } from './types';

export const WAGE_BG = '#001533';
export const WAGE_GRADIENT_GLOW = '#003380';
export const WAGE_GRADIENT_MID = '#002366';
export const PERIOD_CARD_GRADIENT = ['#002366', '#001533'] as const;

export const ENTRANCE_BASE = 50;
export const ENTRANCE_STEP = 36;

export const MOCK_CURRENT_PERIOD: CurrentPeriodData = {
    status: 'pending',
    dateRange: '4/21/2026 - 4/27/2026',
    totalEarnings: '$2850.00',
    baseEarnings: '$2400.00',
    extraEarnings: '$450.00',
};

export const MOCK_EARNINGS_STATS: EarningsStat[] = [
    {
        id: 'routes',
        label: 'Assigned Routes',
        value: '6',
        subValue: '$2400.00',
        type: 'routes',
    },
    {
        id: 'extra',
        label: 'Extra Work',
        value: '2',
        subValue: '$450.00',
        type: 'extra',
    },
    {
        id: 'hours',
        label: 'Total Hours',
        value: '52',
        type: 'hours',
    },
    {
        id: 'hourly',
        label: 'Avg. Hourly',
        value: '$54.8',
        type: 'hourly',
    },
];

export const MOCK_PAYMENT_HISTORY: PaymentHistoryItem[] = [
    {
        id: 'pay-1',
        periodLabel: 'Apr 14 - Apr 20, 2026',
        paidOn: 'Apr 21, 2026',
        amount: '$2650.00',
        status: 'paid',
    },
    {
        id: 'pay-2',
        periodLabel: 'Apr 7 - Apr 13, 2026',
        paidOn: 'Apr 14, 2026',
        amount: '$2580.00',
        status: 'paid',
    },
    {
        id: 'pay-3',
        periodLabel: 'Mar 31 - Apr 6, 2026',
        paidOn: 'Apr 7, 2026',
        amount: '$2720.00',
        status: 'paid',
    },
];
