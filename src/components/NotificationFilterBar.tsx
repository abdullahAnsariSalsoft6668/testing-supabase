import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import fontFamily from '@/styles/fontFamily';
import { moderateScale } from '@/styles/scaling';
import { spaces } from '@/styles/sizes';
import React, { useCallback } from 'react';
import {
    I18nManager,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export type NotificationInboxFilter = 'all' | 'unread';

export interface NotificationFilterBarProps {
    filter: NotificationInboxFilter;
    onFilterChange: (next: NotificationInboxFilter) => void;
    onMarkAllReadPress?: () => void;
    style?: ViewStyle;
}

const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({
    filter,
    onFilterChange,
    onMarkAllReadPress,
    style,
}) => {
    const pillBtn = useCallback(
        (key: NotificationInboxFilter, label: string) => {
            const selected = filter === key;
            return (
                <Pressable
                    onPress={() => onFilterChange(key)}
                    style={[styles.pillSegment, selected && styles.pillSegmentSelected]}
                >
                    <TextComp
                        text={label}
                        style={selected ? styles.pillLabelSelected : styles.pillLabel}
                    />
                </Pressable>
            );
        },
        [filter, onFilterChange]
    );

    return (
        <View style={[styles.row, style]}>
            <View style={styles.pill}>
                {pillBtn('all', 'All')}
                {pillBtn('unread', 'Unread')}
            </View>
            {onMarkAllReadPress ? (
                <Pressable onPress={onMarkAllReadPress} style={styles.markAll} hitSlop={8}>
                    <Text style={styles.checkGlyph}>✓✓</Text>
                    <TextComp text="Mark all as read" style={styles.markAllText} />
                </Pressable>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spaces.small,
        paddingHorizontal: spaces.medium,
        paddingVertical: moderateScale(12),
        backgroundColor: Colors.surface,
        borderRadius: moderateScale(14),
        marginHorizontal: spaces.medium,
        marginBottom: moderateScale(8),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    pill: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: moderateScale(22),
        padding: moderateScale(4),
        gap: moderateScale(4),
    },
    pillSegment: {
        flex: 1,
        paddingVertical: moderateScale(10),
        borderRadius: moderateScale(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillSegmentSelected: {
        backgroundColor: Colors.darkBlue,
    },
    pillLabel: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: Colors.textSecondary,
    },
    pillLabelSelected: {
        fontSize: moderateScale(13),
        fontFamily: fontFamily.bold,
        color: Colors.white,
    },
    markAll: {
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: moderateScale(4),
        maxWidth: '42%',
    },
    checkGlyph: {
        fontSize: moderateScale(12),
        color: Colors.primary,
        fontWeight: '700',
    },
    markAllText: {
        fontSize: moderateScale(11),
        fontFamily: fontFamily.bold,
        color: Colors.primary,
        flexShrink: 1,
    },
});

export default React.memo(NotificationFilterBar);
