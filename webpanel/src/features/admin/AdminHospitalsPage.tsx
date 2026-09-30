import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Building2 } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, Select, TextArea } from '@/shared/components/ui/Field';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useToast } from '@/shared/components/ui/Toast';
import { Badge } from '@/shared/components/ui/Badge';
import { useAuth } from '@/features/auth/AuthContext';
import { isHospitalAdmin, isPlatformAdmin } from '@/features/auth/roleHome';
import {
  createHospital,
  deleteHospital,
  listHospitals,
  updateHospital,
} from '@/services/dataService';
import type { Hospital } from '@/types/database';
import { TableSkeleton } from '@/shared/components/ui/Shimmer';
import styles from '../shared/tables.module.css';

const US_CLINIC_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern (NY, FL, GA, …)' },
  { value: 'America/Chicago', label: 'Central (IL, TX, …)' },
  { value: 'America/Denver', label: 'Mountain (CO, UT, …)' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)' },
  { value: 'America/Los_Angeles', label: 'Pacific (CA, WA, …)' },
  { value: 'America/Anchorage', label: 'Alaska' },
  { value: 'Pacific/Honolulu', label: 'Hawaii' },
] as const;

const empty = { name: '', email: '', phone: '', address: '', description: '', timezone: '' };

export function AdminHospitalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const platformAdmin = isPlatformAdmin(user?.role);
  const clinicAdmin = isHospitalAdmin(user?.role);
  const [rows, setRows] = useState<Hospital[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function reload() {
    if (clinicAdmin) {
      if (!user?.hospital_id) {
        setRows([]);
        return;
      }
      setRows(await listHospitals(user.hospital_id));
      return;
    }
    setRows(await listHospitals());
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
    if (!clinicAdmin || rows.length === 0) return;
    const mine = rows.find((h) => h.id === user?.hospital_id) ?? rows[0];
    setEditingId(mine.id);
    setForm({
      name: mine.name,
      email: mine.email ?? '',
      phone: mine.phone ?? '',
      address: mine.address ?? '',
      description: mine.description ?? '',
      timezone: mine.timezone ?? '',
    });
  }, [clinicAdmin, rows, user?.hospital_id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.email ?? '').toLowerCase().includes(q) ||
        (h.address ?? '').toLowerCase().includes(q),
    );
  }, [rows, query]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = { ...form, timezone: form.timezone || null };
      if (editingId || clinicAdmin) {
        const id = editingId ?? user?.hospital_id;
        if (!id) throw new Error('Hospital not found');
        await updateHospital(id, payload);
        toast('Hospital updated', 'success');
        if (!clinicAdmin) {
          setForm(empty);
          setEditingId(null);
        }
      } else {
        await createHospital(payload);
        toast('Hospital created', 'success');
        setForm(empty);
        setEditingId(null);
      }
      await reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      setError(msg);
      toast(msg, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteHospital(deleteId);
      toast('Hospital removed', 'success');
      setDeleteId(null);
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title={clinicAdmin ? 'My hospital' : 'Hospitals'}
        subtitle={
          clinicAdmin
            ? 'Update your clinic details. Status is set by CareHub.'
            : 'Create and manage hospital locations with a calm, precise workflow.'
        }
      />
      {platformAdmin || clinicAdmin ? (
      <Card>
        <form onSubmit={onSubmit} className={styles.formGrid}>
          <Field label="Name">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="City General Hospital"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>
          <Field label="Address">
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="123 Medical Ave, Austin, TX"
            />
          </Field>
          <Field
            label="Timezone"
            hint="Used for reminder calls. Leave Auto if the address includes a US state."
          >
            <Select
              value={form.timezone}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            >
              <option value="">Auto (from address)</option>
              {US_CLINIC_TIMEZONES.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </Select>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Description">
              <TextArea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Field>
          </div>
          {error ? <div style={{ color: 'var(--error)', gridColumn: '1 / -1' }}>{error}</div> : null}
          <div className={styles.actions} style={{ gridColumn: '1 / -1' }}>
            <Button type="submit" loading={busy}>
              {editingId || clinicAdmin ? 'Update hospital' : 'Add hospital'}
            </Button>
            {editingId && !clinicAdmin ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>
      ) : null}

      {platformAdmin ? (
      <div className={styles.stackGap}>
        <Card delay={0.08}>
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search hospitals…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search hospitals"
            />
          </div>
          {loading ? (
            <TableSkeleton cols={5} rows={4} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Building2 size={22} />}
              title={rows.length === 0 ? 'No hospitals yet' : 'No matches'}
              description={
                rows.length === 0
                  ? 'Add your first hospital using the form above.'
                  : 'Try a different search term.'
              }
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Timezone</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <strong>{h.name}</strong>
                      </td>
                      <td>
                        <div>{h.email}</div>
                        <div className={styles.meta}>{h.phone}</div>
                      </td>
                      <td>{h.address}</td>
                      <td className={styles.meta}>{h.timezone || 'Auto'}</td>
                      <td>
                        <Badge tone={h.status ?? 'APPROVED'}>{h.status ?? 'APPROVED'}</Badge>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Button
                            variant="soft"
                            type="button"
                            onClick={() => {
                              setEditingId(h.id);
                              setForm({
                                name: h.name,
                                email: h.email ?? '',
                                phone: h.phone ?? '',
                                address: h.address ?? '',
                                description: h.description ?? '',
                                timezone: h.timezone ?? '',
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Edit
                          </Button>
                          {platformAdmin ? (
                          <Button
                            variant="danger"
                            type="button"
                            onClick={() => setDeleteId(h.id)}
                          >
                            Delete
                          </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      ) : null}

      <Modal
        open={Boolean(deleteId)}
        title="Delete hospital?"
        onClose={() => setDeleteId(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" type="button" onClick={() => void confirmDelete()}>
              Delete
            </Button>
          </>
        }
      >
        This removes the hospital from CareHub. Related departments may be affected by database
        rules.
      </Modal>
    </div>
  );
}
