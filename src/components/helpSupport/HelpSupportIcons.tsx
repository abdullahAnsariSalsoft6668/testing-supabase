import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const PhoneIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M6.5 4h3l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v3a2 2 0 01-2.2 2 17 17 0 01-11.3-6.7A2 2 0 014 15.2V13"
            stroke={Colors.white}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const EmailIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="6" width="18" height="12" rx="2" stroke={Colors.white} strokeWidth={1.6} />
        <Path d="M3 8l9 6 9-6" stroke={Colors.white} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
);

export const ChatIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M5 6h14a2 2 0 012 2v7a2 2 0 01-2 2H10l-4 3v-3H5a2 2 0 01-2-2V8a2 2 0 012-2z"
            stroke="#4B5563"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
    </Svg>
);

export const DocsIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M8 3h6l4 4v14H8V3z"
            stroke="#4B5563"
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path d="M14 3v5h5" stroke="#4B5563" strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
);

export const ChevronRightIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 6l6 6-6 6"
            stroke={Colors.gray400}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const FaqIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill="#D9E8FF" />
        <Path
            d="M9.5 9.5a2.5 2.5 0 014.5 1.5c0 2-2.5 2-2.5 3.5"
            stroke="#2F6FED"
            strokeWidth={1.6}
            strokeLinecap="round"
        />
        <Circle cx="12" cy="17" r="0.9" fill="#2F6FED" />
    </Svg>
);

export const MenuIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 20 20" fill="none">
        <Path d="M3 5h14M3 10h14M3 15h14" stroke={Colors.white} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);
