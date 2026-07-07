import TextComp from '@/components/TextComp';
import { usePressScale } from '@/hooks/animations/usePressScale';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

import { FILTER_ACTIVE_GRADIENT } from './constants';
import type { NotificationFilter } from './types';

type AlertsFilterBarProps = {
    activeFilter: NotificationFilter;
    totalCount: number;
    unreadCount: number;
    onFilterChange: (filter: NotificationFilter) => void;
    onMarkAllRead: () => void;
};

type FilterPillProps = {
    label: string;
    isActive: boolean;
    onPress: () => void;
};

const FilterPill: React.FC<FilterPillProps> = ({ label, isActive, onPress }) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressScale();

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
        >
            <Animated.View
                style={[
                    styles.pillShell,
                    !isActive && styles.inactivePill,
                    animatedStyle,
                ]}
            >
                {isActive ? (
                    <LinearGradient
                        colors={[...FILTER_ACTIVE_GRADIENT]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        pointerEvents="none"
                        style={StyleSheet.absoluteFillObject}
                    />
                ) : null}
                <TextComp
                    text={label}
                    style={isActive ? styles.activePillText : styles.inactivePillText}
                />
            </Animated.View>
        </Pressable>
    );
};

const AlertsFilterBar: React.FC<AlertsFilterBarProps> = ({
    activeFilter,
    totalCount,
    unreadCount,
    onFilterChange,
    onMarkAllRead,
}) => {
    const selectAll = useCallback(() => onFilterChange('all'), [onFilterChange]);
    const selectUnread = useCallback(() => onFilterChange('unread'), [onFilterChange]);

    const handleMarkAllReadPress = useCallback(() => {
        if (unreadCount > 0) {
            onMarkAllRead();
        }
    }, [onMarkAllRead, unreadCount]);

    return (
        <View style={styles.bar}>
            <View style={styles.pills}>
                <FilterPill
                    label={`All (${totalCount})`}
                    isActive={activeFilter === 'all'}
                    onPress={selectAll}
                />
                <FilterPill
                    label={`Unread (${unreadCount})`}
                    isActive={activeFilter === 'unread'}
                    onPress={selectUnread}
                />
            </View>

            <Pressable
                onPress={handleMarkAllReadPress}
                disabled={unreadCount === 0}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => [
                    styles.markAllButton,
                    unreadCount === 0 && styles.markAllButtonDisabled,
                    pressed && unreadCount > 0 && styles.markAllButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Mark all read"
                accessibilityState={{ disabled: unreadCount === 0 }}
            >
                <TextComp
                    text="Mark all read"
                    pointerEvents="none"
                    style={[
                        styles.markAllText,
                        unreadCount === 0 && styles.markAllTextDisabled,
                    ]}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: moderateScale(16),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(8),
        marginBottom: moderateScale(18),
    },
    pills: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(8),
        flexShrink: 1,
    },
    pillShell: {
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(14),
        paddingVertical: moderateScale(8),
        overflow: 'hidden',
    },
    inactivePill: {
        backgroundColor: Colors.white,
    },
    activePillText: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
    inactivePillText: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    markAllButton: {
        flexShrink: 0,
        paddingVertical: moderateScale(8),
        paddingHorizontal: moderateScale(4),
        minHeight: moderateScale(36),
        justifyContent: 'center',
    },
    markAllButtonDisabled: {
        opacity: 0.45,
    },
    markAllButtonPressed: {
        opacity: 0.85,
    },
    markAllText: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.bold,
        color: Colors.white,
    },
    markAllTextDisabled: {
        opacity: 0.45,
    },
});

export default React.memo(AlertsFilterBar);
