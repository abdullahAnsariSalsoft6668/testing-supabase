import { Colors } from '@/styles/colors';

export type ShimmerPalette = 'childProfile' | 'onWhite';

/** Theme shimmer stops for `react-native-shimmer-placeholder` (`shimmerColors` prop). */
export function getShimmerColors(palette: ShimmerPalette = 'childProfile'): string[] {
    switch (palette) {
        case 'onWhite':
            return [...Colors.shimmerOnWhite];
        case 'childProfile':
        default:
            return [...Colors.shimmerChildProfile];
    }
}
