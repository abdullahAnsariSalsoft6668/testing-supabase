import type { ProfileData, ProfileInfoItem } from './types';

export function buildProfileInfoItems(profile: ProfileData): ProfileInfoItem[] {
    return [
        {
            id: 'email',
            label: 'Email Address',
            value: profile.email,
            icon: 'messageBlue',
        },
        {
            id: 'phone',
            label: 'Phone Number',
            value: profile.phone,
            icon: 'callBlue',
        },
        {
            id: 'license',
            label: "Driver's License",
            value: profile.license,
            icon: 'licenseBlue',
        },
        {
            id: 'address',
            label: 'Address',
            value: profile.address,
            icon: 'locationBlue',
        },
        {
            id: 'joinDate',
            label: 'Join Date',
            value: profile.joinDate,
            icon: 'calendarBlue',
        },
    ];
}
