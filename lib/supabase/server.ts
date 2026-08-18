import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, requireSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Server Components, Server Actions, Route Handlers.
 * Cookie writes may fail in Server Components; proxy refreshes the session.
 */
export async function createClient() {
  const { url, publishableKey } = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, headers) {
        void headers;
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Called from a Server Component — proxy will persist cookies. */
        }
      },
    },
  });
}

/** Verified user, or `null` if unconfigured / signed out. */
export async function getAuthUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
