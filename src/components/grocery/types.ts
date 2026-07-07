export type StoreInfo = {
    id: string;
    name: string;
    initials: string;
    color: string;
};

export type DealBadgeType = 'bestDeal' | 'limited' | 'none';

export type SavingsLineItem = {
    id: string;
    label: string;
    amount: string;
    color: string;
    dotColor: string;
};

export type ProductDetail = DealItem & {
    description: string;
    discountPercent: string;
    totalSaved: string;
    savedPercentLabel: string;
    savePercentBadge: string;
    savingsBreakdown: SavingsLineItem[];
    cashbackNote: string;
};

export type DealItem = {
    id: string;
    title: string;
    store: StoreInfo;
    price: string;
    originalPrice: string;
    saveLabel?: string;
    discountLabel?: string;
    badge?: DealBadgeType;
    emoji: string;
    imageBg: string;
};

export type CashbackStatus = 'pending' | 'processing' | 'settled';

export type CashbackTransaction = {
    id: string;
    title: string;
    store: StoreInfo;
    date: string;
    amount: string;
    status: CashbackStatus;
};

import type { IconName } from '@/components/MyIcons';

export type InsightStatItem = {
    id: string;
    icon: IconName;
    value: string;
    label: string;
};

export type SavingsMilestone = {
    id: string;
    title: string;
    date: string;
    amount: string;
    amountColor: string;
    iconBg: string;
};
