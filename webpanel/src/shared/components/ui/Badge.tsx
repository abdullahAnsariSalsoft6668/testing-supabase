import styles from './Badge.module.css';

const toneMap: Record<string, string> = {
  PENDING: 'pending',
  APPROVED: 'ok',
  CONFIRMED: 'ok',
  COMPLETED: 'info',
  CANCELLED: 'danger',
  REJECTED: 'danger',
  SUSPENDED: 'pending',
  AVAILABLE: 'ok',
  BOOKED: 'info',
  ADMIN: 'info',
  DOCTOR: 'teal',
  PATIENT: 'soft',
};

export function Badge({ children, tone }: { children: string; tone?: string }) {
  const cls = toneMap[tone ?? children] ?? 'soft';
  return <span className={`${styles.badge} ${styles[cls]}`}>{children.replaceAll('_', ' ')}</span>;
}
