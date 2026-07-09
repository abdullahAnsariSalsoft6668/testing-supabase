import { palette } from '@/styles/palette';

export type OnboardingRole = 'patient' | 'doctor' | 'admin';

export type RoleColorScheme = {
    label: string;
    heroIcon: 'healthTabSearch' | 'healthTabDoctors' | 'healthTabHospital';
    accent: string;
    accentLight: string;
    illustrationBg: string;
    illustrationBgEnd: string;
    ring: string;
    chipBg: string;
    chipText: string;
};

export const ROLE_COLORS: Record<OnboardingRole, RoleColorScheme> = {
    patient: {
        label: 'For Patients',
        heroIcon: 'healthTabSearch',
        accent: palette.teal.main,
        accentLight: palette.teal.light,
        illustrationBg: '#E3FAF6',
        illustrationBgEnd: palette.teal.surface,
        ring: palette.teal.main + '22',
        chipBg: palette.neutral.white,
        chipText: palette.teal.dark,
    },
    doctor: {
        label: 'For Doctors',
        heroIcon: 'healthTabDoctors',
        accent: palette.teal.dark,
        accentLight: palette.teal.main,
        illustrationBg: '#D6F0F7',
        illustrationBgEnd: palette.sky.main,
        ring: palette.teal.dark + '20',
        chipBg: palette.neutral.white,
        chipText: palette.teal.dark,
    },
    admin: {
        label: 'For Admins',
        heroIcon: 'healthTabHospital',
        accent: palette.sky.accent,
        accentLight: palette.sky.border,
        illustrationBg: palette.sky.main,
        illustrationBgEnd: '#F0F9FF',
        ring: palette.sky.accent + '18',
        chipBg: palette.neutral.white,
        chipText: palette.sky.accent,
    },
};
