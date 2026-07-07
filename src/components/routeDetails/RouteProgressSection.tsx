import RouteProgressBar from '@/components/home/RouteProgressBar';
import RouteStatusBadge from '@/components/home/RouteStatusBadge';
import TextComp from '@/components/TextComp';
import { useEntranceAnimation } from '@/hooks/animations/useEntranceAnimation';
import { plusJakarta } from '@/assets/fonts';
import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import RouteDetailsCard from './RouteDetailsCard';
import { ENTRANCE_BASE, ROUTE_PROGRESS_GRADIENT } from './constants';

type RouteProgressSectionProps = {
    completedStops: number;
    totalStops: number;
    progress: number;
};

const RouteProgressSection: React.FC<RouteProgressSectionProps> = ({
    completedStops,
    totalStops,
    progress,
}) => {
    const animatedStyle = useEntranceAnimation({
        index: 0,
        baseDelay: ENTRANCE_BASE,
        translateY: 18,
    });

    const progressLabel = useMemo(
        () =>
            `${completedStops} of ${totalStops} stops completed (${Math.round(progress * 100)}%)`,
        [completedStops, progress, totalStops],
    );

    return (
        <Animated.View style={animatedStyle}>
            <RouteDetailsCard>
                <View style={styles.headerRow}>
                    <TextComp text="Route Progress" style={styles.title} />
                    <RouteStatusBadge status="in_progress" />
                </View>
                <RouteProgressBar
                    progress={progress}
                    delay={ENTRANCE_BASE + 40}
                    fillColors={ROUTE_PROGRESS_GRADIENT}
                />
                <TextComp text={progressLabel} style={styles.subtitle} />
            </RouteDetailsCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(12),
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: plusJakarta.bold,
        color: Colors.text,
    },
    subtitle: {
        marginTop: moderateScale(10),
        fontSize: moderateScale(12),
        fontFamily: plusJakarta.regular,
        color: Colors.gray500,
    },
});

export default React.memo(RouteProgressSection);
