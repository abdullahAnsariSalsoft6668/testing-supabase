import type { SettingsSection } from '@/components/settings/types';

export const PRIVACY_SECTIONS: SettingsSection[] = [
    {
        id: 'data',
        title: 'Data & Privacy',
        items: [
            {
                id: 'locationSharing',
                title: 'Location Sharing',
                subtitle: 'Allow the app to access your location',
                icon: 'privacy',
                type: 'toggle',
            },
            {
                id: 'usageAnalytics',
                title: 'Usage Analytics',
                subtitle: 'Help us improve your experience',
                icon: 'notifications',
                type: 'toggle',
            },
            {
                id: 'personalizedContent',
                title: 'Personalized Content',
                subtitle: 'Show content based on your activity',
                icon: 'language',
                type: 'toggle',
            },
        ],
    },
    {
        id: 'account',
        title: 'Your Data',
        items: [
            {
                id: 'downloadData',
                title: 'Download My Data',
                subtitle: 'Request a copy of your information',
                icon: 'password',
                type: 'navigate',
                screen: 'downloadData',
            },
            {
                id: 'deleteAccount',
                title: 'Delete Account',
                subtitle: 'Permanently remove your account',
                icon: 'privacy',
                type: 'navigate',
                screen: 'deleteAccount',
            },
        ],
    },
];
