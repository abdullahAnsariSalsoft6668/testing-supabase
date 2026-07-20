import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({
  variant = 'primary',
  loading,
  icon,
  children,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={[styles.btn, styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      {...(rest as HTMLMotionProps<'button'>)}
    >
      {loading ? <span className={styles.spinner} /> : icon}
      <span>{children}</span>
    </motion.button>
  );
}
