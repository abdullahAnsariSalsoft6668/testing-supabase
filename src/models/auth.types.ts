import type { Doctor, Hospital, HospitalStatus, Patient, UserRole, DoctorStatus } from '@/types/database';

export interface AuthUser {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
}

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
    hospital_id?: string | null;
    hospital_status?: HospitalStatus | null;
    hospital?: Hospital | null;
    profileComplete?: boolean;
    patient?: Patient | null;
    doctor?: Doctor | null;
}
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    profile_image?: string;
    patient_id?: string;
    doctor_id?: string;
    doctor_status?: DoctorStatus;
    hospital_id?: string | null;
    hospital_status?: HospitalStatus | null;
    hospital?: Hospital | null;
    profileComplete?: boolean;
    patient?: Patient | null;
    doctor?: Doctor | null;
}

export type SelectedChildUser = Record<string, unknown> & {
    _id?: string;
    id?: string;
    name?: string;
};
