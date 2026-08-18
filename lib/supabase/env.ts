/**
 * Public Supabase URL + publishable (anon) key.
 * Build and CI may omit these; callers must check `isSupabaseConfigured()`.
 */
export function getSupabasePublicEnv(): {
  url: string | undefined;
  publishableKey: string | undefined;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    undefined;
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, publishableKey } = getSupabasePublicEnv();
  return Boolean(url && publishableKey);
}

export function requireSupabasePublicEnv(): {
  url: string;
  publishableKey: string;
} {
  const { url, publishableKey } = getSupabasePublicEnv();
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example)."
    );
  }
  return { url, publishableKey };
}
