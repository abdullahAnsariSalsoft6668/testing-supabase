import type { SettingsSection } from './types';

/** Avoid importing routes here — settings/constants is pulled in via routes.ts → screens barrel cycle. */
const CHANGE_PASSWORD_SCREEN = 'ChangePassword';
const PRIVACY_SETTINGS_SCREEN = 'PrivacySettings';

export const SETTINGS_BG = '#001533';
export const SETTINGS_GRADIENT_GLOW = '#003380';
export const SETTINGS_GRADIENT_MID = '#002366';
export const TOGGLE_ACTIVE = '#A31D1D';

export const ENTRANCE_BASE = 50;
export const ENTRANCE_STEP = 36;

export const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        id: 'preferences',
        title: 'Preferences',
        items: [
            {
                id: 'notifications',
                title: 'Notifications',
                subtitle: 'Receive push notifications',
                icon: 'notifications',
                type: 'toggle',
            },
            {
                id: 'darkMode',
                title: 'Dark Mode',
                subtitle: 'Switch to dark theme',
                icon: 'darkMode',
                type: 'toggle',
            },
            {
                id: 'language',
                title: 'Language',
                subtitle: 'English (US)',
                icon: 'language',
                type: 'navigate',
            },
        ],
    },
    {
        id: 'security',
        title: 'Security',
        items: [
            {
                id: 'changePassword',
                title: 'Change Password',
                subtitle: 'Update your password',
                icon: 'password',
                type: 'navigate',
                screen: CHANGE_PASSWORD_SCREEN,
            },
            {
                id: 'privacy',
                title: 'Privacy Settings',
                subtitle: 'Manage data and privacy',
                icon: 'privacy',
                type: 'navigate',
                screen: PRIVACY_SETTINGS_SCREEN,
            },
        ],
    },
];
