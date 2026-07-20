import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Field, Select } from '@/shared/components/ui/Field';
import { listDoctors, updateDoctorStatus } from '@/services/dataService';
import { PageSkeleton, TableSkeleton } from '@/shared/components/ui/Shimmer';
import type { Doctor, DoctorStatus } from '@/types/database';
import styles from '../shared/tables.module.css';

const filters: Array<DoctorStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
];

export function AdminDoctorsPage() {
  const [filter, setFilter] = useState<DoctorStatus | 'ALL'>('ALL');
  const [rows, setRows] = useState<Doctor[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  async function reload(next = filter, isFilterChange = false) {
    if (isFilterChange) setFiltering(true);
    else setLoading(true);
    try {
      setRows(await listDoctors(next === 'ALL' ? undefined : next));
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  }

  useEffect(() => {
    void reload(filter, true);
  }, [filter]);

  async function setStatus(id: string, status: DoctorStatus) {
    setBusyId(id);
    try {
      await updateDoctorStatus(id, status);
      await reload(filter, true);
    } finally {
      setBusyId(null);
    }
  }

  if (loading && rows.length === 0) {
    return <PageSkeleton stats={0} variant="table" />;
  }

  return (
    <div>
      <PageHeader
        title="Doctors"
        subtitle="Review applications and manage doctor status."
        actions={
          <Field label="Filter">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as DoctorStatus | 'ALL')}
            >
              {filters.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </Field>
        }
      />

      <Card>
        {filtering ? (
          <TableSkeleton cols={5} rows={4} />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Hospital</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyCell}>
                      No doctors for this filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <strong>{d.users?.full_name ?? 'Doctor'}</strong>
                        <div className={styles.meta}>{d.users?.email}</div>
                      </td>
                      <td>{d.specialization}</td>
                      <td>{d.hospitals?.name ?? '—'}</td>
                      <td>
                        <Badge>{d.status}</Badge>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {d.status !== 'APPROVED' ? (
                            <Button
                              variant="soft"
                              type="button"
                              loading={busyId === d.id}
                              onClick={() => setStatus(d.id, 'APPROVED')}
                            >
                              Approve
                            </Button>
                          ) : null}
                          {d.status !== 'REJECTED' ? (
                            <Button
                              variant="danger"
                              type="button"
                              loading={busyId === d.id}
                              onClick={() => setStatus(d.id, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          ) : null}
                          {d.status !== 'SUSPENDED' ? (
                            <Button
                              variant="secondary"
                              type="button"
                              loading={busyId === d.id}
                              onClick={() => setStatus(d.id, 'SUSPENDED')}
                            >
                              Suspend
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
