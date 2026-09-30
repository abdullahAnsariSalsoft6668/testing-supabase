import { useEffect, useState, type FormEvent } from 'react';
import { HeartPulse, Phone, Save, UserRound } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, Select, TextArea } from '@/shared/components/ui/Field';
import { useToast } from '@/shared/components/ui/Toast';
import { updateOwnPatientProfile } from '@/services/dataService';
import { PageSkeleton } from '@/shared/components/ui/Shimmer';
import styles from './PatientProfilePage.module.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
] as const;

export function PatientProfilePage() {
  const { user, loading, refresh } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFullName(user.full_name ?? '');
    setPhone(user.phone ?? '');
    setGender(user.patient?.gender ?? '');
    setBloodGroup(user.patient?.blood_group ?? '');
    setDob(user.patient?.dob ?? '');
    setAddress(user.patient?.address ?? '');
    setEmergencyName(user.patient?.emergency_contact_name ?? '');
    setEmergencyPhone(user.patient?.emergency_contact_phone ?? '');
    setAllergies(user.patient?.allergies ?? '');
  }, [user]);

  if (loading && !user) return <PageSkeleton stats={0} variant="list" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await updateOwnPatientProfile({
        fullName,
        phone,
        gender: gender || null,
        blood_group: bloodGroup || null,
        dob: dob || null,
        address,
        emergency_contact_name: emergencyName,
        emergency_contact_phone: emergencyPhone,
        allergies,
      });
      await refresh();
      toast('Profile saved', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save profile';
      setError(message);
      toast(message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const hospitalName = user?.hospital?.name ?? user?.patient?.hospitals?.name;
  const firstName = fullName.trim().split(' ')[0] || user?.full_name?.split(' ')[0] || 'there';
  const initials = (fullName.trim() || user?.full_name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <form className={styles.page} onSubmit={onSubmit}>
      <PageHeader
        eyebrow="Account"
        title={`Your profile, ${firstName}`}
        subtitle="A few details help the clinic reach you for visits, booking SMS, and reminder calls."
      />

      <Card className={styles.banner} glass>
        <div className={styles.bannerAvatar} aria-hidden>
          {initials}
        </div>
        <div className={styles.bannerCopy}>
          <h2>{fullName.trim() || user?.full_name || 'Patient'}</h2>
          <p>{user?.email}</p>
          <div className={styles.pills}>
            <span className={styles.pill}>Patient</span>
            {hospitalName ? <span className={styles.pill}>{hospitalName}</span> : null}
          </div>
        </div>
      </Card>

      <div className={styles.sections}>
        <Card>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              <UserRound size={18} />
            </div>
            <div>
              <h3>About you</h3>
              <p>How the clinic should address you and get in touch.</p>
            </div>
          </div>
          <div className={styles.grid}>
            <Field label="Full name">
              <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Phone" hint="Include country code, e.g. +1…">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </Field>
            <Field label="Email">
              <Input value={user?.email ?? ''} disabled />
            </Field>
            <Field label="Hospital">
              <Input value={hospitalName ?? 'Not joined yet'} disabled />
            </Field>
            <div className={styles.wide}>
              <Field label="Home address">
                <TextArea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city, and postal code"
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              <HeartPulse size={18} />
            </div>
            <div>
              <h3>Health details</h3>
              <p>Optional, but useful for safer visits.</p>
            </div>
          </div>
          <div className={styles.grid}>
            <Field label="Gender">
              <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Prefer not to say</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Blood group">
              <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="">Not set</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date of birth">
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </Field>
            <div className={styles.wide}>
              <Field label="Known allergies" hint="Leave blank if none.">
                <TextArea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Medicines, foods, or other allergies"
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className={styles.sectionHead}>
            <div className={styles.sectionIcon}>
              <Phone size={18} />
            </div>
            <div>
              <h3>Emergency contact</h3>
              <p>Someone we can call if we cannot reach you.</p>
            </div>
          </div>
          <div className={styles.grid}>
            <Field label="Contact name">
              <Input
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Full name"
              />
            </Field>
            <Field label="Contact phone">
              <Input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </Field>
          </div>
        </Card>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <Card className={styles.saveBar} glass>
        <p className={styles.saveHint}>Your email and hospital stay as they are. Everything else updates when you save.</p>
        <Button type="submit" loading={busy} icon={<Save size={16} />}>
          Save changes
        </Button>
      </Card>
    </form>
  );
}
