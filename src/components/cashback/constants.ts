import type { CashbackStatus, CashbackTransaction } from '@/components/grocery/types';
import { STORES } from '@/components/deals/constants';

export type CashbackStatusSummary = {
    id: CashbackStatus;
    amount: string;
    label: string;
    itemCount: string;
};

export const LIFETIME_CASHBACK = '$45.90';

export const CASHBACK_STATUS_CARDS: CashbackStatusSummary[] = [
    { id: 'pending', amount: '$1.60', label: 'Pending', itemCount: '3 Items' },
    { id: 'processing', amount: '$1.70', label: 'Processing', itemCount: '4 Items' },
    { id: 'settled', amount: '$2.50', label: 'Settled', itemCount: '5 Items' },
];

export const CASHBACK_TRANSACTIONS: CashbackTransaction[] = [
    {
        id: '1',
        title: 'Organic Honeycrisp Apples',
        store: STORES.wholeFoods,
        date: 'Jun 2, 2026',
        amount: '+$0.50',
        status: 'pending',
    },
    {
        id: '2',
        title: 'Chobani Greek Yogurt',
        store: STORES.safeway,
        date: 'Jun 1, 2026',
        amount: '+$0.45',
        status: 'pending',
    },
    {
        id: '3',
        title: 'Honey Nut Cheerios',
        store: STORES.kroger,
        date: 'May 30, 2026',
        amount: '+$0.65',
        status: 'pending',
    },
];

export const HOW_CASHBACK_WORKS = [
    'Redeem your barcode at checkout',
    'We verify the purchase automatically',
    'Cashback lands in your account within 1–2 days',
] as const;

export const CASHBACK_INFO_MESSAGE = 'Cashback is verified after purchase confirmation.';
