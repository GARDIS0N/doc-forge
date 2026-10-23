'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  getSupabase,
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveRuntimeCredentials,
  clearRuntimeCredentials,
  testSupabaseConnection,
} from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

export type AuthTab = 'signin' | 'signup' | 'demo' | 'settings' | 'forgot';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  authModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }>;
  signInDemo: (email?: string, fullName?: string) => void;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateSupabaseConfig: (url: string, key: string) => Promise<{ success: boolean; error?: string }>;
  clearSupabaseConfig: () => void;
}

const DEMO_USER_KEY = 'docforge_demo_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('signin');

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const configured = isSupabaseConfigured();
      if (mounted) setIsConfigured(configured);

      if (configured) {
        const supabase = getSupabase();
        if (supabase) {
          try {
            const { data } = await supabase.auth.getSession();
            if (mounted && data?.session?.user) {
              setSession(data.session);
              const suUser = data.session.user;
              setUser({
                id: suUser.id,
                email: suUser.email || '',
                fullName: suUser.user_metadata?.full_name || suUser.email?.split('@')[0],
                avatarUrl: suUser.user_metadata?.avatar_url,
                isDemo: false,
              });
              setIsLoading(false);
              return;
            }
          } catch (err) {
            console.warn('Error fetching Supabase session:', err);
          }

          // Listen for Supabase auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (!mounted) return;
            setSession(newSession);
            if (newSession?.user) {
              setUser({
                id: newSession.user.id,
                email: newSession.user.email || '',
                fullName: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0],
                avatarUrl: newSession.user.user_metadata?.avatar_url,
                isDemo: false,
              });
            } else {
              setUser(null);
            }
          });

          if (mounted) setIsLoading(false);
          return () => {
            authListener?.subscription?.unsubscribe();
          };
        }
      }

      // Check if user has an active demo session in localStorage
      if (typeof window !== 'undefined') {
        try {
          const savedDemo = localStorage.getItem(DEMO_USER_KEY);
          if (savedDemo && mounted) {
            setUser(JSON.parse(savedDemo));
          }
        } catch (e) {
          console.warn('Could not read demo auth state:', e);
        }
      }

      if (mounted) setIsLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const openAuthModal = (tab: AuthTab = 'signin') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Please configure your project keys or use Demo Mode.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          avatarUrl: data.user.user_metadata?.avatar_url,
          isDemo: false,
        });
        setSession(data.session);
        // Clear any demo user
        if (typeof window !== 'undefined') {
          localStorage.removeItem(DEMO_USER_KEY);
        }
        closeAuthModal();
        return { success: true };
      }

      return { success: false, error: 'Unknown authentication error' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign in' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured. Please configure your project keys.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If Supabase has email confirmation enabled, user session won't be active immediately
      if (data.user && !data.session) {
        return {
          success: true,
          confirmationRequired: true,
        };
      }

      if (data.user && data.session) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          fullName: fullName || data.user.email?.split('@')[0],
          isDemo: false,
        });
        setSession(data.session);
        closeAuthModal();
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to sign up' };
    }
  };

  const signInDemo = (
    email: string = 'demo.architect@docforge.io',
    fullName: string = 'David Kimani'
  ) => {
    const demoUser: AuthUser = {
      id: 'demo-user-docforge-2026',
      email,
      fullName,
      isDemo: true,
    };
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    }
    closeAuthModal();
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUser(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Password reset request failed' };
    }
  };

  const updateSupabaseConfig = async (url: string, key: string): Promise<{ success: boolean; error?: string }> => {
    const test = await testSupabaseConnection(url, key);
    if (!test.success) {
      return { success: false, error: test.message };
    }

    const saved = saveRuntimeCredentials(url, key);
    if (saved) {
      setIsConfigured(true);
      return { success: true };
    }
    return { success: false, error: 'Failed to save configuration.' };
  };

  const clearSupabaseConfig = () => {
    clearRuntimeCredentials();
    setIsConfigured(isSupabaseConfigured());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInDemo,
        signOut,
        resetPassword,
        updateSupabaseConfig,
        clearSupabaseConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
