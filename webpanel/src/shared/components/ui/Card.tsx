import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styles from './Card.module.css';

export function Card({
  children,
  className,
  delay = 0,
  glass = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  glass?: boolean;
}) {
  return (
    <motion.div
      className={[styles.card, glass ? styles.glass : '', className].filter(Boolean).join(' ')}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
