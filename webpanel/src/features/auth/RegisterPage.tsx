import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Stethoscope, UserRound } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthBrandPanel } from '@/features/auth/AuthBrandPanel';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import type { UserRole } from '@/types/database';
import loginStyles from './LoginPage.module.css';
import styles from './RegisterPage.module.css';

type RoleChoice = Extract<UserRole, 'PATIENT' | 'DOCTOR'>;

export function RegisterPage() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RoleChoice>('PATIENT');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <FullPageLoader label="Preparing CareHub…" />;

  if (user) {
    const home =
      user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
    return <Navigate to={home} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signUp({ email: email.trim(), password, fullName: fullName.trim(), role });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={loginStyles.page}>
      <AuthBrandPanel
        badge="Join CareHub"
        headline="Create your health workspace."
        description="Patients book visits. Doctors manage schedules. Admins are invited by your hospital separately."
      />

      <section className={loginStyles.authCol} aria-label="Create account">
        <motion.div
          className={loginStyles.cardWrap}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <form className={loginStyles.card} onSubmit={onSubmit} noValidate>
            <header className={loginStyles.cardHeader}>
              <h2>Create account</h2>
              <p className={loginStyles.subtitle}>
                Three calm steps — role, profile, then you’re in.
              </p>
            </header>

            <div className={styles.progress} aria-label={`Step ${step + 1} of 3`}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={[styles.progressSeg, i <= step ? styles.progressOn : ''].join(' ')}
                />
              ))}
            </div>
            <p className={styles.stepLabel}>
              {step === 0 ? 'Choose your role' : step === 1 ? 'Your details' : 'Secure password'}
            </p>

            <AnimatePresence mode="wait">
              {step === 0 ? (
                <motion.div
                  key="role"
                  className={styles.roleGrid}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    className={[styles.roleCard, role === 'PATIENT' ? styles.roleActive : ''].join(
                      ' ',
                    )}
                    onClick={() => setRole('PATIENT')}
                  >
                    <UserRound size={22} />
                    <strong>Patient</strong>
                    <span>Book visits and track care</span>
                  </button>
                  <button
                    type="button"
                    className={[styles.roleCard, role === 'DOCTOR' ? styles.roleActive : ''].join(
                      ' ',
                    )}
                    onClick={() => setRole('DOCTOR')}
                  >
                    <Stethoscope size={22} />
                    <strong>Doctor</strong>
                    <span>Manage schedule and visits</span>
                  </button>
                </motion.div>
              ) : null}

              {step === 1 ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className={styles.stack}
                >
                  <div className={loginStyles.field}>
                    <label className={loginStyles.label} htmlFor="reg-name">
                      Full name
                    </label>
                    <div className={loginStyles.inputShell}>
                      <UserRound className={loginStyles.inputIcon} size={18} aria-hidden />
                      <input
                        id="reg-name"
                        className={loginStyles.input}
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sara Ahmed"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className={loginStyles.field}>
                    <label className={loginStyles.label} htmlFor="reg-email">
                      Email
                    </label>
                    <div className={loginStyles.inputShell}>
                      <Mail className={loginStyles.inputIcon} size={18} aria-hidden />
                      <input
                        id="reg-email"
                        className={loginStyles.input}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@hospital.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className={styles.stack}
                >
                  <div className={loginStyles.field}>
                    <label className={loginStyles.label} htmlFor="reg-password">
                      Password
                    </label>
                    <div className={loginStyles.inputShell}>
                      <Lock className={loginStyles.inputIcon} size={18} aria-hidden />
                      <input
                        id="reg-password"
                        className={loginStyles.input}
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className={loginStyles.togglePw}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <p className={styles.summary}>
                    Creating a <strong>{role.toLowerCase()}</strong> account for{' '}
                    <strong>{fullName || 'you'}</strong>
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {error ? (
              <div className={loginStyles.error} role="alert">
                {error}
              </div>
            ) : null}

            <div className={styles.navRow}>
              {step > 0 ? (
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              ) : null}
              <button type="submit" className={loginStyles.submit} disabled={busy}>
                {busy ? <span className={loginStyles.spinner} aria-hidden /> : null}
                {busy ? 'Creating…' : step < 2 ? 'Continue' : 'Create account'}
              </button>
            </div>

            <p className={loginStyles.create}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>

          <nav className={loginStyles.legal} aria-label="Legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
            <a href="#help">Help Center</a>
          </nav>
        </motion.div>
      </section>
    </div>
  );
}
