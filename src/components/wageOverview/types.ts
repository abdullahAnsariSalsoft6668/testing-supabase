export type EarningsStatType = 'routes' | 'extra' | 'hours' | 'hourly';

export type EarningsStat = {
    id: string;
    label: string;
    value: string;
    subValue?: string;
    type: EarningsStatType;
};

export type PaymentHistoryItem = {
    id: string;
    periodLabel: string;
    paidOn: string;
    amount: string;
    status: 'paid';
};

export type CurrentPeriodData = {
    status: 'pending' | 'paid';
    dateRange: string;
    totalEarnings: string;
    baseEarnings: string;
    extraEarnings: string;
};
