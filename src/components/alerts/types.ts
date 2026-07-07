export type NotificationFilter = 'all' | 'unread';

export type NotificationIconType =
    | 'route'
    | 'approved'
    | 'schedule'
    | 'pending'
    | 'layover'
    | 'reminder'
    | 'system';

export type AlertNotification = {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    iconType: NotificationIconType;
};
