import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShieldAlert } from 'lucide-react';
import styles from './ErrorPages.module.css';

function ErrorShell({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className={`app-mesh ${styles.page}`}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className={styles.icon}>
          <ShieldAlert size={28} />
        </div>
        <p className={styles.code}>{code}</p>
        <h1>{title}</h1>
        <p className={styles.desc}>{description}</p>
        <Link to="/" className={styles.cta}>
          <Home size={16} /> Back to Mediqo
        </Link>
      </motion.div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorShell
      code="404"
      title="This ward doesn’t exist"
      description="The page you’re looking for may have moved. Let’s get you back to calm care."
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorShell
      code="403"
      title="Access restricted"
      description="You don’t have permission for this area of the hospital console."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorShell
      code="500"
      title="Something went wrong"
      description="Our team has been notified. Please try again in a moment."
    />
  );
}
