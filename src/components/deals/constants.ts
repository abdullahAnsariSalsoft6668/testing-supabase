import type { ImageSourcePropType } from 'react-native';

import { localImages } from '@/assets/images';
import type { DealItem } from '@/components/grocery/types';

/** Maps deal ids to bundled product images (product-image-5 is not in assets). */
export const DEAL_IMAGES: Record<string, ImageSourcePropType> = {
    '1': localImages.productImage1,
    '2': localImages.productImage2,
    '3': localImages.productImage3,
    '4': localImages.productImage4,
    '5': localImages.productImage6,
    '6': localImages.productImage7,
    '7': localImages.productImage8,
    '8': localImages.productImage9,
};

export const getDealImage = (dealId: string): ImageSourcePropType =>
    DEAL_IMAGES[dealId] ?? localImages.productImage1;

export const DEAL_CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery'] as const;

export const STORES = {
    wholeFoods: { id: 'wf', name: 'Whole Foods', initials: 'WF', color: '#1B5E3A' },
    safeway: { id: 'sw', name: 'Safeway', initials: 'SW', color: '#C62828' },
    kroger: { id: 'kr', name: 'Kroger', initials: 'KR', color: '#1565C0' },
    target: { id: 'tg', name: 'Target', initials: 'TG', color: '#CC0000' },
} as const;

export const FEATURED_DEALS: DealItem[] = [
    {
        id: '1',
        title: 'Organic Honeycrisp Apples (3 lb)',
        store: STORES.wholeFoods,
        price: '$3.99',
        originalPrice: '$6.49',
        saveLabel: 'Save $2.50',
        badge: 'bestDeal',
        emoji: '🍎',
        imageBg: '#FFE4E4',
    },
    {
        id: '2',
        title: 'Chobani Greek Yogurt (32 oz)',
        store: STORES.safeway,
        price: '$4.49',
        originalPrice: '$6.99',
        saveLabel: 'Save $2.50',
        badge: 'bestDeal',
        emoji: '🥛',
        imageBg: '#E8F4FF',
    },
];

export const HIGHEST_SAVINGS_DEALS: DealItem[] = [
    {
        id: '3',
        title: 'Honey Nut Cheerios (18 oz)',
        store: STORES.kroger,
        price: '$3.29',
        originalPrice: '$5.79',
        saveLabel: 'Save $2.50',
        badge: 'bestDeal',
        emoji: '🥣',
        imageBg: '#FFF3E0',
    },
    {
        id: '4',
        title: 'Wheat Thins (8 oz)',
        store: STORES.target,
        price: '$2.99',
        originalPrice: '$4.49',
        saveLabel: 'Save $1.50',
        badge: 'limited',
        emoji: '🍪',
        imageBg: '#FFF8E1',
    },
    {
        id: '5',
        title: 'Nutella Hazelnut Spread (13 oz)',
        store: STORES.wholeFoods,
        price: '$4.99',
        originalPrice: '$7.49',
        saveLabel: 'Save $2.50',
        badge: 'bestDeal',
        emoji: '🫙',
        imageBg: '#F3E5F5',
    },
];

export const TOP_DISCOUNT_DEALS: DealItem[] = [
    {
        id: '6',
        title: 'Organic Honeycrisp Apples (3 lb)',
        store: STORES.wholeFoods,
        price: '$3.99',
        originalPrice: '$6.99',
        discountLabel: '-43%',
        emoji: '🍎',
        imageBg: '#FFE4E4',
    },
    {
        id: '7',
        title: 'Chobani Greek Yogurt (32 oz)',
        store: STORES.safeway,
        price: '$4.49',
        originalPrice: '$6.99',
        discountLabel: '-36%',
        emoji: '🥛',
        imageBg: '#E8F4FF',
    },
    {
        id: '8',
        title: 'Honey Nut Cheerios (18 oz)',
        store: STORES.kroger,
        price: '$3.29',
        originalPrice: '$5.79',
        discountLabel: '-43%',
        emoji: '🥣',
        imageBg: '#FFF3E0',
    },
];

export const DEALS_COUNT = 8;
