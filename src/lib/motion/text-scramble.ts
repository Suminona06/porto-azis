import gsap from 'gsap';

/**
 * GSAP-synchronized left-to-right A-Z0-9 cipher decode and trailing-character hover scramble utilities.
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

function createFrameTween(
  element: HTMLElement,
  originalText: string,
  durationMs: number,
  frameIntervalMs: number,
  computeFrame: (text: string, progress: number) => string,
  onComplete?: () => void,
): gsap.core.Tween {
  const proxy = { progress: 0 };
  let lastGlyphUpdate = -frameIntervalMs;
  let lastRendered = '';

  return gsap.to(proxy, {
    progress: 1,
    duration: Math.max(0.01, durationMs / 1000),
    ease: 'none',
    onStart: () => {
      const initial = computeFrame(originalText, 0);
      lastRendered = initial;
      element.textContent = initial;
      lastGlyphUpdate = performance.now();
    },
    onUpdate: () => {
      const now = performance.now();
      if (proxy.progress >= 1 || now - lastGlyphUpdate >= frameIntervalMs) {
        lastGlyphUpdate = now;
        const frame = computeFrame(originalText, proxy.progress);
        if (frame !== lastRendered) {
          lastRendered = frame;
          element.textContent = frame;
        }
      }
    },
    onComplete: () => {
      if (element.textContent !== originalText) {
        element.textContent = originalText;
      }
      onComplete?.();
    },
  });
}

/**
 * Builds an 800ms GSAP tween for left-to-right A-Z0-9 cipher decode into `targetText` on `element`.
 */
export function createCipherDecodeTween(
  element: HTMLElement,
  targetText: string,
  options: ScrambleOptions = {},
): gsap.core.Tween {
  return createFrameTween(
    element,
    targetText,
    options.durationMs ?? 800,
    options.frameIntervalMs ?? 40,
    computeCipherFrame,
    options.onComplete,
  );
}

/**
 * Runs an 800ms GSAP-driven left-to-right A-Z0-9 cipher decode into `targetText` on `element`.
 */
export function runCipherDecode(
  element: HTMLElement,
  targetText: string,
  options: ScrambleOptions = {},
): () => void {
  const tween = createCipherDecodeTween(element, targetText, options);
  return () => {
    tween.kill();
    element.textContent = targetText;
  };
}

/**
 * Runs a 350ms GSAP-driven trailing-character scramble on `element` and resolves cleanly back to `originalText`.
 */
export function runTrailingScramble(
  element: HTMLElement,
  originalText: string,
  options: ScrambleOptions = {},
): () => void {
  const tween = createFrameTween(
    element,
    originalText,
    options.durationMs ?? 350,
    options.frameIntervalMs ?? 36,
    computeTrailingScrambleFrame,
    options.onComplete,
  );
  return () => {
    tween.kill();
    element.textContent = originalText;
  };
}
