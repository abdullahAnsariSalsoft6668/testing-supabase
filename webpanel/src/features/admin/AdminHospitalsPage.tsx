import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Building2 } from 'lucide-react';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Field, Input, TextArea } from '@/shared/components/ui/Field';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { useToast } from '@/shared/components/ui/Toast';
import {
  createHospital,
  deleteHospital,
  listHospitals,
  updateHospital,
} from '@/services/dataService';
import type { Hospital } from '@/types/database';
import { TableSkeleton } from '@/shared/components/ui/Shimmer';
import styles from '../shared/tables.module.css';

const empty = { name: '', email: '', phone: '', address: '', description: '' };

export function AdminHospitalsPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Hospital[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function reload() {
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
  }, []);

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
      if (editingId) {
        await updateHospital(editingId, form);
        toast('Hospital updated', 'success');
      } else {
        await createHospital(form);
        toast('Hospital created', 'success');
      }
      setForm(empty);
      setEditingId(null);
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
        title="Hospitals"
        subtitle="Create and manage hospital locations with a calm, precise workflow."
      />
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
            />
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
              {editingId ? 'Update hospital' : 'Add hospital'}
            </Button>
            {editingId ? (
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
            <TableSkeleton cols={4} rows={4} />
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
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            type="button"
                            onClick={() => setDeleteId(h.id)}
                          >
                            Delete
                          </Button>
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
        This removes the hospital from Mediqo. Related departments may be affected by database
        rules.
      </Modal>
    </div>
  );
}
