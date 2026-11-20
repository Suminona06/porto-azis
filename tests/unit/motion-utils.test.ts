import { describe, expect, it } from 'vitest';
import {
  EDITORIAL_EASE_POINTS,
  createCubicBezierEase,
  editorialEase,
  prefersReducedMotion,
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

  it('scrambles with 2-phase pure ASCII symbol-cipher charset while preserving spaces and exact length', () => {
    const target = 'DOCKER, PROMETHEUS, GRAFANA';
    const symbolPicker = (idx: number) =>
      SYMBOL_CIPHER_CHARSET[idx % SYMBOL_CIPHER_CHARSET.length] ?? '#';

    const start = computeSymbolCipherFrame(target, 0, symbolPicker);
    expect(start.length).toBe(target.length);
    expect(start[7]).toBe(' ');
    expect(start[19]).toBe(' ');
    expect(start).not.toBe(target);

    // Phase 1 (<= 38%): full symbol cipher shimmer across all non-space characters
    const phase1 = computeSymbolCipherFrame(target, 0.3, symbolPicker);
    expect(phase1.length).toBe(target.length);
    expect(phase1.startsWith('DOCKER')).toBe(false);

    // Phase 2 (> 38%): smooth easeOutCubic left-to-right resolve
    const phase2 = computeSymbolCipherFrame(target, 0.72, symbolPicker);
    expect(phase2.startsWith('DOCKER, PROMETHEUS')).toBe(true);
    expect(phase2.length).toBe(target.length);

    expect(computeSymbolCipherFrame(target, 1, symbolPicker)).toBe(target);
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
