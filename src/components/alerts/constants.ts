import type { AlertNotification } from './types';

export const ALERTS_BG = '#001533';
export const ALERTS_GRADIENT_GLOW = '#003380';
export const ALERTS_GRADIENT_MID = '#002366';

export const UNREAD_ACCENT = '#E85D5D';
export const FILTER_ACTIVE_GRADIENT = ['#A30000', '#5C0000'] as const;

export const ENTRANCE_BASE = 50;
export const ENTRANCE_STEP = 36;

export const MOCK_NOTIFICATIONS: AlertNotification[] = [
    {
        id: 'notif-1',
        title: 'New Route Assigned',
        message: 'Route B - Westside has been assigned to you for tomorrow.',
        timestamp: '7h ago',
        isRead: false,
        iconType: 'route',
    },
    {
        id: 'notif-2',
        title: 'Extra Work Approved',
        message: 'Your extra work submission for Downtown route has been approved.',
        timestamp: '10h ago',
        isRead: false,
        iconType: 'approved',
    },
    {
        id: 'notif-3',
        title: 'Schedule Update',
        message: 'Your Thursday schedule has been updated. Check your routes.',
        timestamp: '1d ago',
        isRead: true,
        iconType: 'schedule',
    },
    {
        id: 'notif-4',
        title: 'Extra Work Pending Review',
        message: 'Your Airport Hub submission is awaiting admin approval.',
        timestamp: '1d ago',
        isRead: true,
        iconType: 'pending',
    },
    {
        id: 'notif-5',
        title: 'Layover Report Received',
        message: 'Your layover report from Central Hub has been received.',
        timestamp: '2d ago',
        isRead: true,
        iconType: 'layover',
    },
    {
        id: 'notif-6',
        title: 'Route Reminder',
        message: 'Route A - Downtown starts in 2 hours. Prepare for departure.',
        timestamp: '2d ago',
        isRead: true,
        iconType: 'reminder',
    },
    {
        id: 'notif-7',
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight 11 PM - 1 AM. App may be unavailable.',
        timestamp: '3d ago',
        isRead: true,
        iconType: 'system',
    },
];
