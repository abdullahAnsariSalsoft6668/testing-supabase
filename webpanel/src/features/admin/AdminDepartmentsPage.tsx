import { useEffect, useState, type FormEvent } from 'react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, Select, TextArea } from '@/shared/components/ui/Field';
import {
  createClinicOption,
  createDepartment,
  deleteClinicOption,
  deleteDepartment,
  listClinicOptions,
  listDepartments,
  listHospitals,
} from '@/services/dataService';
import { useAuth } from '@/features/auth/AuthContext';
import { isHospitalAdmin, isPlatformAdmin } from '@/features/auth/roleHome';
import type { ClinicOption, ClinicOptionKind, Department, Hospital } from '@/types/database';
import { ListSkeleton } from '@/shared/components/ui/Shimmer';
import styles from '../shared/tables.module.css';

export function AdminDepartmentsPage() {
  const { user } = useAuth();
  const clinicAdmin = isHospitalAdmin(user?.role);
  const platformAdmin = isPlatformAdmin(user?.role);
  const scopedHospitalId = clinicAdmin ? user?.hospital_id ?? null : null;
  const [rows, setRows] = useState<Department[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [specializations, setSpecializations] = useState<ClinicOption[]>([]);
  const [qualifications, setQualifications] = useState<ClinicOption[]>([]);
  const [optionName, setOptionName] = useState('');
  const [optionKind, setOptionKind] = useState<ClinicOptionKind>('specialization');
  const [optionBusy, setOptionBusy] = useState(false);
  const [optionScope, setOptionScope] = useState<'hospital' | 'global'>('hospital');

  async function reload() {
    if (clinicAdmin && !user?.hospital_id) {
      setRows([]);
      setHospitals([]);
      return;
    }
    const optionHospitalId = clinicAdmin ? user?.hospital_id ?? null : hospitalId || null;
    const [d, h, specResult, qualResult] = await Promise.all([
      listDepartments(scopedHospitalId),
      listHospitals(scopedHospitalId),
      listClinicOptions('specialization', optionHospitalId).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Could not load apply options';
        setError(message);
        return [] as ClinicOption[];
      }),
      listClinicOptions('qualification', optionHospitalId).catch(() => [] as ClinicOption[]),
    ]);
    setRows(d);
    setHospitals(h);
    setSpecializations(specResult);
    setQualifications(qualResult);
    if (!hospitalId) {
      const preferred = user?.hospital_id ?? h[0]?.id ?? '';
      if (preferred) setHospitalId(preferred);
    }
  }

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        await reload();
      } finally {
        setLoading(false);
      }
    })();
  }, [clinicAdmin, user?.hospital_id]);

  useEffect(() => {
    if (clinicAdmin || !hospitalId) return;
    void Promise.all([
      listClinicOptions('specialization', hospitalId),
      listClinicOptions('qualification', hospitalId),
    ]).then(([specs, quals]) => {
      setSpecializations(specs);
      setQualifications(quals);
    });
  }, [clinicAdmin, hospitalId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await createDepartment({ hospital_id: hospitalId, name, description });
      setName('');
      setDescription('');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  async function onAddOption(e: FormEvent) {
    e.preventDefault();
    if (!optionName.trim()) return;
    setOptionBusy(true);
    setError('');
    try {
      const hospital_id = clinicAdmin
        ? user?.hospital_id ?? null
        : optionScope === 'global'
          ? null
          : hospitalId || null;
      if (clinicAdmin && !hospital_id) {
        throw new Error('Your hospital is not assigned yet');
      }
      if (!clinicAdmin && optionScope === 'hospital' && !hospital_id) {
        throw new Error('Select a hospital, or add this as a global option');
      }
      await createClinicOption({
        kind: optionKind,
        name: optionName,
        hospital_id,
      });
      setOptionName('');
      await reload();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as { message: unknown }).message)
            : 'Could not add option';
      setError(message || 'Could not add option');
    } finally {
      setOptionBusy(false);
    }
  }
  const hospitalName = hospitals.find((h) => h.id === hospitalId)?.name ?? user?.hospital?.name ?? 'Your hospital';
  const showHospitalPicker = !clinicAdmin && hospitals.length > 1;

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle={
          clinicAdmin ? `Add care units at ${hospitalName}.` : 'Organize care units under each hospital.'
        }
      />
      <Card>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          {showHospitalPicker ? (
            <Field label="Hospital">
              <Select required value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Department name">
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Description">
              <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
          </div>
          {error ? <div style={{ color: 'var(--error)' }}>{error}</div> : null}
          <Button type="submit" loading={busy}>
            Add department
          </Button>
        </form>
      </Card>

      <Card className={styles.stackGap}>
        <form onSubmit={onAddOption} className={styles.formGrid}>
          <Field label="Doctor apply option">
            <Select
              value={optionKind}
              onChange={(e) => setOptionKind(e.target.value as ClinicOptionKind)}
            >
              <option value="specialization">Specialization</option>
              <option value="qualification">Qualification</option>
            </Select>
          </Field>
          {platformAdmin ? (
            <Field label="Available to">
              <Select
                value={optionScope}
                onChange={(e) => setOptionScope(e.target.value as 'hospital' | 'global')}
              >
                <option value="hospital">Selected hospital</option>
                <option value="global">All hospitals</option>
              </Select>
            </Field>
          ) : null}
          <Field label="Option name">
            <Input
              required
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder={optionKind === 'qualification' ? 'MBBS' : 'Cardiology'}
            />
          </Field>
          {error ? <div style={{ color: 'var(--error)' }}>{error}</div> : null}
          <Button type="submit" loading={optionBusy}>
            Add option
          </Button>
        </form>
        <p className={styles.meta} style={{ marginTop: 8 }}>
          These appear in the doctor apply dropdowns
          {clinicAdmin
            ? ` for ${hospitalName}.`
            : optionScope === 'global'
              ? ' for every hospital.'
              : hospitalId
                ? ` for ${hospitalName}, plus global options.`
                : ' as global options for every hospital.'}
        </p>
        <div className={styles.list} style={{ marginTop: 12 }}>
          {(optionKind === 'specialization' ? specializations : qualifications).map((opt) => (
            <div key={opt.id} className={styles.row}>
              <div>
                <strong>{opt.name}</strong>
                <div className={styles.meta}>{opt.hospital_id ? 'This hospital' : 'All hospitals'}</div>
              </div>
              {platformAdmin || (clinicAdmin && opt.hospital_id === user?.hospital_id) ? (
                <Button
                  variant="danger"
                  type="button"
                  onClick={async () => {
                    await deleteClinicOption(opt.id);
                    await reload();
                  }}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <div className={styles.stackGap}>
        <Card delay={0.08}>
          {loading ? (
            <ListSkeleton rows={4} />
          ) : rows.length === 0 ? (
            <p className={styles.empty}>No departments yet.</p>
          ) : (
            <div className={styles.list}>
              {rows.map((d) => (
                <div key={d.id} className={styles.row}>
                  <div>
                    <strong>{d.name}</strong>
                    {showHospitalPicker ? (
                      <div className={styles.meta}>{d.hospitals?.name ?? 'Hospital'}</div>
                    ) : null}
                  </div>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={async () => {
                      await deleteDepartment(d.id);
                      await reload();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
