import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, Mail, MapPin, UserRound } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { homePath } from '@/features/auth/roleHome';
import { AuthBrandPanel } from '@/features/auth/AuthBrandPanel';
import { signUpHospital } from '@/services/authService';
import { FullPageLoader } from '@/shared/components/ui/Shimmer';
import { Field, Select } from '@/shared/components/ui/Field';
import loginStyles from './LoginPage.module.css';

const US_CLINIC_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern (NY, FL, GA, …)' },
  { value: 'America/Chicago', label: 'Central (IL, TX, …)' },
  { value: 'America/Denver', label: 'Mountain (CO, UT, …)' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)' },
  { value: 'America/Los_Angeles', label: 'Pacific (CA, WA, …)' },
  { value: 'America/Anchorage', label: 'Alaska' },
  { value: 'Pacific/Honolulu', label: 'Hawaii' },
] as const;

export function HospitalApplyPage() {
  const { user, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <FullPageLoader label="Preparing CareHub…" />;
  if (user) return <Navigate to={homePath(user)} replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signUpHospital({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        hospitalName: hospitalName.trim(),
        hospitalAddress: address.trim() || undefined,
        hospitalTimezone: timezone,
      });
      await refresh();
      navigate('/hospital/pending');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={loginStyles.page}>
      <AuthBrandPanel
        badge="Hospitals"
        headline="Apply to run your clinic on CareHub."
        description="Create an account for your hospital. CareHub reviews the request, then you add doctors and departments."
      />
      <section className={loginStyles.authCol} aria-label="Hospital application">
        <motion.div
          className={loginStyles.cardWrap}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <form className={loginStyles.card} onSubmit={onSubmit} noValidate>
            <header className={loginStyles.cardHeader}>
              <h2>Hospital application</h2>
              <p className={loginStyles.subtitle}>We’ll notify you when CareHub approves your clinic.</p>
            </header>

            <div className={loginStyles.field}>
              <label className={loginStyles.label} htmlFor="ha-name">
                Your name
              </label>
              <div className={loginStyles.inputShell}>
                <UserRound className={loginStyles.inputIcon} size={18} aria-hidden />
                <input
                  id="ha-name"
                  className={loginStyles.input}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
            <div className={loginStyles.field}>
              <label className={loginStyles.label} htmlFor="ha-email">
                Work email
              </label>
              <div className={loginStyles.inputShell}>
                <Mail className={loginStyles.inputIcon} size={18} aria-hidden />
                <input
                  id="ha-email"
                  className={loginStyles.input}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className={loginStyles.field}>
              <label className={loginStyles.label} htmlFor="ha-password">
                Password
              </label>
              <div className={loginStyles.inputShell}>
                <Lock className={loginStyles.inputIcon} size={18} aria-hidden />
                <input
                  id="ha-password"
                  className={loginStyles.input}
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className={loginStyles.field}>
              <label className={loginStyles.label} htmlFor="ha-hospital">
                Hospital name
              </label>
              <div className={loginStyles.inputShell}>
                <Building2 className={loginStyles.inputIcon} size={18} aria-hidden />
                <input
                  id="ha-hospital"
                  className={loginStyles.input}
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="City General Hospital"
                />
              </div>
            </div>
            <div className={loginStyles.field}>
              <label className={loginStyles.label} htmlFor="ha-address">
                Address
              </label>
              <div className={loginStyles.inputShell}>
                <MapPin className={loginStyles.inputIcon} size={18} aria-hidden />
                <input
                  id="ha-address"
                  className={loginStyles.input}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Austin, TX"
                />
              </div>
            </div>
            <Field label="Timezone">
              <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {US_CLINIC_TIMEZONES.map((z) => (
                  <option key={z.value} value={z.value}>
                    {z.label}
                  </option>
                ))}
              </Select>
            </Field>

            {error ? (
              <div className={loginStyles.error} role="alert">
                {error}
              </div>
            ) : null}

            <button type="submit" className={loginStyles.submit} disabled={busy}>
              {busy ? <span className={loginStyles.spinner} aria-hidden /> : null}
              {busy ? 'Submitting…' : 'Submit application'}
            </button>

            <p className={loginStyles.create}>
              Already have an account? <Link to="/login">Sign in</Link>
              <br />
              Patient or doctor? <Link to="/register">Create account</Link>
            </p>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
