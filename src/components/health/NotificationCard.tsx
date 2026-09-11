import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import ScalePressable from '@/components/ui/ScalePressable';
import { listItemEntering } from '@/hooks/animations/listMotion';
import { moderateScale } from '@/styles/scaling';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

type NotificationCardProps = {
    title: string;
    body: string;
    timeLabel: string;
    unread?: boolean;
    index?: number;
    onPress?: () => void;
};

const NotificationCard = ({
    title,
    body,
    timeLabel,
    unread = false,
    index = 0,
    onPress,
}: NotificationCardProps) => (
    <ScalePressable onPress={onPress}>
        <Animated.View entering={listItemEntering(index)} style={styles.card}>
            <View style={[styles.iconWash, unread && styles.iconWashUnread]}>
                <MyIcons
                    name="healthTabFile"
                    size={moderateScale(18)}
                    stroke={unread ? theme.palette.ink : theme.palette.lime.main}
                />
            </View>
            <View style={styles.info}>
                <View style={styles.titleRow}>
                    <TextComp text={title} style={typography.label} />
                    {unread ? <View style={styles.dot} /> : null}
                </View>
                <TextComp text={body} style={styles.body} numberOfLines={2} />
                <TextComp text={timeLabel} style={styles.time} />
            </View>
        </Animated.View>
    </ScalePressable>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.card.background,
        borderRadius: theme.radius.card,
        padding: moderateScale(14),
        marginBottom: moderateScale(10),
        borderWidth: 1,
        borderColor: theme.colors.border.default,
        gap: moderateScale(12),
    },
    iconWash: {
        width: theme.iconWash.size,
        height: theme.iconWash.size,
        borderRadius: theme.iconWash.radius,
        backgroundColor: theme.palette.lime.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWashUnread: {
        backgroundColor: theme.palette.lime.main,
    },
    info: { flex: 1, gap: moderateScale(4) },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    dot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: theme.palette.lime.main,
    },
    body: {
        ...typography.bodySmall,
    },
    time: {
        ...typography.bodySmall,
        color: theme.colors.text.muted,
    },
});

export default NotificationCard;
