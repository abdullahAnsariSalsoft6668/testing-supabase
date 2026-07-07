import { theme } from '@/styles/theme';

/** Shared primary CTA props for all auth screens — yellow pill with arrow. */
export const AUTH_PRIMARY_BUTTON = {
    variant: 'primary' as const,
    size: 'l' as const,
    rightIcon: true as const,
};

export const AUTH_HEADER_GRADIENT = [...theme.gradients.header] as const;
