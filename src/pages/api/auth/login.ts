import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(request, cookies);
  if (!supabase) {
    return new Response(
      JSON.stringify({ error: 'Supabase authentication is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let email = '';
  let password = '';
  const contentType = request.headers.get('Content-Type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>;
      email = typeof body.email === 'string' ? body.email.trim() : '';
      password = typeof body.password === 'string' ? body.password : '';
    } else {
      const form = await request.formData();
      email = String(form.get('email') || '').trim();
      password = String(form.get('password') || '');
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid login payload.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email and password are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return new Response(
      JSON.stringify({ error: 'Invalid email or password.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, redirectTo: '/admin' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};

