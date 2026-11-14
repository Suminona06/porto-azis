import { describe, expect, it } from 'vitest';
import { getUiCopy, pickLocale, resolveLocale } from '../../src/lib/content/i18n';

describe('resolveLocale', () => {
  it('defaults to en for null or unsupported values', () => {
    expect(resolveLocale(undefined)).toBe('en');
    expect(resolveLocale(null)).toBe('en');
    expect(resolveLocale('fr')).toBe('en');
  });

  it('accepts id and en explicitly', () => {
    expect(resolveLocale('id')).toBe('id');
    expect(resolveLocale('EN')).toBe('en');
  });
});

describe('pickLocale', () => {
  it('returns requested locale text when populated', () => {
    expect(pickLocale('Cloud Engineer', 'Insinyur Cloud', 'id')).toBe('Insinyur Cloud');
    expect(pickLocale('Cloud Engineer', 'Insinyur Cloud', 'en')).toBe('Cloud Engineer');
  });

  it('falls back to available non-empty locale when requested translation is blank', () => {
    expect(pickLocale('Cloud Engineer', '', 'id')).toBe('Cloud Engineer');
    expect(pickLocale(null, 'Catatan Infrastruktur', 'en')).toBe('Catatan Infrastruktur');
    expect(pickLocale('   ', '   ', 'en')).toBe('');
  });
});

describe('getUiCopy', () => {
  it('contains no em dash characters in EN or ID UI strings', () => {
    const enValues = Object.values(getUiCopy('en'));
    const idValues = Object.values(getUiCopy('id'));
    for (const text of [...enValues, ...idValues]) {
      expect(text).not.toContain('—');
    }
  });

  it('keeps directional arrow on contact CTAs', () => {
    expect(getUiCopy('en').homeCtaButton).toContain('→');
    expect(getUiCopy('id').homeCtaButton).toContain('→');
  });
});

