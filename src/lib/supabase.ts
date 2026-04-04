import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Browser-safe Supabase client (uses the public anon key from Vite env).
 * Never put the service_role key in the frontend.
 *
 * Single shared instance per tab — avoids “Multiple GoTrueClient instances” warnings
 * when the module is evaluated more than once (e.g. React Strict Mode, HMR).
 */
let browserClient: SupabaseClient | null | undefined

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient !== undefined) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    browserClient = null
    return null
  }

  browserClient = createClient(url, anonKey)
  return browserClient
}
