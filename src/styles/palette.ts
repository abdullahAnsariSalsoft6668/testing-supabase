/**
 * Clinic light design tokens.
 * Naming traps (aliases — not literal colors):
 * - olive.* = white / blue-gray clinic surfaces
 * - lime.* = brand blue (#1E75E5)
 * - cream = charcoal body text on white (#1A1D26)
 * - ink = white text/icons on blue CTAs
 */
export const palette = {
    lime: {
        main: '#1E75E5',
        dark: '#155CB8',
        highlight: '#E8F1FC',
        surface: 'rgba(30, 117, 229, 0.12)',
        badge: '#1E75E5',
    },
    olive: {
        dark: '#FFFFFF',
        main: '#EAF0F8',
        deeper: '#F4F7FB',
        surface: '#F4F7FB',
        card: '#FFFFFF',
        muted: '#9AA3AF',
        light: '#7EB0F0',
        gridOverlay: 'rgba(30, 117, 229, 0.06)',
    },
    cream: '#1A1D26',
    ink: '#FFFFFF',
    onCard: {
        text: '#1A1D26',
        textSecondary: '#6B7280',
        textMuted: '#8A9199',
        icon: '#5B6470',
        border: 'rgba(15, 23, 42, 0.08)',
    },
    medical: {
        success: '#2FA36B',
        successDark: '#1E7A4E',
        error: '#E85D4C',
        warning: '#F5B942',
        emergency: '#D64545',
        info: '#1E75E5',
        stat: '#C45C4A',
    },
    home: {
        greeting: '#7A8490',
    },
    /** @deprecated Use lime — teal alias for gradual migration */
    teal: {
        main: '#1E75E5',
        dark: '#155CB8',
        light: '#7EB0F0',
        surface: 'rgba(30, 117, 229, 0.12)',
        gridOverlay: 'rgba(30, 117, 229, 0.06)',
    },
    /** @deprecated Use medical.success */
    green: {
        main: '#2FA36B',
        dark: '#1E7A4E',
        light: '#2FA36B',
        surface: 'rgba(47, 163, 107, 0.12)',
    },
    /** @deprecated Use olive / lime.highlight */
    sky: {
        main: '#E8F1FC',
        border: 'rgba(15, 23, 42, 0.08)',
        accent: '#1E75E5',
    },
    neutral: {
        white: '#FFFFFF',
        black: '#000000',
        text: '#1A1D26',
        textSecondary: '#6B7280',
        textMuted: '#8A9199',
        border: 'rgba(15, 23, 42, 0.08)',
        background: '#FFFFFF',
        screen: '#FFFFFF',
        card: '#FFFFFF',
        gray50: '#F4F7FB',
        gray100: '#EAF0F8',
        gray200: '#EAF0F8',
        gray300: '#9AA3AF',
        gray400: '#6B7280',
        gray500: '#5B6470',
        cream: '#1A1D26',
    },
    status: {
        pending: '#F5B942',
        confirmed: '#2FA36B',
        completed: '#1E75E5',
        cancelled: '#E85D4C',
        noShow: '#9AA3AF',
        error: '#E85D4C',
        warning: '#F5B942',
        info: '#1E75E5',
    },
    /** @deprecated Use lime — legacy grocery alias */
    purple: {
        main: '#1E75E5',
        dark: '#155CB8',
        light: '#7EB0F0',
        surface: 'rgba(30, 117, 229, 0.12)',
        gridOverlay: 'rgba(30, 117, 229, 0.06)',
    },
    /** @deprecated Use lime */
    yellow: {
        main: '#1E75E5',
        dark: '#155CB8',
        highlight: '#E8F1FC',
        badge: '#1E75E5',
    },
    magenta: {
        main: '#1E75E5',
        stat: '#C45C4A',
    },
} as const;

export type Palette = typeof palette;
