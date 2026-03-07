import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signOut: async () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

// Check localStorage synchronously - Supabase stores session here
const STORAGE_KEY = `sb-vaabpnxwmqeonvuvvirx-auth-token`;
function hasStoredSession(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!(parsed?.access_token);
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  // Only show loading spinner if there's an existing session to restore
  const [isLoading, setIsLoading] = useState(hasStoredSession());
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafety = () => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  };

  const startSafety = () => {
    clearSafety();
    // After 5 seconds max, stop loading no matter what
    safetyTimer.current = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  // Fetch user profile from public.users using auth_id
  const fetchProfile = async (authId: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();
      setProfile(data ?? null);
    } catch (err) {
      console.error('fetchProfile error:', err);
      setProfile(null);
    } finally {
      clearSafety();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Restore existing session if any
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        startSafety();
        fetchProfile(s.user.id);
      } else {
        // No session → show login immediately, no spinner
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });

    // 2. Listen to future auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // User just logged in — show loading while we fetch their profile
          setIsLoading(true);
          startSafety();
          await fetchProfile(newSession.user.id);
        } else {
          // User logged out — clear everything, show login page immediately
          setProfile(null);
          clearSafety();
          setIsLoading(false);
        }
      }
    );

    return () => {
      clearSafety();
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    setProfile(null);
    setSession(null);
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
