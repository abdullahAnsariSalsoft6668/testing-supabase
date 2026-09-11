import { motion } from 'framer-motion';
import {
  Activity,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import styles from './AuthBrandPanel.module.css';

type Props = {
  badge?: string;
  headline?: string;
  description?: string;
};

export function AuthBrandPanel({
  badge = 'Hospital Console',
  headline = 'Care that feels calm, clear, and close.',
  description = 'Mediqo unifies admins, clinicians, and patients in one calm workspace — schedules, visits, and hospital operations with clinic clarity.',
}: Props) {
  return (
    <aside className={styles.brand} aria-hidden={false}>
      <div className={styles.blobA} />
      <div className={styles.blobB} />
      <div className={styles.blobC} />
      <div className={styles.gridGlow} />

      <motion.div
        className={styles.brandInner}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.logoRow}>
          <div className={styles.logoMark} aria-hidden>
            <span>+</span>
          </div>
          <div>
            <div className={styles.logoName}>Mediqo</div>
            <div className={styles.logoTag}>Healthcare OS</div>
          </div>
        </div>

        <div className={styles.badge}>{badge}</div>

        <h1 className={styles.headline}>{headline}</h1>
        <p className={styles.copy}>{description}</p>

        <div className={styles.stage}>
          <motion.div
            className={styles.mockup}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.mockChrome}>
              <span />
              <span />
              <span />
              <div className={styles.mockTitle}>Mediqo · Live board</div>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockStats}>
                <div className={styles.mockStat}>
                  <span>Today</span>
                  <strong>42</strong>
                  <em>visits</em>
                </div>
                <div className={styles.mockStat}>
                  <span>Available</span>
                  <strong>18</strong>
                  <em>slots</em>
                </div>
                <div className={styles.mockStatAccent}>
                  <Activity size={16} />
                  <div>
                    <span>Ops health</span>
                    <strong>98%</strong>
                  </div>
                </div>
              </div>
              <div className={styles.mockChart}>
                <div className={styles.bar} style={{ height: '42%' }} />
                <div className={styles.bar} style={{ height: '68%' }} />
                <div className={styles.bar} style={{ height: '55%' }} />
                <div className={styles.bar} style={{ height: '82%' }} />
                <div className={styles.bar} style={{ height: '64%' }} />
                <div className={styles.bar} style={{ height: '90%' }} />
                <div className={styles.bar} style={{ height: '72%' }} />
              </div>
              <div className={styles.mockTable}>
                <div className={styles.mockRow}>
                  <div className={styles.avatar}>AH</div>
                  <div>
                    <strong>Dr. Ayesha Hashim</strong>
                    <span>Cardiology · 09:30</span>
                  </div>
                  <em>Confirmed</em>
                </div>
                <div className={styles.mockRow}>
                  <div className={styles.avatarAlt}>RK</div>
                  <div>
                    <strong>Raza Khan</strong>
                    <span>General · 10:15</span>
                  </div>
                  <em className={styles.pending}>Pending</em>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.floatCard} ${styles.floatAppt}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CalendarDays size={18} />
            <div>
              <strong>Next appointment</strong>
              <span>Tomorrow · 09:00 AM</span>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.floatCard} ${styles.floatShield}`}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            <ShieldCheck size={18} />
            <div>
              <strong>HIPAA-ready</strong>
              <span>Encrypted sessions</span>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.floatCard} ${styles.floatTeam}`}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <Users size={16} />
            <span>128 clinicians online</span>
          </motion.div>

          <motion.div
            className={`${styles.iconOrb} ${styles.orb1}`}
            animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <HeartPulse size={20} />
          </motion.div>
          <motion.div
            className={`${styles.iconOrb} ${styles.orb2}`}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <Stethoscope size={18} />
          </motion.div>
        </div>
      </motion.div>
    </aside>
  );
}
