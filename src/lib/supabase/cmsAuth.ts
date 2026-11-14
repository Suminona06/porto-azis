import type { SupabaseClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';
import { createSupabaseServerClient, getAuthenticatedUser } from './server';

export type CmsAuthResult =
  | { ok: true; supabase: SupabaseClient; user: { id: string; email?: string } }
  | { ok: false; response: Response };

export function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Verifies Supabase configuration and active owner session for CMS API mutations. */
export async function requireCmsAuth(
  request: Request,
  cookies: AstroCookies,
): Promise<CmsAuthResult> {
  const supabase = createSupabaseServerClient(request, cookies);
  if (!supabase) {
    return {
      ok: false,
      response: jsonResponse({ error: 'Unauthorized: Supabase session required.' }, 401),
    };
  }

  const user = await getAuthenticatedUser(supabase);
  if (!user) {
    return {
      ok: false,
      response: jsonResponse({ error: 'Unauthorized' }, 401),
    };
  }

  return { ok: true, supabase, user };
}

