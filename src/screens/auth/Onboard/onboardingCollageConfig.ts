import type { OnboardingImages } from '@/assets/onboarding';

export type OrbSize = 'lg' | 'md' | 'sm';

export type EntranceFrom = 'top' | 'bottom' | 'left' | 'right';

export type CollageOrbConfig = {
    id: string;
    /** Key into onboarding `localImages` */
    sourceKey: keyof OnboardingImages;
    size: OrbSize;
    /** Horizontal center of orb, 0–100 (% of collage width) */
    leftPct: number;
    /** Vertical center of orb, 0–100 (% of collage height) */
    topPct: number;
    zIndex: number;
    from: EntranceFrom;
    /** Order in stagger sequence (0 = first) */
    staggerIndex: number;
};

/**
 * Layout tuned for a phone portrait collage; orbs use center-based % positions.
 * Entrance directions vary (top / bottom / left / right) per plan.
 */
export const COLLAGE_ORB_CONFIG: CollageOrbConfig[] = [
    {
        id: 'hero-center',
        sourceKey: 'row2col3',
        size: 'sm',
        leftPct: 52,
        topPct: 44,
        zIndex: 12,
        from: 'top',
        staggerIndex: 0,
    },
    {
        id: 'hero-left',
        sourceKey: 'row3col1and2',
        size: 'sm',
        leftPct: 32,
        topPct: 60,
        zIndex: 11,
        from: 'left',
        staggerIndex: 1,
    },
    {
        id: 'top-left',
        sourceKey: 'row1col1',
        size: 'sm',
        leftPct: 8,
        topPct: 14,
        zIndex: 4,
        from: 'left',
        staggerIndex: 2,
    },
    {
        id: 'top-right',
        sourceKey: 'row1col4',
        size: 'md',
        leftPct: 96,
        topPct: 14,
        zIndex: 5,
        from: 'right',
        staggerIndex: 3,
    },
    {
        id: 'mid-right',
        sourceKey: 'row2col4',
        size: 'sm',
        leftPct: 82,
        topPct: 32,
        zIndex: 6,
        from: 'right',
        staggerIndex: 4,
    },
    {
        id: 'lower-right',
        sourceKey: 'row3col4',
        size: 'md',
        leftPct: 88,
        topPct: 52,
        zIndex: 7,
        from: 'bottom',
        staggerIndex: 5,
    },
    {
        id: 'bottom-left',
        sourceKey: 'row4col2',
        size: 'sm',
        leftPct: 40,
        topPct: 75,
        zIndex: 8,
        from: 'bottom',
        staggerIndex: 6,
    },
    {
        id: 'top-center-small',
        sourceKey: 'row1col2and3',
        size: 'lg',
        leftPct: 52,
        topPct: 18,
        zIndex: 3,
        from: 'top',
        staggerIndex: 7,
    },
    {
        id: 'mid-left-small',
        sourceKey: 'row2col1and2',
        size: 'lg',
        leftPct: 9,
        topPct: 40,
        zIndex: 2,
        from: 'left',
        staggerIndex: 8,
    },
    {
        id: 'center-fill',
        sourceKey: 'row3col3',
        size: 'sm',
        leftPct: 58,
        topPct: 60,
        zIndex: 1,
        from: 'bottom',
        staggerIndex: 9,
    },
    {
        id: 'bottom-mid',
        sourceKey: 'row4col3',
        size: 'md',
        leftPct: 69,
        topPct: 78,
        zIndex: 9,
        from: 'bottom',
        staggerIndex: 10,
    },
    {
        id: 'bottom-corner-l',
        sourceKey: 'row4col1',
        size: 'md',
        leftPct: 10,
        topPct: 75,
        zIndex: 2,
        from: 'bottom',
        staggerIndex: 11,
    },
    {
        id: 'bottom-corner-r',
        sourceKey: 'row4col4',
        size: 'sm',
        leftPct: 96,
        topPct: 70,
        zIndex: 10,
        from: 'right',
        staggerIndex: 12,
    },
];

export const STAGGER_STEP_MS = 58;
export const ORB_ANIMATION_DURATION_MS = 700;
