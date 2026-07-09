export type OnboardingSlide = {
    id: string;
    role: 'patient' | 'doctor' | 'admin';
    title: string;
    description: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
    {
        id: 'patient',
        role: 'patient',
        title: 'Book Appointments Easily',
        description:
            'Search hospitals, find specialists, and schedule your next visit in just a few taps.',
    },
    {
        id: 'doctor',
        role: 'doctor',
        title: 'Manage Your Practice',
        description:
            'Set availability, review appointments, and confirm patient visits from one dashboard.',
    },
    {
        id: 'admin',
        role: 'admin',
        title: 'Run Your Hospital',
        description:
            'Manage hospitals, departments, and doctor approvals with full admin control.',
    },
];
