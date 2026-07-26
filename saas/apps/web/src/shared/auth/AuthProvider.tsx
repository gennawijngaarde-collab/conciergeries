import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createClient, type Session, type User } from '@supabase/supabase-js';
import { api } from '@/shared/api/client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const DEV_ORG_ID = import.meta.env.VITE_DEV_ORG_ID || 'org_demo';
const DEV_TOKEN = `dev:demo-user:${DEV_ORG_ID}:MANAGER`;

const TOKEN_KEY = 'pms_access_token';
const ORG_KEY = 'pms_org_id';

export const isDevMode = !(supabaseUrl && supabaseAnonKey);

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const DEV_USER = {
  id: 'demo-user',
  email: 'demo@pms.local',
  app_metadata: { role: 'MANAGER', organization_id: DEV_ORG_ID },
  user_metadata: { full_name: 'Utilisateur démo' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User;

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  accessToken: string | null;
  organizationId: string | null;
  isDevMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInDev: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchMe(token: string, organizationId: string) {
  try {
    await api.get('/api/v1/auth/me', { token, organizationId });
  } catch {
    // Optional — API may be down during local UI work
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [devUser, setDevUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function restore() {
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(data.session);
        setAccessToken(data.session?.access_token ?? null);
        const org =
          localStorage.getItem(ORG_KEY) ||
          (data.session?.user?.app_metadata as { organization_id?: string } | undefined)
            ?.organization_id ||
          DEV_ORG_ID;
        setOrganizationId(org);
        if (org) localStorage.setItem(ORG_KEY, org);
        if (data.session?.access_token) {
          localStorage.setItem(TOKEN_KEY, data.session.access_token);
          void fetchMe(data.session.access_token, org);
        }
        setLoading(false);
        return;
      }

      // Dev mode: restore from localStorage
      const token = localStorage.getItem(TOKEN_KEY);
      const org = localStorage.getItem(ORG_KEY) || DEV_ORG_ID;
      if (token) {
        setAccessToken(token);
        setOrganizationId(org);
        setDevUser(DEV_USER);
        void fetchMe(token, org);
      }
      setLoading(false);
    }

    void restore();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setAccessToken(next?.access_token ?? null);
      if (next?.access_token) {
        localStorage.setItem(TOKEN_KEY, next.access_token);
        const org =
          localStorage.getItem(ORG_KEY) ||
          (next.user?.app_metadata as { organization_id?: string } | undefined)
            ?.organization_id ||
          DEV_ORG_ID;
        setOrganizationId(org);
        localStorage.setItem(ORG_KEY, org);
        void fetchMe(next.access_token, org);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase non configuré — utilisez le mode démo.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signInDev = useCallback(async () => {
    localStorage.setItem(TOKEN_KEY, DEV_TOKEN);
    localStorage.setItem(ORG_KEY, DEV_ORG_ID);
    setAccessToken(DEV_TOKEN);
    setOrganizationId(DEV_ORG_ID);
    setDevUser(DEV_USER);
    setSession(null);
    void fetchMe(DEV_TOKEN, DEV_ORG_ID);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ORG_KEY);
    setAccessToken(null);
    setOrganizationId(null);
    setDevUser(null);
    setSession(null);
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? devUser,
      session,
      loading,
      accessToken,
      organizationId,
      isDevMode,
      signIn,
      signInDev,
      signOut,
    }),
    [session, devUser, loading, accessToken, organizationId, signIn, signInDev, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
