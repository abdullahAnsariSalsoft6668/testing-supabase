import { Colors } from '@/styles/colors';
import { palette } from '@/styles/palette';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const ICON_COLOR = '#4B5563';
const LOGOUT_COLOR = palette.purple.main;

export const WorkHistoryIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 8v5l3 2"
            stroke={ICON_COLOR}
            strokeWidth={1.8}
            strokeLinecap="round"
        />
        <Path
            d="M12 22a10 10 0 100-20 10 10 0 000 20z"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
        />
        <Path
            d="M16 3l2 2-2 2"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const WageOverviewIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 3v18"
            stroke={ICON_COLOR}
            strokeWidth={1.8}
            strokeLinecap="round"
        />
        <Path
            d="M15.5 7.5c0-1.5-1.5-2.5-3.5-2.5S8.5 6 8.5 7.5 10 10 12 10s3.5.5 3.5 2.5S13.5 15 12 15s-3.5-1-3.5-2.5"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </Svg>
);

export const ProfileIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={ICON_COLOR} strokeWidth={1.6} />
        <Path
            d="M5 20c1.5-4 5-6 7-6s5.5 2 7 6"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </Svg>
);

export const SettingsIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" stroke={ICON_COLOR} strokeWidth={1.6} />
        <Path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </Svg>
);

export const HelpSupportIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth={1.6} />
        <Path
            d="M9.5 9.5a2.5 2.5 0 014.5 1.5c0 2-2.5 2-2.5 3.5"
            stroke={ICON_COLOR}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
        <Circle cx="12" cy="17" r="0.9" fill={ICON_COLOR} />
    </Svg>
);

export const LogoutIcon = () => (
    <Svg width={moderateScale(22)} height={moderateScale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M10 7V5a2 2 0 012-2h7v18h-7a2 2 0 01-2-2v-2"
            stroke={LOGOUT_COLOR}
            strokeWidth={1.6}
            strokeLinejoin="round"
        />
        <Path
            d="M15 12H4m0 0l3-3M4 12l3 3"
            stroke={LOGOUT_COLOR}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const CloseIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M6 6l12 12M18 6L6 18"
            stroke={Colors.white}
            strokeWidth={2}
            strokeLinecap="round"
        />
    </Svg>
);
