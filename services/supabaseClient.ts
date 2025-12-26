
import { createClient } from '@supabase/supabase-js';

// Fix: Use type assertion on window to access process.env and avoid TypeScript property errors on the Window type.
const SUPABASE_URL = (window as any).process?.env?.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = (window as any).process?.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

let client;

try {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("[GARRETT] Supabase configuration missing. Database features may be limited.");
  }
  client = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (err) {
  console.error("[GARRETT] Failed to initialize Supabase client:", err);
  // Fallback para evitar crash total
  client = {
    auth: { signOut: () => {}, signUp: () => ({ error: 'offline' }), signInWithPassword: () => ({ error: 'offline' }) },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: () => ({ data: null, error: null }) }) }), insert: () => ({ error: null }) })
  } as any;
}

export const supabase = client;
