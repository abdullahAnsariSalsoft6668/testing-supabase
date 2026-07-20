export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
export type DoctorStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  full_name: string;
  name?: string;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  blood_group: string | null;
  gender: string | null;
  dob: string | null;
  address: string | null;
  created_at: string;
}

export interface Hospital {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  description: string | null;
  hospitals?: Hospital;
}

export interface Doctor {
  id: string;
  user_id: string;
  hospital_id: string | null;
  department_id: string | null;
  specialization: string;
  qualification: string | null;
  experience: number;
  consultation_fee: number | null;
  bio: string | null;
  status: DoctorStatus;
  users?: User;
  hospitals?: Hospital;
  departments?: Department;
}

export interface DoctorSlot {
  id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: SlotStatus;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  doctors?: Doctor;
  patients?: Patient & { users?: User };
}

export interface FullUserProfile extends User {
  patient_id?: string;
  patient?: Patient | null;
  doctor_id?: string;
  doctor?: Doctor | null;
  profileComplete: boolean;
}
