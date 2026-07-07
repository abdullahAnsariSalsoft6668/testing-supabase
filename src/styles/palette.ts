/** Professional health / hospital design tokens. */
export const palette = {
    teal: {
        main: '#0B7285',
        dark: '#095C6B',
        light: '#15AABF',
        surface: '#E6FCF5',
        gridOverlay: 'rgba(255, 255, 255, 0.06)',
    },
    green: {
        main: '#2F9E44',
        dark: '#2B8A3E',
        light: '#51CF66',
        surface: '#EBFBEE',
    },
    sky: {
        main: '#E7F5FF',
        border: '#A5D8FF',
        accent: '#1864AB',
    },
    neutral: {
        white: '#FFFFFF',
        black: '#000000',
        text: '#1E293B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        border: '#E2E8F0',
        background: '#FFFFFF',
        screen: '#F8FAFC',
        card: '#FFFFFF',
        gray50: '#F8FAFC',
        gray100: '#F1F5F9',
        gray200: '#E2E8F0',
        gray300: '#CBD5E1',
        gray400: '#64748B',
        gray500: '#475569',
        cream: '#E7F5FF',
    },
    status: {
        pending: '#E67700',
        confirmed: '#2F9E44',
        completed: '#1864AB',
        cancelled: '#C92A2A',
        noShow: '#868E96',
        error: '#C92A2A',
        warning: '#E67700',
        info: '#1864AB',
    },
    /** Legacy aliases for unused grocery components */
    purple: {
        main: '#0B7285',
        dark: '#095C6B',
        light: '#15AABF',
        surface: '#E6FCF5',
        gridOverlay: 'rgba(255, 255, 255, 0.06)',
    },
    yellow: {
        main: '#0B7285',
        dark: '#095C6B',
        highlight: '#15AABF',
        badge: '#E6FCF5',
    },
    magenta: {
        main: '#1864AB',
        stat: '#1864AB',
    },
} as const;

export type Palette = typeof palette;
