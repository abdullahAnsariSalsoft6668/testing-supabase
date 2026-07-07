import type { IconName } from '@/components/MyIcons';

export type MenuFeatureItem = {
    id: string;
    title: string;
    subtitle: string;
    icon: IconName;
    route?: 'insights' | 'helpHowItWorks' | 'privacyFirst' | 'supportedStores';
};

export const MENU_FEATURES: MenuFeatureItem[] = [
    {
        id: 'stores',
        title: 'Supported Stores',
        subtitle: '28+ supermarkets covered',
        icon: 'shop',
        route: 'supportedStores',
    },
    {
        id: 'privacy',
        title: 'Privacy First',
        subtitle: 'No data collected, ever',
        icon: 'privacy',
        route: 'privacyFirst',
    },
    {
        id: 'insights',
        title: 'Savings Insights',
        subtitle: 'Your saving analytics',
        icon: 'coin',
        route: 'insights',
    },
    {
        id: 'help',
        title: 'Help & FAQs',
        subtitle: 'How the app works',
        icon: 'question',
        route: 'helpHowItWorks',
    },
];

export const MENU_ACTIONS = [
    { id: 'share', label: 'Share App', icon: 'curveArrow' as IconName },
    { id: 'rate', label: 'Rate Us', icon: 'goodFeedback' as IconName },
] as const;
