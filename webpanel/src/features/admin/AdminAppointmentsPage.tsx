import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { listAllAppointments } from '@/services/dataService';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import type { Appointment } from '@/types/database';
import styles from '../shared/tables.module.css';

function displayName(user?: { full_name?: string; name?: string } | null) {
  return user?.full_name || user?.name || '—';
}

export function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setRows(await listAllAppointments());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageSkeleton stats={0} variant="table" />;

  return (
    <div>
      <PageHeader
        eyebrow="Visits"
        title="Appointments"
        subtitle="System-wide visit activity across every hospital."
      />
      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyCell}>
                    No appointments yet.
                  </td>
                </tr>
              ) : (
                rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.appointment_date} · {String(a.appointment_time).slice(0, 5)}
                    </td>
                    <td>{displayName(a.patients?.users)}</td>
                    <td>{displayName(a.doctors?.users)}</td>
                    <td>
                      <Badge>{a.status}</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
