import { Colors } from '@/styles/colors';
import { moderateScale } from '@/styles/scaling';
import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { NOTICE_BORDER } from './constants';

export const WarningIcon = () => (
    <Svg width={moderateScale(20)} height={moderateScale(20)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 3l10 18H2L12 3z"
            stroke={NOTICE_BORDER}
            strokeWidth={1.8}
            strokeLinejoin="round"
        />
        <Path d="M12 9v5" stroke={NOTICE_BORDER} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M12 17h.01" stroke={NOTICE_BORDER} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
);

export const ReasonIcon = () => (
    <Svg width={moderateScale(18)} height={moderateScale(18)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 6h16M4 12h10M4 18h14"
            stroke={Colors.gray500}
            strokeWidth={1.6}
            strokeLinecap="round"
        />
    </Svg>
);

export const TimestampClockIcon = () => (
    <Svg width={moderateScale(16)} height={moderateScale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 8v5l3 2"
            stroke="#2F6FED"
            strokeWidth={1.8}
            strokeLinecap="round"
        />
        <Path
            d="M12 22a10 10 0 100-20 10 10 0 000 20z"
            stroke="#2F6FED"
            strokeWidth={1.6}
        />
    </Svg>
);
