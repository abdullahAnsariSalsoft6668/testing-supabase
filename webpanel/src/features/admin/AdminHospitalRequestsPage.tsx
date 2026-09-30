import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { TableSkeleton } from '@/shared/components/ui/Shimmer';
import { useToast } from '@/shared/components/ui/Toast';
import { useAuth } from '@/features/auth/AuthContext';
import { isPlatformAdmin } from '@/features/auth/roleHome';
import { listHospitalsByStatus, setHospitalStatus } from '@/services/dataService';
import type { Hospital, HospitalStatus } from '@/types/database';
import styles from '../shared/tables.module.css';

export function AdminHospitalRequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function reload() {
    setRows(await listHospitalsByStatus('PENDING'));
  }

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        await reload();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isPlatformAdmin(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  async function setStatus(id: string, status: Extract<HospitalStatus, 'APPROVED' | 'REJECTED'>) {
    setBusyId(id);
    try {
      await setHospitalStatus(id, status);
      toast(status === 'APPROVED' ? 'Hospital approved' : 'Hospital rejected', 'success');
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Update failed', 'error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Hospital requests"
        subtitle="Approve clinics that applied to join CareHub."
      />
      <Card>
        {loading ? (
          <TableSkeleton cols={4} rows={4} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<Building2 size={22} />}
            title="No pending hospitals"
            description="New applications will show up here."
          />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <strong>{h.name}</strong>
                      <div className={styles.meta}>
                        <Badge tone="PENDING">PENDING</Badge>
                      </div>
                    </td>
                    <td>
                      <div>{h.email}</div>
                      <div className={styles.meta}>{h.phone}</div>
                    </td>
                    <td>{h.address}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="soft"
                          type="button"
                          loading={busyId === h.id}
                          onClick={() => void setStatus(h.id, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          type="button"
                          disabled={busyId === h.id}
                          onClick={() => void setStatus(h.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
