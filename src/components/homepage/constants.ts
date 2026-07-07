import type { IconName } from '@/components/MyIcons';

export type HomeStatItem = {
    id: string;
    icon: IconName;
    value: string;
    label: string;
};

export type HomeStepItem = {
    id: string;
    step: number;
    title: string;
    description: string;
};

export type HomeTestimonialItem = {
    id: string;
    name: string;
    initials: string;
    quote: string;
};

export const HOME_ACTIVE_DEALS_BADGE = '2,847 Active deals right now';

export const HOME_STATS: HomeStatItem[] = [
    { id: '1', icon: 'avgSaving', value: '$23.40', label: 'Avg. Savings / Trip' },
    { id: '2', icon: 'timeSaved', value: '47 Min', label: 'Time Saved' },
    { id: '3', icon: 'activeDiscount', value: '2,847', label: 'Active Discounts' },
    { id: '4', icon: 'supportStore', value: '30+', label: 'Supported Stores' },
];

export const HOME_STEPS: HomeStepItem[] = [
    {
        id: '2',
        step: 2,
        title: 'Discounts Stack Automatically',
        description: 'We combine store, brand & coupon savings',
    },
    {
        id: '3',
        step: 3,
        title: 'Show Barcode At Checkout',
        description: 'Generates your personal savings barcode',
    },
    {
        id: '4',
        step: 4,
        title: 'Save Instantly',
        description: 'Cashback in your account within 1-2 days',
    },
];

export const HOME_TESTIMONIALS: HomeTestimonialItem[] = [
    {
        id: '1',
        name: 'Robert M.',
        initials: 'RM',
        quote: 'Saved $67 on my last big shop. This app is a game changer!',
    },
    {
        id: '2',
        name: 'Sarah K.',
        initials: 'SK',
        quote: 'So easy to use. No sign up, just open & save.',
    },
];
