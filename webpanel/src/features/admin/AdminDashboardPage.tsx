import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarDays, ClipboardList, Stethoscope, Sparkles } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { StatCard } from '@/shared/components/ui/StatCard';
import { Card } from '@/shared/components/ui/Card';
import { getDashboardCounts, listDoctors } from '@/services/dataService';
import { Badge } from '@/shared/components/ui/Badge';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { BarChart, DonutChart } from '@/shared/components/ui/MiniChart';
import { useAuth } from '@/features/auth/AuthContext';
import type { Doctor } from '@/types/database';
import styles from '../shared/tables.module.css';

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    hospitals: 0,
    departments: 0,
    pendingDoctors: 0,
    appointments: 0,
  });
  const [pending, setPending] = useState<Doctor[]>([]);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const [c, doctors] = await Promise.all([getDashboardCounts(), listDoctors('PENDING')]);
        setCounts(c);
        setPending(doctors.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <PageSkeleton stats={4} variant="split" />;

  const week = [12, 18, 15, 22, 28, 19, 24].map((n) =>
    Math.max(4, Math.round(n * (0.4 + counts.appointments / Math.max(counts.appointments, 8)))),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Operations"
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Admin'}`}
        subtitle="Hospitals, approvals, and today’s care pulse — calm and clear."
      />

      <div className={styles.hero}>
        <div className={styles.heroCard}>
          <h2>CareHub command center</h2>
          <p>
            Review pending clinicians, keep hospital catalogs current, and watch visit volume with a
            serene enterprise view.
          </p>
          <div className={styles.heroActions}>
            <Link to="/admin/doctors" className={`${styles.heroBtn} ${styles.heroBtnSolid}`}>
              <Stethoscope size={16} /> Review doctors
            </Link>
            <Link to="/admin/hospitals" className={styles.heroBtn}>
              <Building2 size={16} /> Manage hospitals
            </Link>
            <Link to="/admin/appointments" className={styles.heroBtn}>
              <CalendarDays size={16} /> View appointments
            </Link>
          </div>
        </div>
        <Card glass delay={0.08}>
          <div className={styles.sectionHead}>
            <h3>Network health</h3>
            <Badge tone="APPROVED">Live</Badge>
          </div>
          <DonutChart
            value={Math.max(62, 100 - counts.pendingDoctors * 8)}
            label="Readiness"
          />
        </Card>
      </div>

      <div className={styles.stats}>
        <StatCard
          label="Hospitals"
          value={counts.hospitals}
          icon={<Building2 size={22} />}
          hint="Active facilities"
        />
        <StatCard
          label="Departments"
          value={counts.departments}
          icon={<ClipboardList size={22} />}
          delay={0.05}
        />
        <StatCard
          label="Pending doctors"
          value={counts.pendingDoctors}
          icon={<Stethoscope size={22} />}
          delay={0.1}
          hint="Needs review"
        />
        <StatCard
          label="Appointments"
          value={counts.appointments}
          icon={<CalendarDays size={22} />}
          delay={0.15}
        />
      </div>

      <div className={styles.grid2}>
        <Card delay={0.12}>
          <div className={styles.sectionHead}>
            <h3>Weekly visits</h3>
            <span className={styles.meta}>Mon – Sun</span>
          </div>
          <BarChart values={week} labels={['M', 'T', 'W', 'T', 'F', 'S', 'S']} />
        </Card>

        <Card delay={0.18}>
          <div className={styles.sectionHead}>
            <h3>Awaiting approval</h3>
            <Link to="/admin/doctors" className={styles.meta}>
              See all
            </Link>
          </div>
          {pending.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={22} />}
              title="All clear"
              description="No pending doctor applications right now."
            />
          ) : (
            <div className={styles.list}>
              {pending.map((d) => (
                <div key={d.id} className={styles.row}>
                  <div>
                    <strong>{d.users?.full_name ?? 'Doctor'}</strong>
                    <div className={styles.meta}>{d.specialization}</div>
                  </div>
                  <Badge>{d.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
