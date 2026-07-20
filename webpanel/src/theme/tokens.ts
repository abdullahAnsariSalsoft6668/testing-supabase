/** CareHub premium design tokens — healthcare SaaS. */
export const palette = {
  primary: '#0F766E',
  secondary: '#14B8A6',
  accent: '#38BDF8',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8FAFC',
  card: '#FFFFFF',
  sidebar: '#0B7285',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  /** Legacy aliases used across the app */
  teal: {
    main: '#0F766E',
    dark: '#0B7285',
    light: '#14B8A6',
    surface: '#F0FDFA',
  },
  green: {
    main: '#22C55E',
    dark: '#16A34A',
    light: '#4ADE80',
    surface: '#F0FDF4',
  },
  sky: {
    main: '#E0F2FE',
    border: '#BAE6FD',
    accent: '#38BDF8',
  },
  neutral: {
    white: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    screen: '#F8FAFC',
    card: '#FFFFFF',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
  },
  status: {
    pending: '#F59E0B',
    confirmed: '#22C55E',
    completed: '#38BDF8',
    cancelled: '#EF4444',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#38BDF8',
  },
} as const;

export const theme = {
  palette,
  brand: palette.primary,
  brandDark: palette.sidebar,
  brandLight: palette.secondary,
  brandSurface: palette.teal.surface,
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 40, 8: 48 },
  radius: { sm: 8, md: 12, lg: 16, xl: 18, '2xl': 24, pill: 999 },
  shadow: {
    card: '0 4px 24px rgba(15, 23, 42, 0.06)',
    soft: '0 12px 40px rgba(15, 118, 110, 0.1)',
    float: '0 20px 50px rgba(15, 23, 42, 0.08)',
    glow: '0 0 0 4px rgba(15, 118, 110, 0.14)',
  },
} as const;
