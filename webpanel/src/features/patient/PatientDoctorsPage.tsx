import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Field, Select } from '@/shared/components/ui/Field';
import {
  bookAppointment,
  listApprovedDoctors,
  listSlots,
} from '@/services/dataService';
import { ListSkeleton, PageSkeleton, Spinner } from '@/shared/components/ui/Shimmer';
import type { Doctor, DoctorSlot } from '@/types/database';
import styles from '../shared/tables.module.css';

export function PatientDoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setDoctors(await listApprovedDoctors());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) {
      setSlots([]);
      return;
    }
    void (async () => {
      setSlotsLoading(true);
      try {
        const all = await listSlots(selected.id);
        setSlots(all.filter((s) => s.status === 'AVAILABLE'));
        setSlotId('');
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [selected]);

  const selectedSlot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  async function book() {
    if (!user?.patient_id || !selected || !selectedSlot) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await bookAppointment({
        patient_id: user.patient_id,
        doctor_id: selected.id,
        slot_id: selectedSlot.id,
        appointment_date: selectedSlot.appointment_date,
        appointment_time: selectedSlot.start_time,
        notes: 'Booked via Mediqo web',
      });
      setMessage('Appointment requested. Check My visits.');
      const all = await listSlots(selected.id);
      setSlots(all.filter((s) => s.status === 'AVAILABLE'));
      setSlotId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <PageSkeleton stats={0} variant="split" />;

  return (
    <div>
      <PageHeader title="Find care" subtitle="Choose an approved doctor and open slot." />
      <div className={styles.split}>
        <Card>
          <h3 className={styles.sectionTitle}>Doctors</h3>
          {doctors.length === 0 ? (
            <p className={styles.empty}>No approved doctors yet.</p>
          ) : (
            <div className={styles.list}>
              {doctors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={styles.row}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderColor: selected?.id === d.id ? 'var(--teal)' : undefined,
                    background: selected?.id === d.id ? 'var(--teal-surface)' : undefined,
                  }}
                  onClick={() => setSelected(d)}
                >
                  <div>
                    <strong>{d.users?.full_name ?? 'Doctor'}</strong>
                    <div className={styles.meta}>
                      {d.specialization}
                      {d.hospitals?.name ? ` · ${d.hospitals.name}` : ''}
                    </div>
                  </div>
                  <Badge tone="APPROVED">Approved</Badge>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card delay={0.08}>
          <h3 className={styles.sectionTitle}>
            {selected ? `Slots · ${selected.users?.full_name}` : 'Select a doctor'}
          </h3>
          {!user?.patient_id ? (
            <p className={styles.empty}>
              Complete your patient profile in the mobile app before booking on web.
            </p>
          ) : selected ? (
            <>
              {slotsLoading ? (
                <div className={styles.stackGap}>
                  <Spinner label="Loading slots…" />
                  <ListSkeleton rows={3} />
                </div>
              ) : (
                <Field label="Available slot">
                  <Select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
                    <option value="">Choose a time</option>
                    {slots.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.appointment_date} · {String(s.start_time).slice(0, 5)}–
                        {String(s.end_time).slice(0, 5)}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
              {error ? <p style={{ color: 'var(--error)' }}>{error}</p> : null}
              {message ? <p style={{ color: 'var(--green)' }}>{message}</p> : null}
              <Button
                type="button"
                loading={busy}
                disabled={!slotId || slotsLoading}
                onClick={() => void book()}
                style={{ marginTop: '0.75rem' }}
              >
                Book appointment
              </Button>
            </>
          ) : (
            <p className={styles.empty}>Pick a doctor to see open times.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
