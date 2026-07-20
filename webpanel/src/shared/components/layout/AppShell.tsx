import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
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
    { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/admin/departments', label: 'Departments', icon: ClipboardList },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
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
  const role = user?.role ?? 'PATIENT';
  const items = navByRole[role];
  const crumbs = useMemo(() => crumbsFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

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
            <div className={styles.brandSub}>{role.toLowerCase()} console</div>
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
            <div className={styles.profileChip} title={user?.email ?? ''}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.profileMeta}>
                <strong>{user?.full_name || 'User'}</strong>
                <span>{role.toLowerCase()}</span>
              </div>
              <UserRound size={14} className={styles.profileIcon} />
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
