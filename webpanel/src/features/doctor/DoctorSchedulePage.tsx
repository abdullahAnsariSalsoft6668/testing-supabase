import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Field, Input } from '@/shared/components/ui/Field';
import { createSlot, deleteSlot, listSlots } from '@/services/dataService';
import { ListSkeleton } from '@/shared/components/ui/Shimmer';
import type { DoctorSlot } from '@/types/database';
import styles from '../shared/tables.module.css';

export function DoctorSchedulePage() {
  const { user } = useAuth();
  const doctorId = user?.doctor_id;
  const [rows, setRows] = useState<DoctorSlot[]>([]);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('09:30');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    if (!doctorId) return;
    setRows(await listSlots(doctorId));
  }

  useEffect(() => {
    void (async () => {
      if (!doctorId) {
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
  }, [doctorId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!doctorId) return;
    setBusy(true);
    setError('');
    try {
      await createSlot({
        doctor_id: doctorId,
        appointment_date: date,
        start_time: start.length === 5 ? `${start}:00` : start,
        end_time: end.length === 5 ? `${end}:00` : end,
      });
      setDate('');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create slot');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="Schedule" subtitle="Publish available appointment slots." />
      <Card>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          <Field label="Date">
            <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Start">
            <Input type="time" required value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="End">
            <Input type="time" required value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
          {error ? <div style={{ color: 'var(--error)' }}>{error}</div> : null}
          <Button type="submit" loading={busy}>
            Add slot
          </Button>
        </form>
      </Card>

      <div className={styles.stackGap}>
        <Card delay={0.08}>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : rows.length === 0 ? (
            <p className={styles.empty}>No slots yet.</p>
          ) : (
            <div className={styles.list}>
              {rows.map((s) => (
                <div key={s.id} className={styles.row}>
                  <div>
                    <strong>
                      {s.appointment_date} · {String(s.start_time).slice(0, 5)}–
                      {String(s.end_time).slice(0, 5)}
                    </strong>
                  </div>
                  <div className={styles.actions}>
                    <Badge>{s.status}</Badge>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={async () => {
                        await deleteSlot(s.id);
                        await reload();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
