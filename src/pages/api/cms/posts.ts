import type { APIRoute } from 'astro';
import {
  estimateReadingMinutes,
  isSafeMediaUrl,
  normalizeSlug,
} from '../../../lib/content/validation';
import { jsonResponse, requireCmsAuth } from '../../../lib/supabase/cmsAuth';

export const prerender = false;

function parsePostPayload(body: Record<string, unknown>) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const rawSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug : title;
  const slug = normalizeSlug(rawSlug);
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : '';
  const content_markdown =
    typeof body.content_markdown === 'string' ? body.content_markdown : '';
  const category = typeof body.category === 'string' && body.category.trim()
    ? body.category.trim()
    : 'DevOps';
  const language = body.language === 'en' ? 'en' : 'id';
  const translation_group_id =
    typeof body.translation_group_id === 'string' && body.translation_group_id.trim()
      ? body.translation_group_id.trim()
      : null;
  const cover_image_url =
    typeof body.cover_image_url === 'string' ? body.cover_image_url.trim() : '';
  const published = Boolean(body.published);

  if (!title) return { error: 'Post title is required.' as const };
  if (!slug) return { error: 'A valid URL slug is required.' as const };
  if (!content_markdown.trim()) return { error: 'Markdown content is required.' as const };
  if (cover_image_url && !isSafeMediaUrl(cover_image_url)) {
    return { error: 'Cover image URL must use https, http, or /placeholders/.' as const };
  }

  const published_at = published
    ? typeof body.published_at === 'string' && body.published_at.trim()
      ? body.published_at.trim()
      : new Date().toISOString()
    : null;

  return {
    data: {
      title,
      slug,
      excerpt,
      content_markdown,
      category,
      language,
      translation_group_id,
      cover_image_url,
      reading_minutes: estimateReadingMinutes(content_markdown),
      published,
      published_at,
    },
  };
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ posts: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonResponse({ error: 'Invalid JSON payload.' }, 400);

  const parsed = parsePostPayload(body);
  if ('error' in parsed) return jsonResponse({ error: parsed.error }, 400);

  const { data, error } = await auth.supabase
    .from('posts')
    .insert(parsed.data)
    .select('*')
    .single();

  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ post: data }, 201);
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.id !== 'string' || !body.id.trim()) {
    return jsonResponse({ error: 'Post id is required.' }, 400);
  }

  const parsed = parsePostPayload(body);
  if ('error' in parsed) return jsonResponse({ error: parsed.error }, 400);

  const { data, error } = await auth.supabase
    .from('posts')
    .update(parsed.data)
    .eq('id', body.id.trim())
    .select('*')
    .single();

  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ post: data });
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return jsonResponse({ error: 'Post id is required.' }, 400);

  const { error } = await auth.supabase.from('posts').delete().eq('id', id);
  if (error) return jsonResponse({ error: error.message }, 400);
  return jsonResponse({ ok: true });
};

