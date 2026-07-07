import type { DealItem, ProductDetail, SavingsLineItem } from '@/components/grocery/types';

import {
    FEATURED_DEALS,
    HIGHEST_SAVINGS_DEALS,
    TOP_DISCOUNT_DEALS,
} from '@/components/deals/constants';

const ALL_DEALS: DealItem[] = [
    ...FEATURED_DEALS,
    ...HIGHEST_SAVINGS_DEALS,
    ...TOP_DISCOUNT_DEALS,
];

const DEFAULT_CASHBACK_NOTE =
    'Cashback available on this item. Earn extra cashback, within 1–2 days.';

const DETAIL_OVERRIDES: Record<string, Partial<ProductDetail>> = {
    '1': {
        title: 'Tubby Todd The Regulars Fragrance',
        description:
            'A clean, everyday scent with soft citrus and warm vanilla notes — perfect for daily use on sensitive skin.',
        store: { id: 'wf', name: 'Whole Foods', initials: 'WF', color: '#2563EB' },
        emoji: '🧴',
        imageBg: '#FFE8B3',
        price: '$4.99',
        originalPrice: '$6.49',
        badge: 'bestDeal',
        discountPercent: '-38% OFF',
        totalSaved: '$2.50',
        savedPercentLabel: '20% of original price',
        savePercentBadge: 'Save 38% Off',
        savingsBreakdown: [
            {
                id: 'original',
                label: 'Original Price',
                amount: '$6.49',
                color: '#1A1A1A',
                dotColor: '#1A1A1A',
            },
            {
                id: 'store',
                label: 'Store Discount',
                amount: '-$1.00',
                color: '#16A34A',
                dotColor: '#16A34A',
            },
            {
                id: 'coupon',
                label: 'Manufacturer Coupon',
                amount: '-$1.00',
                color: '#2563EB',
                dotColor: '#2563EB',
            },
            {
                id: 'promo',
                label: 'Special Promotions',
                amount: '-$0.50',
                color: '#EA580C',
                dotColor: '#EA580C',
            },
        ],
    },
};

const parsePrice = (value: string) => Number(value.replace(/[^0-9.]/g, ''));

const formatMoney = (value: number) => `$${value.toFixed(2)}`;

const buildDefaultBreakdown = (deal: DealItem): SavingsLineItem[] => {
    const original = parsePrice(deal.originalPrice);
    const finalPrice = parsePrice(deal.price);
    const saved = Math.max(original - finalPrice, 0);
    const storeDiscount = saved * 0.5;
    const couponDiscount = saved - storeDiscount;

    return [
        {
            id: 'original',
            label: 'Original Price',
            amount: deal.originalPrice,
            color: '#1A1A1A',
            dotColor: '#1A1A1A',
        },
        {
            id: 'store',
            label: 'Store Discount',
            amount: storeDiscount > 0 ? `-${formatMoney(storeDiscount)}` : '$0.00',
            color: '#16A34A',
            dotColor: '#16A34A',
        },
        {
            id: 'coupon',
            label: 'Manufacturer Coupon',
            amount: couponDiscount > 0 ? `-${formatMoney(couponDiscount)}` : '$0.00',
            color: '#2563EB',
            dotColor: '#2563EB',
        },
    ];
};

const buildProductDetail = (deal: DealItem): ProductDetail => {
    const original = parsePrice(deal.originalPrice);
    const finalPrice = parsePrice(deal.price);
    const saved = Math.max(original - finalPrice, 0);
    const discountPercent = original > 0 ? Math.round((saved / original) * 100) : 0;

    const base: ProductDetail = {
        ...deal,
        description:
            'Stacked store discounts and manufacturer coupons are applied automatically when you redeem this deal at checkout.',
        discountPercent: deal.discountLabel ?? `-${discountPercent}% OFF`,
        totalSaved: formatMoney(saved),
        savedPercentLabel: `${Math.round((saved / original) * 100) || 0}% of original price`,
        savePercentBadge: `Save ${discountPercent}% Off`,
        savingsBreakdown: buildDefaultBreakdown(deal),
        cashbackNote: DEFAULT_CASHBACK_NOTE,
    };

    const override = DETAIL_OVERRIDES[deal.id];
    return override ? { ...base, ...override } : base;
};

export const getProductDetail = (dealId: string): ProductDetail | undefined => {
    const deal = ALL_DEALS.find(item => item.id === dealId);
    if (!deal) return undefined;
    return buildProductDetail(deal);
};

export const getDefaultProductDetail = (): ProductDetail =>
    buildProductDetail(ALL_DEALS[0]);
