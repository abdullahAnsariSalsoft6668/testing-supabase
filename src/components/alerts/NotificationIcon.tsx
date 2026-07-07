import { moderateScale } from '@/styles/scaling';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { NotificationIconType } from './types';

type NotificationIconProps = {
    type: NotificationIconType;
};

const ICON_PALETTE: Record<
    NotificationIconType,
    { background: string; foreground: string }
> = {
    route: { background: '#D9E8FF', foreground: '#2F6FED' },
    approved: { background: '#D8F5E4', foreground: '#1B8A4B' },
    schedule: { background: '#E8EDF5', foreground: '#5C6B82' },
    pending: { background: '#FFF0D9', foreground: '#D97706' },
    layover: { background: '#D9E8FF', foreground: '#2F6FED' },
    reminder: { background: '#DDE4F5', foreground: '#001533' },
    system: { background: '#ECEFF3', foreground: '#8A94A6' },
};

const RouteIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M3 13h11l3 4h4V7H6l-3 6z"
            stroke={color}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Circle cx="7.5" cy="17.5" r="1.5" fill={color} />
        <Circle cx="17.5" cy="17.5" r="1.5" fill={color} />
    </Svg>
);

const ApprovedIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
        <Path
            d="M8 12l3 3 5-6"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const BellIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 3a5 5 0 00-5 5v3l-2 3h14l-2-3V8a5 5 0 00-5-5z"
            stroke={color}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path d="M10 19a2 2 0 004 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const ClockIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.6} />
        <Path d="M12 8v5l3 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const InfoIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
        <Path d="M12 10v6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Circle cx="12" cy="7.5" r="1" fill={color} />
    </Svg>
);

const CalendarIcon = ({ color }: { color: string }) => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="5" width="16" height="15" rx="2" stroke={color} strokeWidth={1.6} />
        <Path d="M8 3v4M16 3v4M4 10h16" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
    const palette = ICON_PALETTE[type];

    const icon = useMemo(() => {
        switch (type) {
            case 'route':
                return <RouteIcon color={palette.foreground} />;
            case 'approved':
                return <ApprovedIcon color={palette.foreground} />;
            case 'schedule':
            case 'system':
                return <BellIcon color={palette.foreground} />;
            case 'pending':
                return <ClockIcon color={palette.foreground} />;
            case 'layover':
                return <InfoIcon color={palette.foreground} />;
            case 'reminder':
                return <CalendarIcon color={palette.foreground} />;
            default:
                return <BellIcon color={palette.foreground} />;
        }
    }, [palette.foreground, type]);

    return <View style={[styles.wrap, { backgroundColor: palette.background }]}>{icon}</View>;
};

const styles = StyleSheet.create({
    wrap: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default React.memo(NotificationIcon);
