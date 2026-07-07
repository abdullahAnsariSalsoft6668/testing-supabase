import { ImageSourcePropType } from 'react-native';

/** API order status values (`GET mobile/orders`). */
export const ORDER_STATUSES = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: string): value is OrderStatus {
    return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function normalizeOrderStatus(value: unknown): OrderStatus {
    const s = String(value ?? '')
        .trim()
        .toLowerCase();
    return isOrderStatus(s) ? s : 'pending';
}

/** Title-case label for chips and badges (e.g. `in-process` → `In-process`). */
export function formatOrderStatusLabel(status: OrderStatus): string {
    return status
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-');
}

export interface OrderItem {
    id: string;
    /** API product id for this line (navigation, reviews). */
    productId: string;
    image: ImageSourcePropType;
    category: string;
    name: string;
    /** Unit price (formatted). */
    price: string;
    /** Line total — qty × unit, or API `lineTotal` / `subtotal` (formatted). */
    lineTotal: string;
    qty: number;
    /** Same as parent order line — API uses order-level status; shown per line for UI. */
    status: OrderStatus;
}

export interface Order {
    id: string;
    /** Display id for header (e.g. shortened from `_id`). */
    orderId: string;
    placedOn: string;
    items: OrderItem[];
    total: string;
    status: OrderStatus;
    shippingAddress?: string;
}
