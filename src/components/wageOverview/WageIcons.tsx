import { moderateScale } from '@/styles/scaling';
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const TruckIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M3 13h11l3 4h4V7H6l-3 6z"
            stroke="#2F6FED"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Circle cx="7.5" cy="17.5" r="1.5" fill="#2F6FED" />
        <Circle cx="17.5" cy="17.5" r="1.5" fill="#2F6FED" />
    </Svg>
);

export const ExtraBoxIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 8l8-4 8 4v8l-8 4-8-4V8z"
            stroke="#C62828"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path d="M12 4v16M4 8l8 4 8-4" stroke="#C62828" strokeWidth={1.6} />
    </Svg>
);

export const HoursClockIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="8" stroke="#1B8A4B" strokeWidth={1.6} />
        <Path d="M12 8v5l3 2" stroke="#1B8A4B" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

export const HourlyTrendIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 16l5-5 4 4 7-9"
            stroke="#D97706"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M16 6h4v4" stroke="#D97706" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

export const CalendarIcon = () => (
    <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="5" width="16" height="15" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} />
        <Path d="M8 3v4M16 3v4M4 10h16" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

export const PaymentCalendarIcon = () => (
    <Svg width={moderateScale(14)} height={moderateScale(14)} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="5" width="16" height="15" rx="2" stroke="#9CA3AF" strokeWidth={1.5} />
        <Path d="M8 3v4M16 3v4M4 10h16" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

export const DollarIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 3v18"
            stroke="#1B8A4B"
            strokeWidth={1.8}
            strokeLinecap="round"
        />
        <Path
            d="M15 8.5c0-1.5-1.5-2.5-3-2.5S9 7 9 8.5 10.5 11 12 11s3 .5 3 2.5-1.5 2.5-3 2.5"
            stroke="#1B8A4B"
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </Svg>
);

export const InfoIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke="#2F6FED" strokeWidth={1.6} />
        <Path d="M12 10v6" stroke="#2F6FED" strokeWidth={1.8} strokeLinecap="round" />
        <Circle cx="12" cy="7.5" r="1" fill="#2F6FED" />
    </Svg>
);

export const MenuIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 20 20" fill="none">
        <Path d="M3 5h14M3 10h14M3 15h14" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);
