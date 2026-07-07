import TextComp from '@/components/TextComp';
import { Colors } from '@/styles/colors';
import { plusJakarta } from '@/assets/fonts';
import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import type { RouteStatus } from './types';

type RouteStatusBadgeProps = {
    status: RouteStatus;
    style?: ViewStyle;
};

const STATUS_COPY: Record<RouteStatus, string> = {
    in_progress: 'In Progress',
    scheduled: 'Scheduled',
    details: 'Scheduled',
};

const RouteStatusBadge: React.FC<RouteStatusBadgeProps> = ({ status, style }) => {
    const palette = useMemo(() => {
        if (status === 'in_progress') {
            return {
                backgroundColor: '#D9E8FF',
                color: '#2F6FED',
            };
        }

        return {
            backgroundColor: Colors.gray100,
            color: Colors.gray500,
        };
    }, [status]);

    return (
        <View style={[styles.badge, { backgroundColor: palette.backgroundColor }, style]}>
            <TextComp
                text={STATUS_COPY[status]}
                style={[styles.label, { color: palette.color }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(6),
    },
    label: {
        fontSize: moderateScale(11),
        fontFamily: plusJakarta.bold,
    },
});

export default React.memo(RouteStatusBadge);
