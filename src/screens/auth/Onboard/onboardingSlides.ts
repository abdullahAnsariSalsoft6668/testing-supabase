import { ImageSourcePropType } from 'react-native';

import { localImages } from '@/assets/images';

export type OnboardingSlide = {
    id: string;
    image: ImageSourcePropType;
    title: string;
    description: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        image: localImages.onboarding1,
        title: 'Save Up To 3x More',
        description: 'Find the best discounts across multiple supermarkets in one place.',
    },
    {
        id: '2',
        image: localImages.onboarding2,
        title: 'Discounts Stack Automatically',
        description: 'We find and combine every eligible deal so you never miss savings.',
    },
    {
        id: '3',
        image: localImages.onboarding3,
        title: 'Checkout In Seconds',
        description: 'Show your barcode at checkout and watch the savings apply instantly.',
    },
];
