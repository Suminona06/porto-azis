import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseServerClient(request, cookies);
  if (supabase) {
    await supabase.auth.signOut();
  }

  const accept = request.headers.get('Accept') || '';
  if (accept.includes('application/json')) {
    return new Response(
      JSON.stringify({ ok: true, redirectTo: '/admin/login' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return redirect('/admin/login', 302);
};

