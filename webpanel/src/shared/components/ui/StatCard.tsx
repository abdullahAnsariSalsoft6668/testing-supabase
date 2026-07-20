import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

export function StatCard({
  label,
  value,
  icon,
  delay = 0,
  hint,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  delay?: number;
  hint?: string;
}) {
  return (
    <motion.div
      className={styles.stat}
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
    >
      <div className={styles.icon}>{icon}</div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {hint ? <div className={styles.hint}>{hint}</div> : null}
      </div>
    </motion.div>
  );
}
