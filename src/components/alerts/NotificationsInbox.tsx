import { localImages } from '@/assets/images';
import TextComp from '@/components/TextComp';
import WrapperContainer from '@/components/WrapperContainer';
import routes from '@/constants/routes';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StatusBar, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import AlertsFilterBar from './AlertsFilterBar';
import AlertsHeader from './AlertsHeader';
import NotificationCard from './NotificationCard';
import {
    ALERTS_BG,
    ALERTS_GRADIENT_GLOW,
    ALERTS_GRADIENT_MID,
    MOCK_NOTIFICATIONS,
} from './constants';
import styles from './notificationsInboxStyles';
import type { AlertNotification, NotificationFilter, NotificationIconType } from './types';
import {
    countUnread,
    deleteNotification,
    filterNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from './utils';

const GRADIENT_OVERLAY = {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

type EmptyStateProps = {
    filter: NotificationFilter;
};

const EmptyState = ({ filter }: EmptyStateProps) => (
    <View style={styles.emptyState}>
        <TextComp
            text={filter === 'unread' ? "You're all caught up" : 'No notifications to show'}
            style={styles.emptyText}
        />
    </View>
);

type NotificationsInboxProps = {
    showBackButton?: boolean;
};

const getNotificationDestination = (iconType: NotificationIconType) => {
    switch (iconType) {
        case 'route':
        case 'reminder':
            return { screen: routes.main.routeDetails, params: { routeId: 'route-a-downtown' } };
        case 'approved':
        case 'pending':
            return { screen: routes.tab.extraWork };
        case 'layover':
            return { screen: routes.tab.layover };
        case 'schedule':
            return { screen: routes.tab.home };
        case 'system':
            return { screen: routes.main.helpSupport };
        default:
            return null;
    }
};

const NotificationsInbox: React.FC<NotificationsInboxProps> = ({ showBackButton = false }) => {
    const navigation = useNavigation<any>();
    const [notifications, setNotifications] = useState<AlertNotification[]>(MOCK_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

    const unreadCount = useMemo(() => countUnread(notifications), [notifications]);
    const filteredNotifications = useMemo(
        () => filterNotifications(notifications, activeFilter),
        [activeFilter, notifications],
    );

    const listExtraData = useMemo(
        () => ({ activeFilter, unreadCount, notifications }),
        [activeFilter, notifications, unreadCount],
    );

    const handleMarkRead = useCallback((id: string) => {
        setNotifications(current => markNotificationRead(current, id));
    }, []);

    const handleMarkAllRead = useCallback(() => {
        setNotifications(current => {
            if (!current.some(notification => !notification.isRead)) {
                return current;
            }
            return markAllNotificationsRead(current);
        });
        setActiveFilter('all');
    }, []);

    const handleDelete = useCallback((id: string) => {
        setNotifications(current => deleteNotification(current, id));
    }, []);

    const handleNotificationPress = useCallback(
        (notification: AlertNotification) => {
            const destination = getNotificationDestination(notification.iconType);
            if (!destination) {
                return;
            }

            if (destination.screen === routes.tab.extraWork || destination.screen === routes.tab.layover || destination.screen === routes.tab.home) {
                navigation.navigate(routes.navigator.tab as never, {
                    screen: destination.screen,
                } as never);
                return;
            }

            navigation.navigate(routes.navigator.main as never, {
                screen: destination.screen,
                params: destination.params,
            } as never);
        },
        [navigation],
    );

    const renderNotification: ListRenderItem<AlertNotification> = useCallback(
        ({ item }) => (
            <View style={styles.itemContainer}>
                <NotificationCard
                    notification={item}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                    onPress={handleNotificationPress}
                />
            </View>
        ),
        [handleDelete, handleMarkRead, handleNotificationPress],
    );

    const keyExtractor = useCallback((item: AlertNotification) => item.id, []);

    const emptyList = useMemo(
        () => <EmptyState filter={activeFilter} />,
        [activeFilter],
    );

    return (
        <WrapperContainer
            style={styles.container}
            edges={['top']}
            innerBackgroundColor={ALERTS_BG}
        >
            <StatusBar barStyle="light-content" backgroundColor={ALERTS_BG} />
            <View style={styles.screen}>
                <View style={styles.headerBlock}>
                    <LinearGradient
                        colors={['#00050a', ALERTS_BG, '#00081a']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerGradient}
                    >
                        <LinearGradient
                            colors={[ALERTS_GRADIENT_GLOW, ALERTS_GRADIENT_MID, 'transparent']}
                            locations={[0, 0.45, 1]}
                            start={{ x: 0.62, y: 0 }}
                            end={{ x: 0.2, y: 0.9 }}
                            style={GRADIENT_OVERLAY}
                            pointerEvents="none"
                        />
                        <AlertsHeader
                            avatarSource={localImages.user}
                            unreadCount={unreadCount}
                            showBackButton={showBackButton}
                        />
                        <AlertsFilterBar
                            activeFilter={activeFilter}
                            totalCount={notifications.length}
                            unreadCount={unreadCount}
                            onFilterChange={setActiveFilter}
                            onMarkAllRead={handleMarkAllRead}
                        />
                    </LinearGradient>
                </View>

                <View style={styles.listWrapper}>
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        data={filteredNotifications}
                        extraData={listExtraData}
                        keyExtractor={keyExtractor}
                        renderItem={renderNotification}
                        ListEmptyComponent={emptyList}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        initialNumToRender={7}
                        maxToRenderPerBatch={5}
                        windowSize={8}
                        removeClippedSubviews={false}
                    />
                </View>
            </View>
        </WrapperContainer>
    );
};

export default NotificationsInbox;
