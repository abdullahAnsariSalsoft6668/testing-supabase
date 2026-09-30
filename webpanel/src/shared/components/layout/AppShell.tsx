import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Pencil,
  Search,
  Stethoscope,
  Sun,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTheme } from '@/shared/theme/ThemeContext';
import { PageTransition } from '@/shared/components/motion/PageTransition';
import type { UserRole } from '@/types/database';
import styles from './AppShell.module.css';

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const navByRole: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/hospital-requests', label: 'Hospital requests', icon: Building2 },
    { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/admin/departments', label: 'Departments', icon: ClipboardList },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  ],
  HOSPITAL_ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/hospitals', label: 'My hospital', icon: Building2 },
    { to: '/admin/departments', label: 'Departments', icon: ClipboardList },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  ],
  DOCTOR: [
    { to: '/doctor', label: 'Home', icon: LayoutDashboard },
    { to: '/doctor/schedule', label: 'Schedule', icon: CalendarDays },
    { to: '/doctor/visits', label: 'Visits', icon: Users },
  ],
  PATIENT: [
    { to: '/patient', label: 'Home', icon: LayoutDashboard },
    { to: '/patient/doctors', label: 'Find care', icon: Stethoscope },
    { to: '/patient/visits', label: 'My visits', icon: CalendarDays },
    { to: '/patient/profile', label: 'Profile', icon: UserRound },
  ],
};

const COLLAPSE_KEY = 'carehub.web.sidebarCollapsed';

function crumbsFromPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [{ label: 'Home', to: '/' }];
  return parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
    to: `/${parts.slice(0, i + 1).join('/')}`,
  }));
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const role = user?.role ?? 'PATIENT';
  const hospitalName = user?.hospital?.name?.trim() || null;
  const brandSub =
    role === 'HOSPITAL_ADMIN'
      ? hospitalName ?? 'Hospital console'
      : role === 'ADMIN'
        ? 'Platform console'
        : `${role.toLowerCase()} console`;
  const profileRole =
    role === 'HOSPITAL_ADMIN' ? hospitalName ?? 'Hospital admin' : role.toLowerCase();
  const items = navByRole[role];
  const crumbs = useMemo(() => crumbsFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const initials = (user?.full_name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navLinks = (
    <nav className={styles.nav} aria-label="Main">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            title={item.label}
            className={({ isActive }) =>
              [styles.link, isActive ? styles.linkActive : ''].join(' ')
            }
          >
            <Icon size={18} />
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <>
      <div className={styles.brand}>
        <div className={styles.logo}>+</div>
        {!collapsed ? (
          <div className={styles.brandText}>
            <div className={styles.brandName}>CareHub</div>
            <div className={styles.brandSub}>{brandSub}</div>
          </div>
        ) : null}
        <button
          type="button"
          className={styles.closeMenu}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {navLinks}

      <div className={styles.footer}>
        {!collapsed ? (
          <div className={styles.userChip}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>{user?.full_name || 'User'}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        ) : (
          <div className={styles.avatarCompact} title={user?.full_name || 'User'}>
            {initials}
          </div>
        )}
        <button
          type="button"
          className={styles.logout}
          onClick={() => void handleSignOut()}
          title="Sign out"
        >
          <LogOut size={16} />
          {!collapsed ? <span>Sign out</span> : null}
        </button>
      </div>
    </>
  );

  return (
    <div
      className={`app-mesh ${styles.shell} ${collapsed ? styles.shellCollapsed : ''}`}
    >
      <header className={styles.mobileBar}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className={styles.mobileBrand}>
          <span className={styles.mobileLogo}>+</span>
          <span>CareHub</span>
        </div>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <aside className={styles.sidebarDesktop} aria-label="Sidebar">
        {sidebarInner}
        <button
          type="button"
          className={styles.collapseBtn}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              className={styles.backdrop}
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className={styles.sidebarDrawer}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            >
              <div className={styles.drawerExpanded}>{sidebarInner}</div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <main className={styles.main}>
        <header className={[styles.topbar, scrolled ? styles.topbarScrolled : ''].join(' ')}>
          <div className={styles.topbarLeft}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={c.to} className={styles.crumb}>
                  {i > 0 ? <span className={styles.crumbSep}>/</span> : null}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page">{c.label}</span>
                  ) : (
                    <Link to={c.to}>{c.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <label className={styles.search}>
            <Search size={16} aria-hidden />
            <input
              type="search"
              placeholder="Search CareHub…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
          </label>

          <div className={styles.topbarRight}>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <Bell size={18} />
              <span className={styles.dot} />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className={styles.accountWrap} ref={accountRef}>
              <button
                type="button"
                className={[styles.profileChip, accountOpen ? styles.profileChipOpen : ''].join(' ')}
                title={user?.email ?? 'Account'}
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <div className={styles.avatar}>{initials}</div>
                <div className={styles.profileMeta}>
                  <strong>{user?.full_name || 'User'}</strong>
                  <span>{profileRole}</span>
                </div>
                <ChevronDown size={14} className={styles.profileIcon} />
              </button>
              {accountOpen ? (
                <div className={styles.accountMenu} role="menu">
                  <div className={styles.accountMenuHead}>
                    <div className={styles.avatar}>{initials}</div>
                    <div>
                      <strong>{user?.full_name || 'User'}</strong>
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  {role === 'PATIENT' ? (
                    <Link
                      to="/patient/profile"
                      className={styles.accountMenuItem}
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Pencil size={16} />
                      Edit profile
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={styles.accountMenuItem}
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      void handleSignOut();
                    }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>

      <nav className={styles.bottomNav} aria-label="Primary">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length <= 2}
              className={({ isActive }) =>
                [styles.bottomLink, isActive ? styles.bottomLinkActive : ''].join(' ')
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
