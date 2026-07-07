import type { AlertNotification, NotificationFilter } from './types';

export const countUnread = (notifications: AlertNotification[]) =>
    notifications.filter(notification => !notification.isRead).length;

export const filterNotifications = (
    notifications: AlertNotification[],
    filter: NotificationFilter,
) => {
    if (filter === 'unread') {
        return notifications.filter(notification => !notification.isRead);
    }

    return notifications;
};

export const markNotificationRead = (
    notifications: AlertNotification[],
    id: string,
): AlertNotification[] =>
    notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification,
    );

export const markAllNotificationsRead = (
    notifications: AlertNotification[],
): AlertNotification[] => notifications.map(notification => ({ ...notification, isRead: true }));

export const deleteNotification = (
    notifications: AlertNotification[],
    id: string,
): AlertNotification[] => notifications.filter(notification => notification.id !== id);
