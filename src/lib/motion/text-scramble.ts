/**
 * Left-to-right A-Z0-9 cipher decode and trailing-character hover scramble utilities.
 */

export const CIPHER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomGlyph(): string {
  const idx = Math.floor(Math.random() * CIPHER_ALPHABET.length);
  return CIPHER_ALPHABET[idx] ?? 'X';
}

/**
 * Computes a single progressive left-to-right cipher frame for `target`.
 * Guarantees exact `target` convergence at `progress >= 1` and preserves all whitespace positions.
 */
export function computeCipherFrame(
  target: string,
  progress: number,
  pickGlyph: (index: number) => string = randomGlyph,
): string {
  if (progress >= 1 || target.length === 0) {
    return target;
  }

  const clamped = Math.max(0, progress);
  const resolvedCount = Math.floor(clamped * target.length);
  let output = '';

  for (let i = 0; i < target.length; i += 1) {
    const ch = target[i];
    if (/\s/.test(ch) || i < resolvedCount) {
      output += ch;
    } else {
      output += pickGlyph(i);
    }
  }

  return output;
}

/**
 * Computes a single frame where leading characters stay anchored and trailing characters
 * scramble before resolving left-to-right back into `original`.
 */
export function computeTrailingScrambleFrame(
  original: string,
  progress: number,
  pickGlyph: (index: number) => string = randomGlyph,
): string {
  if (progress >= 1 || original.length === 0) {
    return original;
  }

  const clamped = Math.max(0, progress);
  const anchorStart =
    original.length <= 4 ? 0 : Math.min(original.length - 3, Math.floor(original.length * 0.625));
  const trailingLen = original.length - anchorStart;
  const resolvedEnd = anchorStart + Math.floor(clamped * trailingLen);

  let output = '';
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    if (/\s/.test(ch) || i < resolvedEnd) {
      output += ch;
    } else {
      output += pickGlyph(i);
    }
  }

  return output;
}

export interface ScrambleOptions {
  durationMs?: number;
  frameIntervalMs?: number;
  onComplete?: () => void;
}

function runFrameLoop(
  element: HTMLElement,
  originalText: string,
  durationMs: number,
  frameIntervalMs: number,
  computeFrame: (text: string, progress: number) => string,
  onComplete?: () => void,
): () => void {
  let rafId = 0;
  let cancelled = false;
  let lastGlyphUpdate = -frameIntervalMs;
  const start = performance.now();

  const step = (now: number) => {
    if (cancelled) return;
    const elapsed = now - start;
    const progress = durationMs <= 0 ? 1 : Math.min(1, elapsed / durationMs);

    if (progress >= 1) {
      element.textContent = originalText;
      onComplete?.();
      return;
    }

    if (now - lastGlyphUpdate >= frameIntervalMs) {
      lastGlyphUpdate = now;
      element.textContent = computeFrame(originalText, progress);
    }

    rafId = window.requestAnimationFrame(step);
  };

  element.textContent = computeFrame(originalText, 0);
  rafId = window.requestAnimationFrame(step);

  return () => {
    cancelled = true;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    element.textContent = originalText;
  };
}

/**
 * Runs an 800ms left-to-right A-Z0-9 cipher decode into `targetText` on `element`.
 */
export function runCipherDecode(
  element: HTMLElement,
  targetText: string,
  options: ScrambleOptions = {},
): () => void {
  return runFrameLoop(
    element,
    targetText,
    options.durationMs ?? 800,
    options.frameIntervalMs ?? 32,
    computeCipherFrame,
    options.onComplete,
  );
}

/**
 * Runs a 350ms trailing-character scramble on `element` and resolves cleanly back to `originalText`.
 */
export function runTrailingScramble(
  element: HTMLElement,
  originalText: string,
  options: ScrambleOptions = {},
): () => void {
  return runFrameLoop(
    element,
    originalText,
    options.durationMs ?? 350,
    options.frameIntervalMs ?? 32,
    computeTrailingScrambleFrame,
    options.onComplete,
  );
}
