import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { UNREAD_ACCENT } from './constants';
import NotificationIcon from './NotificationIcon';
import type { AlertNotification } from './types';

const TrashIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12"
            stroke={Colors.gray400}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

type NotificationCardProps = {
    notification: AlertNotification;
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
    onPress?: (notification: AlertNotification) => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    onMarkRead,
    onDelete,
    onPress,
}) => {
    const { animatedStyle: trashScale, onPressIn, onPressOut } = usePressScale();
    const { animatedStyle: markReadScale, onPressIn: markIn, onPressOut: markOut } = usePressScale();

    const handleMarkRead = useCallback(() => {
        onMarkRead(notification.id);
    }, [notification.id, onMarkRead]);

    const handleDelete = useCallback(() => {
        onDelete(notification.id);
    }, [notification.id, onDelete]);

    const handlePress = useCallback(() => {
        if (!notification.isRead) {
            onMarkRead(notification.id);
        }
        onPress?.(notification);
    }, [notification, onMarkRead, onPress]);

    return (
        <View
            style={[
                styles.card,
                !notification.isRead && styles.cardUnread,
            ]}
        >
            {!notification.isRead ? <View style={styles.unreadDot} pointerEvents="none" /> : null}

            <Pressable
                onPress={handlePress}
                style={({ pressed }) => [pressed && styles.cardPressed]}
                accessibilityRole="button"
                accessibilityLabel={`${notification.title}. ${notification.message}`}
            >
                <View style={styles.contentRow}>
                    <NotificationIcon type={notification.iconType} />
                    <View style={styles.body}>
                        <TextComp text={notification.title} style={styles.title} />
                        <TextComp text={notification.message} style={styles.message} />
                        <TextComp text={notification.timestamp} style={styles.timestamp} />
                    </View>
                </View>
            </Pressable>

            <View style={styles.actions}>
                {!notification.isRead ? (
                    <Pressable
                        onPress={handleMarkRead}
                        onPressIn={markIn}
                        onPressOut={markOut}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityRole="button"
                        accessibilityLabel={`Mark ${notification.title} as read`}
                    >
                        <Animated.View style={markReadScale}>
                            <TextComp text="Mark read" pointerEvents="none" style={styles.markReadText} />
                        </Animated.View>
                    </Pressable>
                ) : null}

                <Pressable
                    onPress={handleDelete}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.trashButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${notification.title}`}
                >
                    <Animated.View style={trashScale}>
                        <TrashIcon />
                    </Animated.View>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
        overflow: 'hidden',
    },
    cardUnread: {
        borderLeftWidth: moderateScale(3),
        borderLeftColor: UNREAD_ACCENT,
    },
    cardPressed: {
        opacity: 0.96,
    },
    unreadDot: {
        position: 'absolute',
        top: moderateScale(14),
        right: moderateScale(14),
        width: moderateScale(8),
        height: moderateScale(8),
        borderRadius: moderateScale(4),
        backgroundColor: UNREAD_ACCENT,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: moderateScale(12),
        paddingRight: moderateScale(12),
    },
    body: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(15),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
        marginBottom: moderateScale(4),
    },
    message: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        lineHeight: moderateScale(19),
        marginBottom: moderateScale(8),
    },
    timestamp: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray400,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: moderateScale(14),
        marginTop: moderateScale(10),
    },
    markReadText: {
        fontSize: moderateScale(13),
        fontFamily: plusJakarta.bold,
        color: '#2F6FED',
    },
    trashButton: {
        padding: moderateScale(4),
    },
});

const areNotificationCardPropsEqual = (
    prev: NotificationCardProps,
    next: NotificationCardProps,
) =>
    prev.notification.id === next.notification.id &&
    prev.notification.isRead === next.notification.isRead &&
    prev.notification.title === next.notification.title &&
    prev.notification.message === next.notification.message &&
    prev.notification.timestamp === next.notification.timestamp &&
    prev.notification.iconType === next.notification.iconType &&
    prev.onMarkRead === next.onMarkRead &&
    prev.onDelete === next.onDelete &&
    prev.onPress === next.onPress;

export default React.memo(NotificationCard, areNotificationCardPropsEqual);
