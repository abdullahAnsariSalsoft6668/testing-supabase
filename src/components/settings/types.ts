export type SettingsItemType = 'toggle' | 'navigate';

export type SettingsItem = {
    id: string;
    title: string;
    subtitle: string;
    icon: 'notifications' | 'darkMode' | 'language' | 'password' | 'privacy';
    type: SettingsItemType;
    screen?: string;
};

export type SettingsSection = {
    id: string;
    title: string;
    items: SettingsItem[];
};
