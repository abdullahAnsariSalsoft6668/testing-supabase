import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { HospitalApplyPage } from '@/features/auth/HospitalApplyPage';
import { HospitalPendingPage } from '@/features/auth/HospitalPendingPage';
import { DoctorApplyPage } from '@/features/auth/DoctorApplyPage';
import { DoctorPendingPage } from '@/features/auth/DoctorPendingPage';
import { homePath, hospitalPortalReady, isHospitalAdmin, doctorPortalReady } from '@/features/auth/roleHome';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AppShell } from '@/shared/components/layout/AppShell';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminHospitalsPage } from '@/features/admin/AdminHospitalsPage';
import { AdminDepartmentsPage } from '@/features/admin/AdminDepartmentsPage';
import { AdminDoctorsPage } from '@/features/admin/AdminDoctorsPage';
import { AdminAppointmentsPage } from '@/features/admin/AdminAppointmentsPage';
import { AdminHospitalRequestsPage } from '@/features/admin/AdminHospitalRequestsPage';
import { AdminPatientsPage } from '@/features/admin/AdminPatientsPage';
import { DoctorHomePage } from '@/features/doctor/DoctorHomePage';
import { DoctorSchedulePage } from '@/features/doctor/DoctorSchedulePage';
import { DoctorVisitsPage } from '@/features/doctor/DoctorVisitsPage';
import { PatientHomePage } from '@/features/patient/PatientHomePage';
import { PatientDoctorsPage } from '@/features/patient/PatientDoctorsPage';
import { PatientHospitalPage } from '@/features/patient/PatientHospitalPage';
import { PatientVisitsPage } from '@/features/patient/PatientVisitsPage';
import { PatientProfilePage } from '@/features/patient/PatientProfilePage';
import { NotFoundPage } from '@/features/shared/ErrorPages';

function RoleHomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={homePath(user)} replace />;
}

function DoctorGate() {
  const { user } = useAuth();
  if (user?.role === 'DOCTOR' && !doctorPortalReady(user)) {
    return <Navigate to={homePath(user)} replace />;
  }
  return <Outlet />;
}

function PatientGate() {
  const { user } = useAuth();
  if (user?.role === 'PATIENT' && !user.patient?.hospital_id) {
    return <Navigate to="/patient/hospital" replace />;
  }
  return <Outlet />;
}

function HospitalAdminGate() {
  const { user } = useAuth();
  if (isHospitalAdmin(user?.role) && !hospitalPortalReady(user?.hospital_status)) {
    return <Navigate to="/hospital/pending" replace />;
  }
  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/hospital" element={<HospitalApplyPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/hospital/pending" element={<HospitalPendingPage />} />
        <Route path="/doctor/apply" element={<DoctorApplyPage />} />
        <Route path="/doctor/pending" element={<DoctorPendingPage />} />
        <Route path="/patient/hospital" element={<PatientHospitalPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<RoleHomeRedirect />} />

          <Route element={<ProtectedRoute roles={['ADMIN', 'HOSPITAL_ADMIN']} />}>
            <Route element={<HospitalAdminGate />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/hospitals" element={<AdminHospitalsPage />} />
              <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
              <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
              <Route path="/admin/patients" element={<AdminPatientsPage />} />
              <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
              <Route path="/admin/hospital-requests" element={<AdminHospitalRequestsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['DOCTOR']} />}>
            <Route element={<DoctorGate />}>
              <Route path="/doctor" element={<DoctorHomePage />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/visits" element={<DoctorVisitsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['PATIENT']} />}>
            <Route element={<PatientGate />}>
              <Route path="/patient" element={<PatientHomePage />} />
              <Route path="/patient/doctors" element={<PatientDoctorsPage />} />
              <Route path="/patient/visits" element={<PatientVisitsPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
