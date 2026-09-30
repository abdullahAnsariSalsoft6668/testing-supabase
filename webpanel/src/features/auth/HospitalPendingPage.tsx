import { Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { hospitalPortalReady, homePath, isHospitalAdmin } from '@/features/auth/roleHome';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';

export function HospitalPendingPage() {
  const { user, loading, refresh, signOut } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isHospitalAdmin(user.role)) return <Navigate to={homePath(user)} replace />;
  if (hospitalPortalReady(user.hospital_status)) return <Navigate to="/admin" replace />;

  const status = user.hospital_status ?? 'PENDING';
  const rejected = status === 'REJECTED';
  const suspended = status === 'SUSPENDED';

  return (
    <div style={{ maxWidth: 560, margin: '4rem auto', padding: '0 1.25rem' }}>
      <PageHeader
        eyebrow="Hospital"
        title={rejected ? 'Application declined' : suspended ? 'Clinic suspended' : 'Awaiting approval'}
        subtitle={user.hospital?.name ?? 'Your hospital application'}
      />
      <Card>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Building2 size={22} />
          <div>
            <Badge tone={status}>{status}</Badge>
            <p style={{ marginTop: 12, lineHeight: 1.5 }}>
              {rejected
                ? 'CareHub did not approve this hospital. Contact support if you think this is a mistake.'
                : suspended
                  ? 'This clinic is suspended. Patients cannot book until CareHub restores it.'
                  : 'CareHub is reviewing your hospital. You can add doctors after approval.'}
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
