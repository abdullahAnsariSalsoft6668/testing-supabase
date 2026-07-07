import type { FaqItem, QuickActionItem } from './types';

export const HELP_SUPPORT_BG = '#001533';
export const HELP_GRADIENT_GLOW = '#003380';
export const HELP_GRADIENT_MID = '#002366';

export const CONTACT_CARD_GRADIENT = ['#002366', '#001533'] as const;

export const ENTRANCE_BASE = 50;
export const ENTRANCE_STEP = 36;

export const SUPPORT_PHONE = '(555) 100-2000';
export const SUPPORT_EMAIL = 'support@flystraight.com';

export const QUICK_ACTIONS: QuickActionItem[] = [
    {
        id: 'live-chat',
        title: 'Live Chat',
        subtitle: 'Chat with support team',
        type: 'chat',
    },
    {
        id: 'documentation',
        title: 'Documentation',
        subtitle: 'View user guides',
        type: 'docs',
    },
];

export const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'faq-1',
        question: 'How do I submit extra work?',
        answer:
            'Navigate to the Extra Work tab and fill out the submission form with route details and supporting documents.',
    },
    {
        id: 'faq-2',
        question: 'When are wages calculated?',
        answer:
            'Wages are calculated weekly and payments are processed every Friday. Check the Wage Overview for details.',
    },
    {
        id: 'faq-3',
        question: 'How do I report a layover?',
        answer:
            'Use the Layover tab to submit a report with the reason, location, and any supporting documentation.',
    },
    {
        id: 'faq-4',
        question: 'Can I edit my submitted routes?',
        answer:
            'No, submitted routes cannot be edited. Contact admin if you need to make changes after submission.',
    },
];
