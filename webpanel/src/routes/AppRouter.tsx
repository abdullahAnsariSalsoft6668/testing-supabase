import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AppShell } from '@/shared/components/layout/AppShell';
import { AdminDashboardPage } from '@/features/admin/AdminDashboardPage';
import { AdminHospitalsPage } from '@/features/admin/AdminHospitalsPage';
import { AdminDepartmentsPage } from '@/features/admin/AdminDepartmentsPage';
import { AdminDoctorsPage } from '@/features/admin/AdminDoctorsPage';
import { AdminAppointmentsPage } from '@/features/admin/AdminAppointmentsPage';
import { DoctorHomePage } from '@/features/doctor/DoctorHomePage';
import { DoctorSchedulePage } from '@/features/doctor/DoctorSchedulePage';
import { DoctorVisitsPage } from '@/features/doctor/DoctorVisitsPage';
import { PatientHomePage } from '@/features/patient/PatientHomePage';
import { PatientDoctorsPage } from '@/features/patient/PatientDoctorsPage';
import { PatientVisitsPage } from '@/features/patient/PatientVisitsPage';
import { NotFoundPage } from '@/features/shared/ErrorPages';

function RoleHomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  return <Navigate to="/patient" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<RoleHomeRedirect />} />

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/hospitals" element={<AdminHospitalsPage />} />
            <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
            <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['DOCTOR']} />}>
            <Route path="/doctor" element={<DoctorHomePage />} />
            <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
            <Route path="/doctor/visits" element={<DoctorVisitsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['PATIENT']} />}>
            <Route path="/patient" element={<PatientHomePage />} />
            <Route path="/patient/doctors" element={<PatientDoctorsPage />} />
            <Route path="/patient/visits" element={<PatientVisitsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
