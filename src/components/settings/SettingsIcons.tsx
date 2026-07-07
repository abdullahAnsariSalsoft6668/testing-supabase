import { moderateScale } from '@/styles/scaling';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const ICON_COLOR = '#001533';

export const MenuIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 20 20" fill="none">
        <Path d="M3 5h14M3 10h14M3 15h14" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
);

export const BellIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 3a5 5 0 00-5 5v3l-2 3h14l-2-3V8a5 5 0 00-5-5z"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path d="M10 19a2 2 0 004 0" stroke={ICON_COLOR} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
);

export const MoonIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 14.5A8.5 8.5 0 1111.5 6 6.5 6.5 0 0020 14.5z"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
    </Svg>
);

export const GlobeIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth={1.6} />
        <Path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke={ICON_COLOR} strokeWidth={1.6} />
    </Svg>
);

export const LockIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M7 11V8a5 5 0 0110 0v3"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
        <Path
            d="M6 11h12v10H6V11z"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
    </Svg>
);

export const EyeIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="2.5" stroke={ICON_COLOR} strokeWidth={1.6} />
    </Svg>
);

export const ChevronRightIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 6l6 6-6 6"
            stroke="#9CA3AF"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
