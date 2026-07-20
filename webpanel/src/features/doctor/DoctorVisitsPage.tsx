import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { listAppointmentsForDoctor, updateAppointmentStatus } from '@/services/dataService';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import type { Appointment, AppointmentStatus } from '@/types/database';
import styles from '../shared/tables.module.css';

export function DoctorVisitsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!user?.doctor_id) return;
    setRows(await listAppointmentsForDoctor(user.doctor_id));
  }

  useEffect(() => {
    void (async () => {
      if (!user?.doctor_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        await reload();
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.doctor_id]);

  async function setStatus(id: string, status: AppointmentStatus) {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, status);
      await reload();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <PageSkeleton stats={0} variant="list" />;

  return (
    <div>
      <PageHeader title="Visits" subtitle="Confirm, complete, or cancel appointments." />
      <Card>
        {rows.length === 0 ? (
          <p className={styles.empty}>No visits found.</p>
        ) : (
          <div className={styles.list}>
            {rows.map((a) => (
              <div key={a.id} className={styles.row}>
                <div>
                  <strong>{a.patients?.users?.full_name ?? 'Patient'}</strong>
                  <div className={styles.meta}>
                    {a.appointment_date} · {String(a.appointment_time).slice(0, 5)}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Badge>{a.status}</Badge>
                  {a.status === 'PENDING' ? (
                    <Button
                      variant="soft"
                      type="button"
                      loading={busyId === a.id}
                      onClick={() => setStatus(a.id, 'CONFIRMED')}
                    >
                      Confirm
                    </Button>
                  ) : null}
                  {a.status === 'CONFIRMED' ? (
                    <Button
                      variant="primary"
                      type="button"
                      loading={busyId === a.id}
                      onClick={() => setStatus(a.id, 'COMPLETED')}
                    >
                      Complete
                    </Button>
                  ) : null}
                  {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' ? (
                    <Button
                      variant="danger"
                      type="button"
                      loading={busyId === a.id}
                      onClick={() => setStatus(a.id, 'CANCELLED')}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
