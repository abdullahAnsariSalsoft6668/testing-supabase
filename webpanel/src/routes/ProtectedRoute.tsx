import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import type { UserRole } from '@/types/database';

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const home =
      user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
