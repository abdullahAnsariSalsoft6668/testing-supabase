import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { StatCard } from '@/shared/components/ui/StatCard';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useAuth } from '@/features/auth/AuthContext';
import { listAppointmentsForDoctor } from '@/services/dataService';
import type { Appointment } from '@/types/database';
import styles from '../shared/tables.module.css';

export function DoctorHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (!user?.doctor_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        setRows(await listAppointmentsForDoctor(user.doctor_id));
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.doctor_id]);

  if (loading) return <PageSkeleton stats={2} variant="list" />;

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = rows.filter((a) => a.appointment_date === today).length;
  const pending = rows.filter((a) => a.status === 'PENDING').length;

  return (
    <div>
      <PageHeader
        eyebrow="Clinician"
        title={`Good day, Dr. ${user?.full_name?.split(' ').slice(-1)[0] || ''}`}
        subtitle="Today’s board — patients, timing, and calm focus."
      />

      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <h2>Your care day, at a glance</h2>
          <p>Confirm waiting visits, open your schedule, and keep notes close without the clutter.</p>
          <div className={styles.heroActions}>
            <Link to="/doctor/visits" className={`${styles.heroBtn} ${styles.heroBtnSolid}`}>
              <Clock3 size={16} /> Manage visits
            </Link>
            <Link to="/doctor/schedule" className={styles.heroBtn}>
              <CalendarDays size={16} /> Edit schedule
            </Link>
          </div>
        </div>
        <Card glass>
          <h3 className={styles.sectionTitle}>Focus tip</h3>
          <p className={styles.meta} style={{ margin: 0, lineHeight: 1.55 }}>
            Patients waiting confirmation appear first in Visits. Keep at least two open slots for
            tomorrow.
          </p>
        </Card>
      </div>

      <div className={styles.stats}>
        <StatCard label="Today's visits" value={todayCount} icon={<CalendarDays size={22} />} />
        <StatCard label="Pending" value={pending} icon={<Clock3 size={22} />} delay={0.08} />
      </div>

      <Card delay={0.12}>
        <h3 className={styles.sectionTitle}>Recent visits</h3>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={22} />}
            title="No visits yet"
            description="When patients book your slots, they’ll appear here."
            actionLabel="Open schedule"
            onAction={() => navigate('/doctor/schedule')}
          />
        ) : (
          <div className={styles.list}>
            {rows.slice(0, 6).map((a) => (
              <div key={a.id} className={styles.row}>
                <div>
                  <strong>{a.patients?.users?.full_name ?? 'Patient'}</strong>
                  <div className={styles.meta}>
                    {a.appointment_date} · {String(a.appointment_time).slice(0, 5)}
                  </div>
                </div>
                <Badge>{a.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
