import { describe, expect, it } from 'vitest';
import {
  MAX_UPLOAD_BYTES,
  estimateReadingMinutes,
  isSafeExternalUrl,
  isSafeMediaUrl,
  normalizeSlug,
  validateUploadFile,
} from '../../src/lib/content/validation';

describe('validation utilities', () => {
  it('accepts safe external URLs and rejects unsafe schemes', () => {
    expect(isSafeExternalUrl('https://github.com/azis')).toBe(true);
    expect(isSafeExternalUrl('http://example.com')).toBe(true);
    expect(isSafeExternalUrl('mailto:azis@example.com')).toBe(true);

    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('JAVASCRIPT:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isSafeExternalUrl('/relative/path')).toBe(false);
    expect(isSafeExternalUrl('')).toBe(false);
  });

  it('validates media URLs allowing https, http, and local placeholders only', () => {
    expect(isSafeMediaUrl('https://cdn.example.com/photo.webp')).toBe(true);
    expect(isSafeMediaUrl('/placeholders/profile-placeholder.svg')).toBe(true);
    expect(isSafeMediaUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeMediaUrl('data:image/svg+xml,<svg/>')).toBe(false);
  });

  it('normalizes post slugs cleanly', () => {
    expect(normalizeSlug('  Setup AWS VPC & Bastion Host! ')).toBe('setup-aws-vpc-bastion-host');
    expect(normalizeSlug('Multi___Cluster---Notes')).toBe('multi-cluster-notes');
    expect(normalizeSlug('!!!')).toBe('');
  });

  it('validates allowed image upload MIME types and byte sizes', () => {
    expect(validateUploadFile('image/jpeg', 1024).ok).toBe(true);
    expect(validateUploadFile('image/png', 2048).ok).toBe(true);
    expect(validateUploadFile('image/webp', MAX_UPLOAD_BYTES).ok).toBe(true);
    expect(validateUploadFile('image/avif', 500_000).ok).toBe(true);

    expect(validateUploadFile('image/svg+xml', 1024).ok).toBe(false);
    expect(validateUploadFile('application/pdf', 1024).ok).toBe(false);
    expect(validateUploadFile('image/png', 0).ok).toBe(false);
    expect(validateUploadFile('image/png', MAX_UPLOAD_BYTES + 1).ok).toBe(false);
  });

  it('estimates reading time with minimum 1 minute', () => {
    expect(estimateReadingMinutes('short text')).toBe(1);
    const words450 = Array.from({ length: 450 }, () => 'word').join(' ');
    expect(estimateReadingMinutes(words450)).toBe(3);
  });
});

