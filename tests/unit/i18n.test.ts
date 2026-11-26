import { describe, expect, it } from 'vitest';
import {
  getUiCopy,
  normalizeSentenceCase,
  pickLocale,
  resolveLocale,
  splitHeadlineLockup,
  splitInterestParagraphs,
  splitJourneyParagraphs,
} from '../../src/lib/content/i18n';
import { PLACEHOLDER_ABOUT } from '../../src/lib/content/placeholder';

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

describe('About page headline & journey helpers', () => {
  it('splits explicit 2-line headlines and falls back cleanly on legacy long bio sentences', () => {
    expect(
      splitHeadlineLockup('AZIS MUHAMAD FADLI\nCLOUD & DEVOPS ENGINEER', 'FALLBACK 1', 'FALLBACK 2'),
    ).toEqual(['AZIS MUHAMAD FADLI', 'CLOUD & DEVOPS ENGINEER']);

    expect(
      splitHeadlineLockup('Pragmatic Systems | Repeatable Ops', 'FALLBACK 1', 'FALLBACK 2'),
    ).toEqual(['PRAGMATIC SYSTEMS', 'REPEATABLE OPS']);

    expect(
      splitHeadlineLockup(
        '[PLACEHOLDER] Azis Muhamad Fadli is an IT Support, DevOps, and Cloud Engineer focused on pragmatic systems.',
        'AZIS MUHAMAD FADLI',
        'IT SUPPORT, DEVOPS & CLOUD ENGINEER',
      ),
    ).toEqual(['AZIS MUHAMAD FADLI', 'IT SUPPORT, DEVOPS & CLOUD ENGINEER']);
  });

  it('splits default EN and ID journey placeholder narratives into 3 balanced paragraphs', () => {
    const enParagraphs = splitJourneyParagraphs(PLACEHOLDER_ABOUT.sections.journey_en);
    const idParagraphs = splitJourneyParagraphs(PLACEHOLDER_ABOUT.sections.journey_id);
    expect(enParagraphs).toHaveLength(3);
    expect(idParagraphs).toHaveLength(3);
    for (const p of [...enParagraphs, ...idParagraphs]) {
      expect(p).not.toContain('—');
    }

    // Handles escaped \\n\\n sequences stored from SQL seeds without raw E'' literals
    const escaped = splitJourneyParagraphs('First paragraph.\\n\\nSecond paragraph.\\n\\nThird paragraph.');
    expect(escaped).toEqual(['First paragraph.', 'Second paragraph.', 'Third paragraph.']);
  });

  it('normalizes legacy ALL-CAPS philosophy copy to sentence-case while preserving mixed-case CMS copy', () => {
    expect(
      normalizeSentenceCase(
        '[SAMPLE] CLEAR RUNBOOKS, VERSIONED INFRASTRUCTURE, AND HONEST MONITORING REDUCE INCIDENT STRESS.',
      ),
    ).toBe('Clear runbooks, versioned infrastructure, and honest monitoring reduce incident stress.');
    expect(
      normalizeSentenceCase('I build resilient AWS and CI/CD pipelines with clear runbooks.'),
    ).toBe('I build resilient AWS and CI/CD pipelines with clear runbooks.');
  });

  it('splits default EN and ID personal interest copy into 2 clean paragraphs without placeholder tags', () => {
    const enPair = splitInterestParagraphs(PLACEHOLDER_ABOUT.sections.interest_en);
    const idPair = splitInterestParagraphs(PLACEHOLDER_ABOUT.sections.interest_id);
    expect(enPair[0]).toBeTruthy();
    expect(enPair[1]).toBeTruthy();
    expect(idPair[0]).toBeTruthy();
    expect(idPair[1]).toBeTruthy();
    for (const p of [...enPair, ...idPair]) {
      expect(p).not.toContain('[PLACEHOLDER]');
      expect(p).not.toContain('[SAMPLE]');
      expect(p).not.toContain('—');
    }

    expect(
      splitInterestParagraphs(
        '[SAMPLE] Homelab notes with Proxmox.',
        'Downtime reading and focus reset.',
      ),
    ).toEqual(['Homelab notes with Proxmox.', 'Downtime reading and focus reset.']);
  });
});

