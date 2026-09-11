import { useEffect, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthBrandPanel } from '@/features/auth/AuthBrandPanel';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import { supabase } from '@/lib/supabase';
import styles from './LoginPage.module.css';

const REMEMBER_KEY = 'carehub.web.rememberEmail';

function GoogleIcon() {
  return (
    <svg className={styles.ssoIcon} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className={styles.ssoIcon} viewBox="0 0 24 24" aria-hidden>
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#00A4EF" d="M12.5 2H22v9.5H12.5z" />
      <path fill="#7FBA00" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22H12.5z" />
    </svg>
  );
}

export function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  if (loading) return <FullPageLoader label="Preparing Mediqo…" />;

  if (user) {
    const home =
      user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
    return <Navigate to={home} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
      else localStorage.removeItem(REMEMBER_KEY);
      await signIn(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  async function onForgotPassword() {
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Enter your email above, then tap Forgot password.');
      return;
    }
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setInfo('Password reset link sent. Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start password reset');
    }
  }

  function onSso(provider: 'google' | 'azure') {
    setError('');
    setInfo(
      `${provider === 'google' ? 'Google' : 'Microsoft'} SSO is not enabled for this environment yet. Use email sign-in.`,
    );
  }

  return (
    <div className={styles.page}>
      <AuthBrandPanel />

      <section className={styles.authCol} aria-label="Sign in">
        <motion.div
          className={styles.cardWrap}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <form className={styles.card} onSubmit={onSubmit} noValidate>
            <header className={styles.cardHeader}>
              <h2>Welcome back</h2>
              <p className={styles.subtitle}>
                Sign in to your Mediqo hospital console — calm, clear, and secure.
              </p>
            </header>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-email">
                Email
              </label>
              <div className={styles.inputShell}>
                <Mail className={styles.inputIcon} size={18} strokeWidth={2} aria-hidden />
                <input
                  id="login-email"
                  className={styles.input}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="login-password">
                Password
              </label>
              <div className={styles.inputShell}>
                <Lock className={styles.inputIcon} size={18} strokeWidth={2} aria-hidden />
                <input
                  id="login-password"
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.rowBetween}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className={styles.forgot} onClick={() => void onForgotPassword()}>
                Forgot password?
              </button>
            </div>

            {error ? (
              <div className={styles.error} role="alert">
                {error}
              </div>
            ) : null}
            {info ? (
              <div className={styles.info} role="status">
                {info}
              </div>
            ) : null}

            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? <span className={styles.spinner} aria-hidden /> : null}
              {busy ? 'Signing in…' : 'Sign in'}
            </button>

            <div className={styles.divider} aria-hidden>
              <span />
              <em>or continue with</em>
              <span />
            </div>

            <div className={styles.ssoRow}>
              <button type="button" className={styles.ssoBtn} onClick={() => onSso('google')}>
                <GoogleIcon />
                Google
              </button>
              <button type="button" className={styles.ssoBtn} onClick={() => onSso('azure')}>
                <MicrosoftIcon />
                Microsoft
              </button>
            </div>

            <p className={styles.create}>
              New to Mediqo? <Link to="/register">Create account</Link>
            </p>
          </form>

          <nav className={styles.legal} aria-label="Legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
            <a href="#help">Help Center</a>
          </nav>
        </motion.div>
      </section>
    </div>
  );
}
