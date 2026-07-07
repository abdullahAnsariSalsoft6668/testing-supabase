import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { usePressScale } from '@/hooks/animations/usePressScale';
import MyIcons from '@/components/MyIcons';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
    HOME_ENTRANCE_BASE,
    HOME_ENTRANCE_STEP,
} from './constants';
import RouteActionButton from './RouteActionButton';
import RouteMetaRow from './RouteMetaRow';
import RouteProgressBar from './RouteProgressBar';
import RouteStatusBadge from './RouteStatusBadge';
import type { RouteItem } from './types';

type RouteCardProps = {
    route: RouteItem;
    index: number;
    onPress?: (route: RouteItem) => void;
    onActionPress?: (route: RouteItem) => void;
};

const RouteCard: React.FC<RouteCardProps> = ({
    route,
    index,
    onPress,
    onActionPress,
}) => {
    const animatedStyle = useEntranceAnimation({
        index: index + 1,
        baseDelay: HOME_ENTRANCE_BASE + HOME_ENTRANCE_STEP * 2,
        step: HOME_ENTRANCE_STEP,
    });
    const { animatedStyle: chevronScale, onPressIn, onPressOut } = usePressScale();

    const actionVariant = useMemo(() => {
        if (route.status === 'in_progress') {
            return 'continue' as const;
        }
        if (route.status === 'scheduled') {
            return 'start' as const;
        }
        return 'details' as const;
    }, [route.status]);

    const showProgress =
        route.status !== 'details' &&
        route.totalStops != null &&
        route.completedStops != null;

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Pressable onPress={() => onPress?.(route)} disabled={!onPress}>
                <View style={styles.headerRow}>
                    <TextComp text={route.name} style={styles.title} />
                    <RouteStatusBadge status={route.status} />
                </View>

                {route.timeRange ? <RouteMetaRow icon="timeGrey" text={route.timeRange} /> : null}
                {route.path ? <RouteMetaRow icon="locationGrey" text={route.path} /> : null}
                {route.date ? <RouteMetaRow icon="dateIcon" text={route.date} /> : null}

                {showProgress ? (
                    <View style={styles.progressBlock}>
                        <RouteProgressBar
                            progress={route.progress ?? 0}
                            delay={HOME_ENTRANCE_BASE + HOME_ENTRANCE_STEP * (index + 3)}
                        />
                        <TextComp
                            text={`${route.completedStops} of ${route.totalStops} stops completed`}
                            style={styles.progressText}
                        />
                    </View>
                ) : null}
            </Pressable>

            <View style={styles.actionRow}>
                <RouteActionButton
                    variant={actionVariant}
                    onPress={() => onActionPress?.(route)}
                    style={route.status === 'details' ? styles.fullAction : styles.primaryAction}
                />

                {route.status !== 'details' ? (
                    <Animated.View style={chevronScale}>
                        <Pressable
                            onPress={() => onActionPress?.(route)}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                            style={styles.secondaryAction}
                            accessibilityRole="button"
                            accessibilityLabel={`Open ${route.name}`}
                        >
                            <MyIcons name="rightChevron" size={moderateScale(16)} />
                        </Pressable>
                    </Animated.View>
                ) : null}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: moderateScale(16),
        padding: moderateScale(16),
        marginBottom: moderateScale(14),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(10),
        marginBottom: moderateScale(12),
    },
    title: {
        flex: 1,
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    progressBlock: {
        marginTop: moderateScale(4),
        marginBottom: moderateScale(14),
        gap: moderateScale(8),
    },
    progressText: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(10),
    },
    primaryAction: {
        flex: 1,
    },
    fullAction: {
        flex: 1,
    },
    secondaryAction: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: Colors.gray100,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(RouteCard);
