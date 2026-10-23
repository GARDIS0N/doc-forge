import { createClient, SupabaseClient } from '@supabase/supabase-js';

const RUNTIME_SUPABASE_URL_KEY = 'docforge_runtime_supabase_url';
const RUNTIME_SUPABASE_ANON_KEY = 'docforge_runtime_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseCredentials(): { url: string; anonKey: string; isRuntime: boolean } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, isRuntime: false };
  }

  if (typeof window !== 'undefined') {
    const runtimeUrl = localStorage.getItem(RUNTIME_SUPABASE_URL_KEY) || '';
    const runtimeKey = localStorage.getItem(RUNTIME_SUPABASE_ANON_KEY) || '';
    if (runtimeUrl && runtimeKey) {
      return { url: runtimeUrl, anonKey: runtimeKey, isRuntime: true };
    }
  }

  return { url: '', anonKey: '', isRuntime: false };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (cachedClient && lastUrl === url && lastKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    lastUrl = url;
    lastKey = anonKey;
    return cachedClient;
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
    return null;
  }
}

export function saveRuntimeCredentials(url: string, anonKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(RUNTIME_SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(RUNTIME_SUPABASE_ANON_KEY, anonKey.trim());
    cachedClient = null; // force re-creation
    return true;
  } catch (e) {
    console.error('Failed to save Supabase credentials to localStorage:', e);
    return false;
  }
}

export function clearRuntimeCredentials(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RUNTIME_SUPABASE_URL_KEY);
    localStorage.removeItem(RUNTIME_SUPABASE_ANON_KEY);
    cachedClient = null;
  } catch (e) {
    console.error('Failed to clear Supabase credentials:', e);
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const testUrl = url || getSupabaseCredentials().url;
    const testKey = anonKey || getSupabaseCredentials().anonKey;

    if (!testUrl || !testKey) {
      return { success: false, message: 'URL and Anon Key must be provided.' };
    }

    const testClient = createClient(testUrl, testKey, {
      auth: { persistSession: false },
    });

    // Test a basic auth ping
    const { error } = await testClient.auth.getSession();
    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Successfully connected to Supabase project!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection test failed.' };
  }
}
