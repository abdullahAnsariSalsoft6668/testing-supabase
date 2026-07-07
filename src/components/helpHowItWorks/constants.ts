export type QuickStartStep = {
    id: string;
    step: number;
    title: string;
    description: string;
    emoji: string;
};

export type HelpFaqQuestion = {
    id: string;
    question: string;
    answer: string;
};

export type HelpFaqSection = {
    id: string;
    title: string;
    emoji: string;
    headerBg: string;
    questions: HelpFaqQuestion[];
};

export const QUICK_START_STEPS: QuickStartStep[] = [
    {
        id: 'deals',
        step: 1,
        title: 'Open Deals tab',
        description: 'Browse hundreds of live discounts from 20+ stores',
        emoji: '🔍',
    },
    {
        id: 'tap-deal',
        step: 2,
        title: 'Tap any Deal',
        description: 'See exactly how much you save and all stacked discounts',
        emoji: '🎟️',
    },
    {
        id: 'barcode',
        step: 3,
        title: 'Generate Barcode',
        description: 'One tap creates a personalized savings barcode',
        emoji: '📱',
    },
    {
        id: 'checkout',
        step: 4,
        title: 'Show at Checkout',
        description: 'The cashier scans it and your savings apply instantly',
        emoji: '🛒',
    },
    {
        id: 'cashback',
        step: 5,
        title: 'Cashback Arrives',
        description: 'Extra savings land in your account within 1–2 days',
        emoji: '💰',
    },
];

export const HELP_FAQ_SECTIONS: HelpFaqSection[] = [
    {
        id: 'barcode',
        title: 'How Barcode Redemption Works',
        emoji: '📊',
        headerBg: '#F3E8FF',
        questions: [
            {
                id: 'barcode-1',
                question: 'How do I use the barcode at checkout?',
                answer:
                    'Open any deal, tap Generate Barcode, and show the code on your screen when you pay. The cashier scans it like a regular coupon.',
            },
            {
                id: 'barcode-2',
                question: 'How long is the barcode valid?',
                answer:
                    'Each barcode is single-use and expires after 24 hours or once redeemed — whichever comes first.',
            },
            {
                id: 'barcode-3',
                question: "What if the cashier can't scan my barcode?",
                answer:
                    'Increase screen brightness and hold the phone steady. You can also tap Regenerate Barcode or ask support for a manual override code.',
            },
        ],
    },
    {
        id: 'discounts',
        title: 'How Discounts Work',
        emoji: '💠',
        headerBg: '#DBEAFE',
        questions: [
            {
                id: 'discounts-1',
                question: 'How does automatic coupon stacking work?',
                answer:
                    'We combine store promotions, manufacturer coupons, and app-exclusive offers into one barcode so you get the best total price automatically.',
            },
            {
                id: 'discounts-2',
                question: 'Where do the deals come from?',
                answer:
                    'Deals are pulled daily from 28+ partner stores and verified against live store catalogs and promotion feeds.',
            },
            {
                id: 'discounts-3',
                question: "Why are some deals marked 'Limited Time'?",
                answer:
                    'These offers have a short redemption window or limited inventory. Grab them early before they expire or sell out.',
            },
        ],
    },
    {
        id: 'cashback',
        title: 'How Cashback Works',
        emoji: '💳',
        headerBg: '#FFEDD5',
        questions: [
            {
                id: 'cashback-1',
                question: 'How do I receive my cashback?',
                answer:
                    'After your purchase is verified, cashback appears in the Cashback tab. You can withdraw to your preferred payout method.',
            },
            {
                id: 'cashback-2',
                question: 'Do I need a bank account for cashback?',
                answer:
                    'No bank account is required to start saving. Link a payout method only when you are ready to withdraw earned cashback.',
            },
            {
                id: 'cashback-3',
                question: 'Why does cashback take 1–2 days?',
                answer:
                    'We wait for the store to confirm your receipt and redemption before releasing cashback to prevent fraud.',
            },
            {
                id: 'cashback-4',
                question: 'Is there a minimum cashback amount?',
                answer:
                    'There is no minimum per deal. Withdrawals require a $5 balance to keep processing costs low.',
            },
        ],
    },
    {
        id: 'privacy',
        title: 'Privacy & No Login',
        emoji: '🛡️',
        headerBg: '#FCE7F3',
        questions: [
            {
                id: 'privacy-1',
                question: "Why don't I need to create an account?",
                answer:
                    'We use anonymous session tokens instead of accounts so you can save money without sharing personal information.',
            },
            {
                id: 'privacy-2',
                question: 'How is my cashback saved without an account?',
                answer:
                    'Cashback is tied to a secure device token that resets after payout. No name, email, or password is ever stored.',
            },
            {
                id: 'privacy-3',
                question: 'Do you sell my shopping data?',
                answer:
                    'Never. We do not collect, sell, or share your shopping data. Our revenue comes from helping you save, not from ads.',
            },
        ],
    },
];
