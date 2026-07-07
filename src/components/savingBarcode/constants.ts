import type { ProductDetail } from '@/components/grocery/types';
import { getDefaultProductDetail, getProductDetail } from '@/components/productDetails/constants';

export type BarcodeSavingsBadge = {
    id: string;
    label: string;
    amount: string;
    bg: string;
    color: string;
};

export const PRIVACY_NOTICE =
    'Single-use barcode. Your privacy is protected. No personal data is stored or shared.';

export const BARCODE_TIMER_SECONDS = 14 * 60 + 45;

export const generateBarcodeCode = (dealId: string) => {
    if (dealId === '1') {
        return 'GRSC-7842-4519-0023';
    }
    const padded = dealId.padStart(4, '0');
    return `GRSC-7842-${padded}-0023`;
};

const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
    store: { bg: '#DCFCE7', color: '#16A34A', label: 'Store' },
    coupon: { bg: '#DBEAFE', color: '#2563EB', label: 'Coupon' },
    promo: { bg: '#FEF3C7', color: '#EA580C', label: 'Promo' },
};

export const getBarcodeProduct = (dealId: string): ProductDetail => {
    return getProductDetail(dealId) ?? getDefaultProductDetail();
};

export const getBarcodeSavingsBadges = (product: ProductDetail): BarcodeSavingsBadge[] => {
    const ids = ['store', 'coupon', 'promo'] as const;

    return ids
        .map(id => {
            const line = product.savingsBreakdown.find(item => item.id === id);
            if (!line || line.amount === '$0.00') return null;
            const style = BADGE_STYLES[id];
            return {
                id,
                label: style.label,
                amount: line.amount,
                bg: style.bg,
                color: style.color,
            };
        })
        .filter((item): item is BarcodeSavingsBadge => item !== null);
};
