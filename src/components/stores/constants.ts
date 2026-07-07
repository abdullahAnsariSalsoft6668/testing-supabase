export type StoreBadgeType = 'topPartner' | 'mostDeals' | 'bestValue';

export type PartnerStore = {
    id: string;
    name: string;
    dealsCount: number;
    categories: string;
    badge?: StoreBadgeType;
    imageBg: string;
    emoji: string;
};

export const STORE_STATS = [
    { id: 'stores', value: '28+', label: 'Stores' },
    { id: 'deals', value: '2,850', label: 'Total Deals' },
    { id: 'avg', value: '$23.40', label: 'Avg Savings' },
] as const;

export const PARTNER_STORES: PartnerStore[] = [
    {
        id: 'trader-joes',
        name: "Trader Joe's",
        dealsCount: 148,
        categories: 'Organic · Fresh · Premium',
        badge: 'topPartner',
        imageBg: '#FFE8E8',
        emoji: '🏪',
    },
    {
        id: 'walmart',
        name: 'Walmart Grocery',
        dealsCount: 312,
        categories: 'Everyday · Bulk · Value',
        badge: 'mostDeals',
        imageBg: '#E8F4FF',
        emoji: '🛒',
    },
    {
        id: 'target',
        name: 'Target Grocery',
        dealsCount: 186,
        categories: 'Household · Snacks · Pantry',
        badge: 'bestValue',
        imageBg: '#FFE4EC',
        emoji: '🎯',
    },
    {
        id: 'aldi',
        name: 'Aldi',
        dealsCount: 124,
        categories: 'Budget · Fresh · Private Label',
        imageBg: '#E8F8EF',
        emoji: '🥬',
    },
    {
        id: 'whole-foods',
        name: 'Whole Foods',
        dealsCount: 167,
        categories: 'Organic · Premium · Local',
        imageBg: '#E8F5E9',
        emoji: '🌿',
    },
    {
        id: 'kroger',
        name: 'Kroger',
        dealsCount: 203,
        categories: 'Fresh · Bakery · Deli',
        imageBg: '#FFF3E0',
        emoji: '🍞',
    },
];

export const HOW_MULTI_STORE_WORKS = [
    'We scan deals from all 28+ partner stores daily',
    'Our algorithm finds the best price for every item',
    'You get one barcode that works at the chosen store',
    'Cashback is processed automatically after redemption',
] as const;

export const STORE_BADGE_LABELS: Record<StoreBadgeType, string> = {
    topPartner: 'Top Partner',
    mostDeals: 'Most Deals',
    bestValue: 'Best Value',
};
