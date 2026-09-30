import { Navigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { doctorPortalReady, homePath } from '@/features/auth/roleHome';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';

export function DoctorPendingPage() {
  const { user, loading, refresh, signOut } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'DOCTOR') return <Navigate to={homePath(user)} replace />;
  if (!user.doctor_id && !user.doctor) return <Navigate to="/doctor/apply" replace />;
  if (doctorPortalReady(user)) return <Navigate to="/doctor" replace />;

  const status = user.doctor?.status ?? 'PENDING';
  const rejected = status === 'REJECTED';
  const suspended = status === 'SUSPENDED';
  const hospitalName = user.doctor?.hospitals?.name ?? 'the hospital you selected';

  return (
    <div style={{ maxWidth: 560, margin: '4rem auto', padding: '0 1.25rem' }}>
      <PageHeader
        eyebrow="Doctor"
        title={rejected ? 'Application declined' : suspended ? 'Account suspended' : 'Awaiting hospital approval'}
        subtitle={user.full_name}
      />
      <Card>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Stethoscope size={22} />
          <div>
            <Badge tone={status}>{status}</Badge>
            <p style={{ marginTop: 12, lineHeight: 1.5 }}>
              {rejected
                ? `This hospital did not approve your request. You can contact the clinic if you think this is a mistake.`
                : suspended
                  ? 'Your doctor account is suspended. You cannot see patients until the hospital restores it.'
                  : `Your request was sent to ${hospitalName}. You can use the doctor portal after they approve you.`}
            </p>
            <p style={{ marginTop: 8, opacity: 0.75, fontSize: 14 }}>{user.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <Button type="button" variant="soft" onClick={() => void refresh()}>
            Check status
          </Button>
          <Button type="button" variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}
