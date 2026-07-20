import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import { fetchFullProfile, signIn as apiSignIn, signOut as apiSignOut, signUp as apiSignUp } from '@/services/authService';
import type { FullUserProfile, UserRole } from '@/types/database';

type AuthContextValue = {
  user: FullUserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role: Extract<UserRole, 'PATIENT' | 'DOCTOR'>;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const profile = await fetchFullProfile(userId);
    setUser(profile);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      await loadProfile(data.session.user.id);
    } else {
      setUser(null);
    }
  }, [loadProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data.session?.user?.id) {
          await loadProfile(data.session.user.id);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.id) {
        await loadProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        const { user: authUser } = await apiSignIn(email, password);
        if (authUser?.id) await loadProfile(authUser.id);
      },
      async signUp(params) {
        await apiSignUp(params);
        await refresh();
      },
      async signOut() {
        await apiSignOut();
        setUser(null);
      },
      refresh,
    }),
    [user, loading, loadProfile, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
