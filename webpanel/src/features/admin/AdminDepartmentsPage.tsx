import { useEffect, useState, type FormEvent } from 'react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, Select, TextArea } from '@/shared/components/ui/Field';
import {
  createDepartment,
  deleteDepartment,
  listDepartments,
  listHospitals,
} from '@/services/dataService';
import type { Department, Hospital } from '@/types/database';
import { ListSkeleton } from '@/shared/components/ui/Shimmer';
import styles from '../shared/tables.module.css';

export function AdminDepartmentsPage() {
  const [rows, setRows] = useState<Department[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalId, setHospitalId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function reload() {
    const [d, h] = await Promise.all([listDepartments(), listHospitals()]);
    setRows(d);
    setHospitals(h);
    if (!hospitalId && h[0]) setHospitalId(h[0].id);
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
  }, []);

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

  return (
    <div>
      <PageHeader title="Departments" subtitle="Organize care units under each hospital." />
      <Card>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          <Field label="Hospital">
            <Select required value={hospitalId} onChange={(e) => setHospitalId(e.target.value)}>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </Select>
          </Field>
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
                    <div className={styles.meta}>{d.hospitals?.name ?? 'Hospital'}</div>
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
