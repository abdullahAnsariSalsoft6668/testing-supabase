export type PrivacyFeatureItem = {
    id: string;
    title: string;
    description: string;
    emoji: string;
    iconBg: string;
};

export const PRIVACY_FIRST_TITLE = "We Don't Need Your Personal Information";

export const PRIVACY_FIRST_SUBTITLE =
    'Ultimate Grocery is built on a simple principle: You should be able to save money without giving up your privacy.';

export const PRIVACY_FEATURES: PrivacyFeatureItem[] = [
    {
        id: 'noSignup',
        title: 'No Signup Required',
        description: 'Start saving instantly without creating an account or sharing your email.',
        emoji: '🚫',
        iconBg: '#DCFCE7',
    },
    {
        id: 'noPassword',
        title: 'No Password',
        description: 'No credentials to remember, manage, or worry about being compromised.',
        emoji: '🔒',
        iconBg: '#DBEAFE',
    },
    {
        id: 'noPersonalData',
        title: 'No Personal Data',
        description: 'We never collect your name, address, phone number, or payment details.',
        emoji: '👁️',
        iconBg: '#F3E8FF',
    },
    {
        id: 'safeShopping',
        title: 'Safe Shopping',
        description: 'All barcode data is encrypted & single use. Nothing is stored after redemption.',
        emoji: '🛡️',
        iconBg: '#E0F2FE',
    },
];

export const HOW_WE_VERIFY_POINTS = [
    'A temporary anonymous session token is created when you open the app.',
    'Barcodes are one-time-use codes tied only to the specific product and store.',
    'After redemption, the token expires and no data is retained.',
    'Cashback is processed via anonymous store receipts — no name needed.',
] as const;

export const PRIVACY_PROMISE_TEXT =
    'We will never sell, share, or monetize your data. Our business model is built entirely on helping you save — not on advertising or data collection.';
