import { useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { useAuth } from '@/features/auth/AuthContext';
import { isHospitalAdmin } from '@/features/auth/roleHome';
import { listPatients } from '@/services/dataService';
import { PageSkeleton, TableSkeleton } from '@/shared/components/ui/Shimmer';
import type { Patient } from '@/types/database';
import { displayUserName } from '@/shared/userDisplay';
import styles from '../shared/tables.module.css';

export function AdminPatientsPage() {
  const { user } = useAuth();
  const clinicAdmin = isHospitalAdmin(user?.role);
  const hospitalId = clinicAdmin ? user?.hospital_id ?? null : null;
  const [rows, setRows] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        setRows(await listPatients(hospitalId));
      } finally {
        setLoading(false);
      }
    })();
  }, [hospitalId]);

  if (loading && rows.length === 0) {
    return <PageSkeleton stats={0} variant="table" />;
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle={
          clinicAdmin
            ? `People registered at ${user?.hospital?.name ?? 'your hospital'}.`
            : 'Patients grouped by the hospital they registered with.'
        }
      />
      <Card>
        {loading ? (
          <TableSkeleton cols={clinicAdmin ? 4 : 5} rows={4} />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Patient</th>
                  {!clinicAdmin ? <th>Hospital</th> : null}
                  <th>Gender</th>
                  <th>Blood group</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={clinicAdmin ? 4 : 5} className={styles.emptyCell}>
                      No patients registered at this hospital yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{displayUserName(p.users, 'Patient')}</strong>
                        {p.users?.email ? <div className={styles.meta}>{p.users.email}</div> : null}
                      </td>
                      {!clinicAdmin ? <td>{p.hospitals?.name ?? '—'}</td> : null}
                      <td>{p.gender ?? '—'}</td>
                      <td>{p.blood_group ?? '—'}</td>
                      <td>{p.users?.phone ?? '—'}</td>
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
