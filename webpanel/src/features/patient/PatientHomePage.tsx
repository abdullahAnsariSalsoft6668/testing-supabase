import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Sparkles, Stethoscope } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { StatCard } from '@/shared/components/ui/StatCard';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useAuth } from '@/features/auth/AuthContext';
import { listAppointmentsForPatient } from '@/services/dataService';
import type { Appointment } from '@/types/database';
import styles from '../shared/tables.module.css';

export function PatientHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (!user?.patient_id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        setRows(await listAppointmentsForPatient(user.patient_id));
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.patient_id]);

  if (loading) return <PageSkeleton stats={2} variant="list" />;

  const upcoming = rows.filter(
    (a) => a.status === 'PENDING' || a.status === 'CONFIRMED',
  );

  return (
    <div>
      <PageHeader
        eyebrow="Your care"
        title={`Hello, ${user?.full_name?.split(' ')[0] || 'there'}`}
        subtitle="Upcoming visits and gentle reminders — care that stays close."
      />

      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <h2>Book your next calm visit</h2>
          <p>Find approved clinicians, pick an open slot, and confirm in a few soft steps.</p>
          <div className={styles.heroActions}>
            <Link to="/patient/doctors" className={`${styles.heroBtn} ${styles.heroBtnSolid}`}>
              <Stethoscope size={16} /> Find care
            </Link>
            <Link to="/patient/visits" className={styles.heroBtn}>
              <CalendarDays size={16} /> My visits
            </Link>
          </div>
        </div>
        <Card glass>
          <h3 className={styles.sectionTitle}>Health reminder</h3>
          <p className={styles.meta} style={{ margin: 0, lineHeight: 1.55 }}>
            Arrive 10 minutes early. Bring prior reports if this is a follow-up visit.
          </p>
        </Card>
      </div>

      <div className={styles.stats}>
        <StatCard label="Upcoming" value={upcoming.length} icon={<CalendarDays size={22} />} />
        <StatCard
          label="All visits"
          value={rows.length}
          icon={<Stethoscope size={22} />}
          delay={0.08}
        />
      </div>

      <Card delay={0.12}>
        <h3 className={styles.sectionTitle}>Next visits</h3>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<Sparkles size={22} />}
            title="No upcoming visits"
            description="Browse approved doctors to book your next appointment."
            actionLabel="Find care"
            onAction={() => navigate('/patient/doctors')}
          />
        ) : (
          <div className={styles.list}>
            {upcoming.slice(0, 5).map((a) => (
              <div key={a.id} className={styles.row}>
                <div>
                  <strong>{a.doctors?.users?.full_name ?? 'Doctor'}</strong>
                  <div className={styles.meta}>
                    {a.appointment_date} · {String(a.appointment_time).slice(0, 5)} ·{' '}
                    {a.doctors?.specialization}
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
