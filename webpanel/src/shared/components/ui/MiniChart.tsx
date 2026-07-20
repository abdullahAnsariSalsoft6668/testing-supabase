import { motion } from 'framer-motion';
import styles from './MiniChart.module.css';

export function BarChart({
  values,
  labels,
}: {
  values: number[];
  labels?: string[];
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={styles.chart} role="img" aria-label="Bar chart">
      <div className={styles.bars}>
        {values.map((v, i) => (
          <div key={i} className={styles.barCol}>
            <motion.div
              className={styles.bar}
              initial={{ height: 0 }}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />
            {labels?.[i] ? <span className={styles.tick}>{labels[i]}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  value,
  total = 100,
  label,
}: {
  value: number;
  total?: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className={styles.donutWrap}>
      <svg viewBox="0 0 100 100" className={styles.donut} aria-hidden>
        <circle cx="50" cy="50" r={r} className={styles.donutTrack} />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          className={styles.donutValue}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className={styles.donutLabel}>
        <strong>{pct}%</strong>
        {label ? <span>{label}</span> : null}
      </div>
    </div>
  );
}
