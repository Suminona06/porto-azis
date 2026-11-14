import type { APIRoute } from 'astro';
import { renderCozyMarkdown } from '../../../lib/content/markdown';
import { jsonResponse, requireCmsAuth } from '../../../lib/supabase/cmsAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const markdown = typeof body?.markdown === 'string' ? body.markdown : '';
  const rendered = await renderCozyMarkdown(markdown);
  return jsonResponse({ html: rendered.html, toc: rendered.toc });
};

