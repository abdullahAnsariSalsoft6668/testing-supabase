import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import type { UserRole } from '@/types/database';
import { homePath } from '@/features/auth/roleHome';

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    const home = homePath(user);
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
