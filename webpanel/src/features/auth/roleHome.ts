import type { FullUserProfile, HospitalStatus, UserRole } from '@/types/database';

export function isPlatformAdmin(role?: UserRole | null) {
  return role === 'ADMIN';
}

export function isHospitalAdmin(role?: UserRole | null) {
  return role === 'HOSPITAL_ADMIN';
}

export function hospitalPortalReady(status?: HospitalStatus | null) {
  return status === 'APPROVED';
}

export function doctorPortalReady(user: Pick<FullUserProfile, 'role' | 'doctor' | 'doctor_id'> | null) {
  return user?.role === 'DOCTOR' && user.doctor?.status === 'APPROVED';
}

export function homePath(
  user: Pick<FullUserProfile, 'role' | 'hospital_status' | 'doctor' | 'doctor_id' | 'patient'> | null,
) {
  if (!user) return '/login';
  if (user.role === 'HOSPITAL_ADMIN' && !hospitalPortalReady(user.hospital_status)) {
    return '/hospital/pending';
  }
  if (user.role === 'ADMIN' || user.role === 'HOSPITAL_ADMIN') return '/admin';
  if (user.role === 'DOCTOR') {
    if (!user.doctor_id && !user.doctor) return '/doctor/apply';
    if (user.doctor?.status !== 'APPROVED') return '/doctor/pending';
    return '/doctor';
  }
  if (!user.patient?.hospital_id) return '/patient/hospital';
  return '/patient';
}
