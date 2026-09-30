import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Select } from '@/shared/components/ui/Field';
import {
  bookAppointment,
  listApprovedDoctors,
  listBookableSlots,
} from '@/services/dataService';
import { ListSkeleton, PageSkeleton, Spinner } from '@/shared/components/ui/Shimmer';
import type { Doctor, DoctorSlot } from '@/types/database';
import styles from '../shared/tables.module.css';

function doctorDisplayName(doctor: Doctor) {
  const raw = (doctor.users?.full_name || doctor.users?.name || '').trim();
  if (!raw) return null;
  return /^dr\.?\s/i.test(raw) ? raw : `Dr. ${raw}`;
}

function doctorInitials(doctor: Doctor) {
  const raw = (doctor.users?.full_name || doctor.users?.name || doctor.specialization || 'DR').trim();
  const parts = raw.replace(/^dr\.?\s*/i, '').split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'DR';
}

function DoctorAvatar({ doctor, large = false }: { doctor: Doctor; large?: boolean }) {
  const photo = doctor.users?.profile_image;
  return (
    <div className={styles.doctorAvatar} style={large ? { width: 56, height: 56, flexBasis: 56 } : undefined}>
      {photo ? <img src={photo} alt="" /> : doctorInitials(doctor)}
    </div>
  );
}

export function PatientDoctorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hospitalId = user?.patient?.hospital_id ?? (user?.role === 'PATIENT' ? user.hospital_id : null);
  const hospitalName = user?.hospital?.name ?? user?.patient?.hospitals?.name;

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setDoctors(await listApprovedDoctors(hospitalId));
      } finally {
        setLoading(false);
      }
    })();
  }, [hospitalId]);

  useEffect(() => {
    if (!selected) {
      setSlots([]);
      return;
    }
    void (async () => {
      setSlotsLoading(true);
      try {
        setSlots(await listBookableSlots(selected.id));
        setSlotId('');
      } finally {
        setSlotsLoading(false);
      }
    })();
  }, [selected]);

  const selectedSlot = useMemo(() => slots.find((s) => s.id === slotId), [slots, slotId]);

  const filteredDoctors = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return doctors;
    return doctors.filter((d) => {
      const hay = [
        doctorDisplayName(d),
        d.specialization,
        d.qualification,
        d.hospitals?.name,
        d.departments?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  }, [doctors, query]);

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
        notes: 'Booked via CareHub web',
      });
      setMessage('Appointment requested. Opening My visits…');
      navigate('/patient/visits');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <PageSkeleton stats={0} variant="split" />;

  return (
    <div>
      <PageHeader
        title="Find care"
        subtitle={
          hospitalName
            ? `Doctors at ${hospitalName}. Choose one, then pick an open time.`
            : 'Choose a doctor, then pick an open time.'
        }
      />
      <div className={styles.split}>
        <Card>
          <h3 className={styles.sectionTitle}>Doctors</h3>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by name or specialty"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginBottom: '0.85rem', width: '100%' }}
          />
          {filteredDoctors.length === 0 ? (
            <p className={styles.empty}>
              {doctors.length === 0
                ? hospitalName
                  ? `No approved doctors at ${hospitalName} yet.`
                  : 'Join a hospital to see its doctors.'
                : 'No doctors match that search.'}
            </p>
          ) : (
            <div className={styles.list}>
              {filteredDoctors.map((d) => {
                const name = doctorDisplayName(d);
                const selectedCard = selected?.id === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`${styles.doctorCard} ${selectedCard ? styles.doctorCardSelected : ''}`}
                    onClick={() => setSelected(d)}
                  >
                    <DoctorAvatar doctor={d} />
                    <div className={styles.doctorBody}>
                      <p className={styles.doctorName}>{name ?? (d.specialization || 'Doctor')}</p>
                      {name ? (
                        <p className={styles.doctorSpec}>{d.specialization}</p>
                      ) : (
                        <p className={styles.doctorSpec}>Name not on file</p>
                      )}
                      {d.hospitals?.name ? (
                        <p className={styles.doctorClinic}>{d.hospitals.name}</p>
                      ) : null}
                      <div className={styles.doctorFacts}>
                        {d.qualification ? <span className={styles.doctorChip}>{d.qualification}</span> : null}
                        {d.experience > 0 ? (
                          <span className={styles.doctorChip}>{d.experience} yr exp</span>
                        ) : null}
                        {d.consultation_fee != null ? (
                          <span className={styles.doctorChip}>Fee {d.consultation_fee}</span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card delay={0.08}>
          {selected ? (
            <>
              <div className={styles.doctorProfile}>
                <DoctorAvatar doctor={selected} large />
                <div className={styles.doctorBody}>
                  <p className={styles.doctorName}>
                    {doctorDisplayName(selected) ?? selected.specialization}
                  </p>
                  <p className={styles.doctorSpec}>{selected.specialization}</p>
                  {selected.hospitals?.name ? (
                    <p className={styles.doctorClinic}>{selected.hospitals.name}</p>
                  ) : null}
                  {selected.bio ? <p className={styles.doctorBio}>{selected.bio}</p> : null}
                </div>
              </div>
              <h3 className={styles.sectionTitle}>Available times</h3>
              {!user?.patient_id ? (
                <p className={styles.empty}>
                  Complete your patient profile in the mobile app before booking on web.
                </p>
              ) : (
                <>
                  {slotsLoading ? (
                    <div className={styles.stackGap}>
                      <Spinner label="Loading slots…" />
                      <ListSkeleton rows={3} />
                    </div>
                  ) : (
                    <Field label="Pick a slot">
                      <Select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
                        <option value="">Choose a time</option>
                        {slots.length === 0 ? (
                          <option value="" disabled>
                            No upcoming open slots
                          </option>
                        ) : null}
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
              )}
            </>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Select a doctor</h3>
              <p className={styles.empty}>Tap a doctor on the left to see their name, clinic, and open times.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
