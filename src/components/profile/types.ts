import type { IconName } from '@/components/MyIcons';

export type ProfileInfoItem = {
    id: string;
    label: string;
    value: string;
    icon: IconName;
};

export type ProfileData = {
    fullName: string;
    driverId: string;
    totalRoutes: string;
    rating: string;
    email: string;
    phone: string;
    license: string;
    address: string;
    joinDate: string;
};
