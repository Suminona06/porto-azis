import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

function readEnv(key: string): string {
  const fromVite = (import.meta.env as Record<string, string | undefined>)[key];
  const fromProcess = typeof process !== 'undefined' ? process.env[key] : undefined;
  return (fromVite || fromProcess || '').trim();
}

export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = readEnv('PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('PUBLIC_SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
  } catch {
    return null;
  }
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/** Creates an HTTP-only cookie-backed Supabase SSR client, or null if env vars are missing. */
export function createSupabaseServerClient(
  request: Request,
  cookies: AstroCookies,
): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: import.meta.env.PROD,
          });
        }
      },
    },
  });
}

export async function getAuthenticatedUser(
  client: SupabaseClient | null,
): Promise<{ id: string; email?: string } | null> {
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? undefined,
    };
  } catch {
    return null;
  }
}

