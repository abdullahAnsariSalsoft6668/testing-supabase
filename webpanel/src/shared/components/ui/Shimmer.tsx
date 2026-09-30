import styles from './Shimmer.module.css';

type ShimmerProps = {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
};

export function Shimmer({ width = '100%', height = 14, radius = 8, className }: ShimmerProps) {
  return (
    <span
      className={[styles.shimmer, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className={styles.spinnerWrap} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <span className={styles.spinnerLabel}>{label}</span>
    </div>
  );
}

export function FullPageLoader({ label = 'Loading CareHub…' }: { label?: string }) {
  return (
    <div className={`app-mesh ${styles.fullPage}`}>
      <div className={styles.fullPageCard}>
        <div className={styles.pulseLogo}>+</div>
        <Spinner label={label} />
      </div>
    </div>
  );
}

export function StatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.statGrid} aria-busy="true" aria-label="Loading stats">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.statCard}>
          <Shimmer width={48} height={48} radius={14} />
          <div className={styles.statText}>
            <Shimmer width="45%" height={22} />
            <Shimmer width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={styles.list} aria-busy="true" aria-label="Loading list">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.listRow}>
          <div className={styles.listMain}>
            <Shimmer width={`${55 - (i % 3) * 8}%`} height={16} />
            <Shimmer width={`${40 + (i % 2) * 10}%`} height={12} />
          </div>
          <Shimmer width={72} height={24} radius={999} />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className={styles.tableSkeleton} aria-busy="true" aria-label="Loading table">
      <div className={styles.tableHead}>
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} width={`${70 - i * 5}%`} height={10} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className={styles.tableRow}>
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer key={c} width={`${75 - ((r + c) % 3) * 8}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className={styles.cardSkeleton} aria-busy="true">
      <Shimmer width="35%" height={18} />
      <div className={styles.cardLines}>
        {Array.from({ length: lines }).map((_, i) => (
          <Shimmer key={i} width={`${92 - i * 12}%`} height={12} />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({
  stats = 4,
  variant = 'list',
}: {
  stats?: number;
  variant?: 'list' | 'table' | 'split';
}) {
  return (
    <div className={styles.pageSkeleton} aria-busy="true" aria-label="Loading page">
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <Shimmer width={180} height={20} />
          <Shimmer width={220} height={12} />
        </div>
        <Shimmer width={100} height={36} radius={10} />
      </div>
      {stats > 0 ? <StatSkeleton count={stats} /> : null}
      {variant === 'table' ? (
        <div className={styles.cardSkeleton}>
          <TableSkeleton />
        </div>
      ) : variant === 'split' ? (
        <div className={styles.splitSkeleton}>
          <CardSkeleton lines={6} />
          <CardSkeleton lines={5} />
        </div>
      ) : (
        <div className={styles.cardSkeleton}>
          <Shimmer width="30%" height={16} />
          <ListSkeleton />
        </div>
      )}
    </div>
  );
}
