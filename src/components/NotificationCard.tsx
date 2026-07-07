import { lifeSavers } from '@/assets/fonts';
import TextComp from '@/components/TextComp';
import MyIcons from '@/components/MyIcons';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import { I18nManager, Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

/** Dusty rose circle behind bell (design) */
export const NOTIFICATION_ICON_CIRCLE_BG = '#E8D5D5';

export interface NotificationCardProps {
    title: string;
    message: string;
    time: string;
    isUnread?: boolean;
    /** Override circle fill; default dusty rose */
    iconCircleColor?: string;
    onPress?: () => void;
    style?: ViewStyle;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    title,
    message,
    time,
    isUnread = false,
    iconCircleColor = NOTIFICATION_ICON_CIRCLE_BG,
    onPress,
    style,
}) => {
    const body = (
        <>
            <View style={[styles.iconCircle, { backgroundColor: iconCircleColor }]}>
                <MyIcons name="notification" size={moderateScale(20)} stroke={Colors.gray500} />
            </View>
            <View style={styles.textBlock}>
                <TextComp text={title} style={styles.cardTitle} numberOfLines={2} />
                <TextComp text={message} style={styles.cardMessage} numberOfLines={3} />
                <TextComp text={time} style={styles.cardTime} />
            </View>
        </>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.card,
                    isUnread && styles.cardUnread,
                    pressed && styles.cardPressed,
                    style,
                ]}
            >
                {body}
            </Pressable>
        );
    }

    return <View style={[styles.card, isUnread && styles.cardUnread, style]}>{body}</View>;
};

const styles = StyleSheet.create({
    card: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: moderateScale(14),
        backgroundColor: Colors.surface,
        borderRadius: moderateScale(18),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(16),
        marginBottom: moderateScale(12),
        ...Platform.select({
            ios: {
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: moderateScale(2) },
                shadowOpacity: 0.08,
                shadowRadius: moderateScale(8),
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cardUnread: {
        borderLeftWidth: I18nManager.isRTL ? 0 : moderateScale(3),
        borderRightWidth: I18nManager.isRTL ? moderateScale(3) : 0,
        borderLeftColor: Colors.primary,
        borderRightColor: Colors.primary,
    },
    cardPressed: {
        opacity: 0.96,
    },
    iconCircle: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBlock: {
        flex: 1,
        minWidth: 0,
        gap: moderateScale(4),
    },
    cardTitle: {
        fontSize: moderateScale(16),
        fontFamily: lifeSavers.bold,
        color: Colors.text,
    },
    cardMessage: {
        fontSize: moderateScale(14),
        fontFamily: fontFamily.regular,
        color: Colors.gray400,
        lineHeight: moderateScale(20),
    },
    cardTime: {
        fontSize: moderateScale(12),
        fontFamily: fontFamily.regular,
        color: Colors.gray300,
        marginTop: moderateScale(2),
    },
});

export default React.memo(NotificationCard);
