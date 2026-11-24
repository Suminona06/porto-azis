import { describe, expect, it } from 'vitest';
import {
  EDITORIAL_EASE_POINTS,
  TECH_ACCORDION_EASE_POINTS,
  createCubicBezierEase,
  editorialEase,
  prefersReducedMotion,
  techAccordionEase,
} from '../../src/lib/motion/easing';
import { formatJakartaTime12h } from '../../src/lib/motion/clock';
import {
  ALPHABET_CHARSET,
  CIPHER_ALPHABET,
  SYMBOL_CIPHER_CHARSET,
  computeAlphabetDecodeFrame,
  computeCipherFrame,
  computeSeededWordDelays,
  computeSymbolCipherFrame,
  computeTrailingScrambleFrame,
} from '../../src/lib/motion/text-scramble';
import { resolveRowEdge } from '../../src/lib/motion/selected-work-motion';
import {
  DEFAULT_BLOCK_MASK_DURATION_MS,
  DEFAULT_CIPHER_DURATION_MS,
  DEFAULT_IMAGE_CURTAIN_DURATION_MS,
  getBlockMaskPhaseDurations,
} from '../../src/lib/motion/primitives';
import {
  TECH_ACCORDION_DURATION_SEC,
  TECH_ACCORDION_STAGGER_SEC,
  computeJourneyWordOpacity,
} from '../../src/lib/motion/about-motion';

describe('editorial cubic-bezier easing', () => {
  it('uses [0.77, 0, 0.175, 1] control points and satisfies boundary and monotonic progression', () => {
    expect(EDITORIAL_EASE_POINTS).toEqual([0.77, 0, 0.175, 1]);
    expect(editorialEase(-0.2)).toBe(0);
    expect(editorialEase(0)).toBe(0);
    expect(editorialEase(1)).toBe(1);
    expect(editorialEase(1.4)).toBe(1);

    const early = editorialEase(0.2);
    const mid = editorialEase(0.5);
    const late = editorialEase(0.8);

    expect(early).toBeGreaterThan(0);
    expect(early).toBeLessThan(0.2);
    expect(mid).toBeGreaterThan(early);
    expect(mid).toBeLessThan(late);
    expect(late).toBeGreaterThan(0.8);
    expect(late).toBeLessThan(1);
  });

  it('matches linear progression for linear control points', () => {
    const linear = createCubicBezierEase(0, 0, 1, 1);
    expect(linear(0.25)).toBeCloseTo(0.25, 5);
    expect(linear(0.5)).toBeCloseTo(0.5, 5);
    expect(linear(0.75)).toBeCloseTo(0.75, 5);
  });

  it('safely defaults prefersReducedMotion to false in non-browser SSR/Node contexts', () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe('formatJakartaTime12h', () => {
  it('formats midnight, morning, noon, and late night in hh:mm A (GMT +7)', () => {
    expect(formatJakartaTime12h(new Date('2026-11-14T17:05:00Z'))).toBe('12:05 AM (GMT +7)');
    expect(formatJakartaTime12h(new Date('2026-11-15T00:09:00Z'))).toBe('07:09 AM (GMT +7)');
    expect(formatJakartaTime12h(new Date('2026-11-15T05:00:00Z'))).toBe('12:00 PM (GMT +7)');
    expect(formatJakartaTime12h(new Date('2026-11-15T12:45:00Z'))).toBe('07:45 PM (GMT +7)');
    expect(formatJakartaTime12h(new Date('2026-11-15T16:59:00Z'))).toBe('11:59 PM (GMT +7)');
  });
});

describe('text scramble frames', () => {
  it('decodes left-to-right using A-Z0-9 glyphs while preserving whitespace and converging cleanly', () => {
    const target = 'AZIS MUHAMAD';
    const glyphPicker = (idx: number) => CIPHER_ALPHABET[idx % CIPHER_ALPHABET.length] ?? 'A';

    const startFrame = computeCipherFrame(target, 0, glyphPicker);
    expect(startFrame.length).toBe(target.length);
    expect(startFrame[4]).toBe(' ');
    expect(startFrame).toMatch(/^[A-Z0-9]{4} [A-Z0-9]{7}$/);

    const midFrame = computeCipherFrame(target, 0.5, glyphPicker);
    expect(midFrame.slice(0, 6)).toBe('AZIS M');
    expect(midFrame[4]).toBe(' ');
    expect(midFrame.length).toBe(target.length);

    expect(computeCipherFrame(target, 1, glyphPicker)).toBe(target);
    expect(computeCipherFrame(target, 1.3, glyphPicker)).toBe(target);
  });

  it('scrambles only trailing characters and resolves back to the exact original location string', () => {
    const location = 'BOGOR, INDONESIA';
    const numericGlyphs = (idx: number) => String((idx + 3) % 10);

    const midScramble = computeTrailingScrambleFrame(location, 0, numericGlyphs);
    expect(midScramble.startsWith('BOGOR, IND')).toBe(true);
    expect(midScramble.length).toBe(location.length);
    expect(midScramble).not.toBe(location);

    const lateScramble = computeTrailingScrambleFrame(location, 0.5, numericGlyphs);
    expect(lateScramble.startsWith('BOGOR, INDONE')).toBe(true);
    expect(lateScramble.length).toBe(location.length);

    expect(computeTrailingScrambleFrame(location, 1, numericGlyphs)).toBe(location);
  });

  it('decodes left-to-right using uppercase A-Z alphabet charset for Hero name', () => {
    const target = 'AZIS MUHAMAD FADLI';
    const alphaPicker = (idx: number) => ALPHABET_CHARSET[idx % ALPHABET_CHARSET.length] ?? 'A';

    const start = computeAlphabetDecodeFrame(target, 0, alphaPicker);
    expect(start.length).toBe(target.length);
    expect(start[4]).toBe(' ');
    expect(start[12]).toBe(' ');
    expect(start).toMatch(/^[A-Z]{4} [A-Z]{7} [A-Z]{5}$/);

    // During initial 15% shimmer hold, text stays scrambled while preserving spaces
    const hold = computeAlphabetDecodeFrame(target, 0.1, alphaPicker);
    expect(hold.length).toBe(target.length);
    expect(hold[4]).toBe(' ');

    // Mid-resolve progressively locks in left-to-right
    const mid = computeAlphabetDecodeFrame(target, 0.6, alphaPicker);
    expect(mid.startsWith('AZIS MUHAMAD')).toBe(true);
    expect(computeAlphabetDecodeFrame(target, 1, alphaPicker)).toBe(target);
  });

  it('scrambles all non-space characters with pure ASCII punctuation symbols and snaps 100% back on completion', () => {
    const target = 'DOCKER, PROMETHEUS, GRAFANA';
    const symbolPicker = (idx: number) =>
      SYMBOL_CIPHER_CHARSET[idx % SYMBOL_CIPHER_CHARSET.length] ?? '#';

    expect(SYMBOL_CIPHER_CHARSET).not.toMatch(/[A-Za-z0-9]/);

    const start = computeSymbolCipherFrame(target, 0, symbolPicker);
    expect(start.length).toBe(target.length);
    expect(start[7]).toBe(' ');
    expect(start[19]).toBe(' ');
    expect(start).not.toMatch(/[A-Za-z0-9]/);

    // Throughout the burst (progress < 1), all non-space characters stay scrambled simultaneously
    const lateBurst = computeSymbolCipherFrame(target, 0.9, symbolPicker);
    expect(lateBurst.length).toBe(target.length);
    expect(lateBurst[7]).toBe(' ');
    expect(lateBurst[19]).toBe(' ');
    expect(lateBurst).not.toMatch(/[A-Za-z0-9]/);

    // At progress >= 1 (t >= 400ms), snaps 100% back to the exact original text simultaneously
    expect(computeSymbolCipherFrame(target, 1, symbolPicker)).toBe(target);
  });

  it('resolves direction-aware vertical edges for row-to-row and external list entry/exit', () => {
    const rect = { top: 100, height: 120 }; // midpoint = 160

    // Moving down across rows: Row 0 -> Row 1
    expect(resolveRowEdge({ mode: 'leave', currentIndex: 0, otherIndex: 1, clientY: 220, rect })).toBe('bottom');
    expect(resolveRowEdge({ mode: 'enter', currentIndex: 1, otherIndex: 0, clientY: 220, rect })).toBe('top');

    // Moving up across rows: Row 2 -> Row 1
    expect(resolveRowEdge({ mode: 'leave', currentIndex: 2, otherIndex: 1, clientY: 105, rect })).toBe('top');
    expect(resolveRowEdge({ mode: 'enter', currentIndex: 1, otherIndex: 2, clientY: 215, rect })).toBe('bottom');

    // Entering/exiting from outside the list using cursor vs row midpoint
    expect(resolveRowEdge({ mode: 'enter', currentIndex: 0, otherIndex: null, clientY: 110, rect })).toBe('top');
    expect(resolveRowEdge({ mode: 'leave', currentIndex: 0, otherIndex: null, clientY: 110, rect })).toBe('top');
    expect(resolveRowEdge({ mode: 'enter', currentIndex: 3, otherIndex: null, clientY: 210, rect })).toBe('bottom');
    expect(resolveRowEdge({ mode: 'leave', currentIndex: 3, otherIndex: null, clientY: 210, rect })).toBe('bottom');
  });

  it('generates deterministic non-sequential seeded word delays within [0, 900ms]', () => {
    const delaysA = computeSeededWordDelays(18, 900);
    const delaysB = computeSeededWordDelays(18, 900);
    expect(delaysA).toEqual(delaysB);
    expect(delaysA).toHaveLength(18);
    for (const d of delaysA) {
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(900);
    }

    // Must not be monotonically sorted left-to-right
    const isSortedAsc = delaysA.every((val, i) => i === 0 || delaysA[i - 1]! <= val);
    expect(isSortedAsc).toBe(false);
  });
});

describe('shared motion primitives timing', () => {
  it('defines reference default durations (800ms cipher, 700ms block mask, 700ms image curtain)', () => {
    expect(DEFAULT_CIPHER_DURATION_MS).toBe(800);
    expect(DEFAULT_BLOCK_MASK_DURATION_MS).toBe(700);
    expect(DEFAULT_IMAGE_CURTAIN_DURATION_MS).toBe(700);
  });

  it('splits block mask expand and retract phases accurately across default and custom durations', () => {
    expect(getBlockMaskPhaseDurations()).toEqual({ expandSec: 0.35, retractSec: 0.35 });
    const homeSplit = getBlockMaskPhaseDurations(950, 0.45 / 0.95);
    expect(homeSplit.expandSec).toBeCloseTo(0.45, 3);
    expect(homeSplit.retractSec).toBeCloseTo(0.5, 3);
  });

  it('computes reversible scroll-scrubbed journey word opacity from dimmed to full contrast', () => {
    expect(computeJourneyWordOpacity(0, 60, 0)).toBeCloseTo(0.22, 2);
    expect(computeJourneyWordOpacity(59, 60, 0)).toBeCloseTo(0.22, 2);
    expect(computeJourneyWordOpacity(0, 60, 0.5)).toBe(1);
    expect(computeJourneyWordOpacity(59, 60, 0.5)).toBeCloseTo(0.22, 2);
    expect(computeJourneyWordOpacity(59, 60, 1)).toBe(1);
  });

  it('defines [0.22, 1, 0.36, 1] easing and 380ms / 25ms Tech Stack accordion timing', () => {
    expect(TECH_ACCORDION_EASE_POINTS).toEqual([0.22, 1, 0.36, 1]);
    expect(techAccordionEase(0)).toBe(0);
    expect(techAccordionEase(1)).toBe(1);
    expect(techAccordionEase(0.3)).toBeGreaterThan(0.5);
    expect(TECH_ACCORDION_DURATION_SEC).toBe(0.38);
    expect(TECH_ACCORDION_STAGGER_SEC).toBe(0.025);
  });
});
