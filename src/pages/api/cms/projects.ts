import type { APIRoute } from 'astro';
import { isSafeExternalUrl, isSafeMediaUrl } from '../../../lib/content/validation';
import { jsonResponse, requireCmsAuth } from '../../../lib/supabase/cmsAuth';

export const prerender = false;

function parseTechStack(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseProjectPayload(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const external_url = typeof body.external_url === 'string' ? body.external_url.trim() : '';
  const banner_url = typeof body.banner_url === 'string' ? body.banner_url.trim() : '';
  const year = typeof body.year === 'string' ? body.year.trim() : '';
  const tech_stack = parseTechStack(body.tech_stack);
  const featured_on_home = body.featured_on_home !== false;
  const sort_order = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;

  if (!title) return { error: 'Project title is required.' as const };
  if (!isSafeExternalUrl(external_url)) {
    return { error: 'External URL must begin with https://, http://, or mailto:.' as const };
  }
  if (banner_url && !isSafeMediaUrl(banner_url)) {
    return { error: 'Banner image URL must use https, http, or /placeholders/.' as const };
  }

  return {
    data: {
      title,
      external_url,
      banner_url,
      year,
      tech_stack,
      featured_on_home,
      sort_order,
    },
  };
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ projects: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ error: 'Invalid JSON payload.' }, 400);

  const parsed = parseProjectPayload(body);
  if ('error' in parsed) return jsonResponse({ error: parsed.error }, 400);

  const { data, error } = await auth.supabase
    .from('projects')
    .insert(parsed.data)
    .select('*')
    .single();

  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ project: data }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ error: 'Invalid JSON payload.' }, 400);

  if (Array.isArray(body.reorder)) {
    for (const item of body.reorder) {
      if (item && typeof item.id === 'string' && Number.isFinite(Number(item.sort_order))) {
        const { error } = await auth.supabase
          .from('projects')
          .update({ sort_order: Number(item.sort_order) })
          .eq('id', item.id);
        if (error) return jsonResponse({ error: error.message }, 400);
      }
    }
    return jsonResponse({ ok: true });
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return jsonResponse({ error: 'Project id is required.' }, 400);

  const parsed = parseProjectPayload(body);
  if ('error' in parsed) return jsonResponse({ error: parsed.error }, 400);

  const { data, error } = await auth.supabase
    .from('projects')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ project: data });
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return jsonResponse({ error: 'Project id is required.' }, 400);

  const { error } = await auth.supabase.from('projects').delete().eq('id', id);
  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ ok: true });
};
