import type { APIRoute } from 'astro';
import { validateUploadFile } from '../../../lib/content/validation';
import { jsonResponse, requireCmsAuth } from '../../../lib/supabase/cmsAuth';

export const prerender = false;

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const ALLOWED_FOLDERS = new Set(['blog', 'projects', 'about']);

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCmsAuth(request, cookies);
  if (!auth.ok) return auth.response;

  const formData = await request.formData().catch(() => null);
  if (!formData) return jsonResponse({ error: 'Expected multipart form data.' }, 400);

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return jsonResponse({ error: 'No image file provided.' }, 400);
  }

  const check = validateUploadFile(file.type, file.size);
  if (!check.ok) {
    return jsonResponse({ error: check.reason || 'Invalid image upload.' }, 400);
  }

  const rawFolder = String(formData.get('folder') || 'blog').trim().toLowerCase();
  const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : 'blog';
  const ext = MIME_EXT[file.type.trim().toLowerCase()] || 'png';
  const objectPath = `${folder}/${crypto.randomUUID()}.${ext}`;

  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await auth.supabase.storage
    .from('portfolio-media')
    .upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return jsonResponse({ error: uploadError.message }, 400);
  }

  const { data: urlData } = auth.supabase.storage
    .from('portfolio-media')
    .getPublicUrl(objectPath);

  return jsonResponse({ url: urlData.publicUrl, path: objectPath }, 201);
};

