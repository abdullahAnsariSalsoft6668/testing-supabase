import MyIcons from '@/components/MyIcons';
import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import MarkCompleteButton from './MarkCompleteButton';
import RouteDetailsCard from './RouteDetailsCard';
import StopStatusBadge from './StopStatusBadge';
import { ENTRANCE_BASE, ENTRANCE_STEP } from './constants';
import type { RouteStop } from './types';

type StopListItemProps = {
    stop: RouteStop;
    index: number;
    isLast: boolean;
    onMarkComplete: (stopId: string) => void;
};

const CompletedIcon = () => (
    <View style={styles.completedIcon}>
        <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
            <Path
                d="M5 12l5 5L19 7"
                stroke={Colors.white}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    </View>
);

const CurrentIcon = () => (
    <View style={styles.currentIcon}>
        <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 11l18-8-8 18-2-8-8-2z"
                fill={Colors.white}
                stroke={Colors.white}
                strokeLinejoin="round"
            />
        </Svg>
    </View>
);

const PendingIcon = () => (
    <View style={styles.pendingIcon}>
        <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="8" stroke={Colors.gray300} strokeWidth={2} />
        </Svg>
    </View>
);

const StopListItem: React.FC<StopListItemProps> = ({
    stop,
    index,
    isLast,
    onMarkComplete,
}) => {
    const animatedStyle = useEntranceAnimation({
        index: index + 2,
        baseDelay: ENTRANCE_BASE + 20,
        step: ENTRANCE_STEP,
        translateY: 22,
    });

    const showAction = stop.status !== 'completed';

    const handleMarkComplete = useCallback(() => {
        onMarkComplete(stop.id);
    }, [onMarkComplete, stop.id]);

    const icon = useMemo(() => {
        if (stop.status === 'completed') {
            return <CompletedIcon />;
        }
        if (stop.status === 'current') {
            return <CurrentIcon />;
        }
        return <PendingIcon />;
    }, [stop.status]);

    return (
        <Animated.View style={animatedStyle}>
            <View style={styles.row}>
                <View style={styles.timeline}>
                    {icon}
                    {!isLast ? <View style={styles.connector} /> : null}
                </View>

                <View style={styles.content}>
                    <RouteDetailsCard style={styles.card}>
                        <View style={styles.titleRow}>
                            <TextComp text={stop.name} style={styles.title} />
                            {stop.status === 'current' ? <StopStatusBadge /> : null}
                        </View>
                        <TextComp text={stop.address} style={styles.address} />
                        <View style={styles.timeRow}>
                            <MyIcons name="time" size={moderateScale(12)} />
                            <TextComp text={stop.time} style={styles.time} />
                        </View>
                        {showAction ? <MarkCompleteButton onPress={handleMarkComplete} /> : null}
                    </RouteDetailsCard>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    timeline: {
        width: moderateScale(34),
        alignItems: 'center',
        marginRight: moderateScale(8),
    },
    connector: {
        width: 2,
        minHeight: moderateScale(36),
        backgroundColor: Colors.gray200,
        marginTop: moderateScale(6),
    },
    completedIcon: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        backgroundColor: '#1B8A4B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentIcon: {
        width: moderateScale(28),
        height: moderateScale(28),
        borderRadius: moderateScale(14),
        backgroundColor: '#2F6FED',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pendingIcon: {
        width: moderateScale(28),
        height: moderateScale(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    card: {
        marginBottom: moderateScale(10),
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(8),
        marginBottom: moderateScale(4),
    },
    title: {
        flex: 1,
        fontSize: moderateScale(15),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    address: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
        marginBottom: moderateScale(8),
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
    },
    time: {
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
});

export default React.memo(StopListItem);
