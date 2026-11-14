export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

/** Accepts only http:, https:, or mailto: links for public CTAs and references. */
export function isSafeExternalUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:';
  } catch {
    return false;
  }
}

/** Validates rendered image URLs (remote HTTP/HTTPS or local static placeholder paths). */
export function isSafeMediaUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/placeholders/') && !trimmed.includes('..')) {
    return /^\/placeholders\/[a-z0-9._-]+$/i.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Converts user-entered titles or slugs into safe URL-friendly kebab-case slugs. */
export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export interface UploadValidationResult {
  ok: boolean;
  reason?: string;
}

/** Enforces raster image MIME allowlist and 5 MB upload ceiling. */
export function validateUploadFile(mimeType: string, sizeBytes: number): UploadValidationResult {
  const normalizedMime = mimeType.trim().toLowerCase();
  if (!ALLOWED_UPLOAD_MIME_TYPES.has(normalizedMime)) {
    return {
      ok: false,
      reason: 'Only JPEG, PNG, WebP, or AVIF images are allowed.',
    };
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return { ok: false, reason: 'Uploaded file is empty.' };
  }
  if (sizeBytes > MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'Uploaded file exceeds the 5 MB limit.' };
  }
  return { ok: true };
}

/** Estimates reading duration from markdown word count at ~200 wpm. */
export function estimateReadingMinutes(markdown: string): number {
  const cleaned = markdown.trim();
  if (!cleaned) return 1;
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function sanitizeExternalUrlOrFallback(raw: string | null | undefined, fallback: string): string {
  return isSafeExternalUrl(raw) ? raw!.trim() : fallback;
}

export function sanitizeMediaUrlOrFallback(raw: string | null | undefined, fallback: string): string {
  return isSafeMediaUrl(raw) ? raw!.trim() : fallback;
}
