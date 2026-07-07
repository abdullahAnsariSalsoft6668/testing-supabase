import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { moderateScale, verticalScale } from '@/styles/scaling';

type WindowSize = {
    width: number;
    height: number;
};

export function useOnboardingLayout({ width, height }: WindowSize) {
    const insets = useSafeAreaInsets();

    return useMemo(() => {
        const isCompact = height < 700;
        const isWide = width >= 400;

        const horizontalPadding = moderateScale(isWide ? 26 : 24);
        const heroHeight = height * (isCompact ? 0.5 : 0.54);
        const cardOverlap = moderateScale(20);
        const panelBottomPadding = insets.bottom + moderateScale(16);
        const panelTopPadding = verticalScale(isCompact ? 20 : 24);
        const contentPaddingBottom = verticalScale(isCompact ? 12 : 16);

        const titleSize = moderateScale(isCompact ? 24 : 26);
        const titleLineHeight = moderateScale(isCompact ? 30 : 34);
        const descriptionSize = moderateScale(14);
        const descriptionLineHeight = moderateScale(22);

        const ctaHeight = moderateScale(52);
        const ctaIconWidth = moderateScale(52);

        return {
            isCompact,
            horizontalPadding,
            heroHeight,
            cardOverlap,
            panelBottomPadding,
            panelTopPadding,
            contentPaddingBottom,
            titleSize,
            titleLineHeight,
            descriptionSize,
            descriptionLineHeight,
            ctaHeight,
            ctaIconWidth,
        };
    }, [height, insets.bottom, width]);
}
