import { useEffect, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { doctorPortalReady, homePath } from '@/features/auth/roleHome';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, Select } from '@/shared/components/ui/Field';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import { createDoctorProfile, listClinicOptions, listDepartments, listHospitals } from '@/services/dataService';
import type { Department, Hospital } from '@/types/database';

export function DoctorApplyPage() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hospitalId, setHospitalId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('0');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const rows = await listHospitals();
      setHospitals(rows.filter((h) => !h.status || h.status === 'APPROVED'));
    })();
  }, []);

  useEffect(() => {
    if (!hospitalId) {
      setDepartments([]);
      setDepartmentId('');
      setSpecializations([]);
      setQualifications([]);
      return;
    }
    void Promise.all([
      listDepartments(hospitalId),
      listClinicOptions('specialization', hospitalId),
      listClinicOptions('qualification', hospitalId),
    ])
      .then(([d, specs, quals]) => {
        setDepartments(d);
        setDepartmentId('');
        const fromDepts = d.map((row) => row.name);
        const fromCatalog = specs.map((row) => row.name);
        setSpecializations([...new Set([...fromDepts, ...fromCatalog])].sort((a, b) => a.localeCompare(b)));
        setQualifications([...new Set(quals.map((row) => row.name))].sort((a, b) => a.localeCompare(b)));
        setSpecialization('');
        setQualification('');
      })
      .catch(() => {
        setDepartments([]);
        setSpecializations([]);
        setQualifications([]);
      });
  }, [hospitalId]);

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'DOCTOR') return <Navigate to={homePath(user)} replace />;
  if (doctorPortalReady(user)) return <Navigate to="/doctor" replace />;
  if (user.doctor_id || user.doctor) return <Navigate to="/doctor/pending" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!hospitalId) {
      setError('Choose the hospital you want to join');
      return;
    }
    if (!specialization.trim()) {
      setError('Specialization is required');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await createDoctorProfile({
        hospital_id: hospitalId,
        department_id: departmentId || null,
        specialization: specialization.trim(),
        qualification: qualification.trim() || undefined,
        license_number: license.trim() || undefined,
        experience: Number(experience) || 0,
      });
      await refresh();
      navigate('/doctor/pending', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit application');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '3rem auto', padding: '0 1.25rem' }}>
      <PageHeader
        eyebrow="Doctor"
        title="Apply to a hospital"
        subtitle="Pick a clinic. That hospital’s admin reviews your credentials before you can see patients."
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
          <Field
            label="Department"
            hint={
              hospitalId && departments.length === 0
                ? 'This hospital has not added departments yet. Ask the hospital admin.'
                : undefined
            }
          >
            <Select
              required={departments.length > 0}
              value={departmentId}
              onChange={(e) => {
                const next = e.target.value;
                setDepartmentId(next);
                const match = departments.find((d) => d.id === next);
                if (match) setSpecialization(match.name);
              }}
              disabled={!hospitalId}
            >
              <option value="">{departments.length ? 'Select a department' : 'No departments yet'}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Specialization"
            hint={
              hospitalId && specializations.length === 0
                ? 'No specializations yet. Ask the hospital or platform admin to add them under Departments.'
                : 'Options come from that hospital and from platform-wide lists.'
            }
          >
            <Select
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              disabled={!hospitalId || specializations.length === 0}
            >
              <option value="">Select a specialization</option>
              {specializations.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Qualification">
            <Select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              disabled={!hospitalId || qualifications.length === 0}
            >
              <option value="">{qualifications.length ? 'Select a qualification' : 'No qualifications yet'}</option>
              {qualifications.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="License number">
            <Input value={license} onChange={(e) => setLicense(e.target.value)} />
          </Field>
          <Field label="Years of experience">
            <Input type="number" min={0} value={experience} onChange={(e) => setExperience(e.target.value)} />
          </Field>
          {error ? <div style={{ color: 'var(--error)' }}>{error}</div> : null}
          <Button type="submit" loading={busy} icon={<Stethoscope size={16} />}>
            Send request
          </Button>
        </form>
      </Card>
    </div>
  );
}
