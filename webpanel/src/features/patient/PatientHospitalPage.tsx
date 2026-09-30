import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { homePath } from '@/features/auth/roleHome';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Select } from '@/shared/components/ui/Field';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import { joinPatientHospital, listHospitals } from '@/services/dataService';
import type { Hospital } from '@/types/database';

export function PatientHospitalPage() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const rows = await listHospitals();
      setHospitals(rows.filter((h) => !h.status || h.status === 'APPROVED'));
    })();
  }, []);

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'PATIENT') return <Navigate to={homePath(user)} replace />;
  if (user.patient?.hospital_id) return <Navigate to="/patient" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!hospitalId) {
      setError('Choose the hospital where you receive care');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await joinPatientHospital(hospitalId);
      await refresh();
      navigate('/patient', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Could not join hospital';
      setError(message || 'Could not join hospital');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '3rem auto', padding: '0 1.25rem' }}>
      <PageHeader
        eyebrow="Patient"
        title="Choose your hospital"
        subtitle="CareHub keeps each hospital’s patients and doctors separate. Pick the clinic you belong to."
      />
      <Card>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
          <Field label="Hospital">
            <Select required value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
              <option value="">Select a hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
          </Field>
          {error ? <div style={{ color: 'var(--error)' }}>{error}</div> : null}
          <Button type="submit" loading={busy} icon={<Building2 size={16} />}>
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
