import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { cancelAppointment, listAppointmentsForPatient } from '@/services/dataService';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import type { Appointment } from '@/types/database';
import styles from '../shared/tables.module.css';

export function PatientVisitsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!user?.patient_id) return;
    setRows(await listAppointmentsForPatient(user.patient_id));
  }

  useEffect(() => {
    void (async () => {
      if (!user?.patient_id) {
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
  }, [user?.patient_id]);

  if (loading) return <PageSkeleton stats={0} variant="list" />;

  return (
    <div>
      <PageHeader title="My visits" subtitle="Track and cancel upcoming appointments." />
      <Card>
        {rows.length === 0 ? (
          <p className={styles.empty}>No visits yet.</p>
        ) : (
          <div className={styles.list}>
            {rows.map((a) => (
              <div key={a.id} className={styles.row}>
                <div>
                  <strong>{a.doctors?.users?.full_name ?? 'Doctor'}</strong>
                  <div className={styles.meta}>
                    {a.appointment_date} · {String(a.appointment_time).slice(0, 5)} ·{' '}
                    {a.doctors?.specialization}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Badge>{a.status}</Badge>
                  {a.status === 'PENDING' || a.status === 'CONFIRMED' ? (
                    <Button
                      variant="danger"
                      type="button"
                      loading={busyId === a.id}
                      onClick={async () => {
                        setBusyId(a.id);
                        try {
                          await cancelAppointment(a.id);
                          await reload();
                        } finally {
                          setBusyId(null);
                        }
                      }}
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
