import type { AuthUser } from '@/models/auth.types';
import type { Doctor, Patient, UserRole, DoctorStatus } from '@/types/database';

export type { AuthUser };

export interface AuthUserProfile extends AuthUser {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    profile_image?: string;
    patient_id?: string;
    doctor_id?: string;
    doctor_status?: DoctorStatus;
    profileComplete?: boolean;
    patient?: Patient | null;
    doctor?: Doctor | null;
}

export type SelectedChildUser = Record<string, unknown> & {
    _id?: string;
    id?: string;
    name?: string;
};
