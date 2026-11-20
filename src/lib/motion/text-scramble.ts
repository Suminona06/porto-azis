import gsap from 'gsap';

/**
 * Reusable text scramble & animation timing utilities:
 * - AlphabetDecode (A-Z) for Hero Line 1 serif name
 * - SymbolCipherScramble (!@#$%^&*...0-9) for Selected Work 3-column simultaneous scramble
 * - TrailingScramble for Hero location micro-interaction
 * - Seeded deterministic random delays for Hero justified intro paragraph word fade-in
 */

export const ALPHABET_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CIPHER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const SYMBOL_CIPHER_CHARSET = "!@#$%^&*()_+-=[]{}|;:',.<>?/~0123456789";

const SYMBOL_CIPHER_POOL =
  "!@#$%^&*()_+-=[]{}|;:',.<>?/~!@#$%^&*()[];:,.<>?/~0123456789";

function randomFrom(charset: string): string {
  const idx = Math.floor(Math.random() * charset.length);
  return charset[idx] ?? 'X';
}

function randomGlyph(): string {
  return randomFrom(CIPHER_ALPHABET);
}

function randomAlphabetGlyph(): string {
  return randomFrom(ALPHABET_CHARSET);
}

function randomSymbolGlyph(): string {
  return randomFrom(SYMBOL_CIPHER_POOL);
}

/**
 * Computes a single progressive left-to-right A-Z alphabet decode frame for `target`.
 * Guarantees exact `target` convergence at `progress >= 1` and preserves all whitespace positions.
 */
export function computeAlphabetDecodeFrame(
  target: string,
  progress: number,
  pickGlyph: (index: number) => string = randomAlphabetGlyph,
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
 * Computes a single progressive left-to-right A-Z0-9 cipher frame for `target`.
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
 * Computes a single ASCII symbol-cipher frame for `target` (preserving spaces & exact length).
 * Progressively resolves left-to-right back into `target` as `progress` approaches 1.
 */
export function computeSymbolCipherFrame(
  target: string,
  progress: number,
  pickGlyph: (index: number) => string = randomSymbolGlyph,
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

/**
 * Generates deterministic seeded randomized delays (in ms) in `[0, maxDelayMs]`
 * for organic non-sequential word-by-word fade-in.
 */
export function computeSeededWordDelays(
  wordCount: number,
  maxDelayMs = 900,
  seed = 1337,
): number[] {
  if (wordCount <= 0) return [];
  if (wordCount === 1) return [0];

  let state = seed >>> 0;
  const nextRandom = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Create evenly spread buckets across [0, maxDelayMs] then Fisher-Yates shuffle deterministically
  // so the fade-in covers the full time window organically without sequential left-to-right order.
  const buckets = Array.from({ length: wordCount }, (_, i) => {
    const base = (i / (wordCount - 1)) * maxDelayMs;
    const jitter = (nextRandom() - 0.5) * (maxDelayMs / wordCount) * 0.6;
    return Math.round(Math.min(maxDelayMs, Math.max(0, base + jitter)));
  });

  for (let i = buckets.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1));
    const tmp = buckets[i]!;
    buckets[i] = buckets[j]!;
    buckets[j] = tmp;
  }

  return buckets;
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
 * Builds a ~1000ms GSAP tween for left-to-right A-Z alphabet decode into `targetText` on `element`.
 */
export function createAlphabetDecodeTween(
  element: HTMLElement,
  targetText: string,
  options: ScrambleOptions = {},
): gsap.core.Tween {
  return createFrameTween(
    element,
    targetText,
    options.durationMs ?? 1000,
    options.frameIntervalMs ?? 35,
    computeAlphabetDecodeFrame,
    options.onComplete,
  );
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

export interface SymbolScrambleTarget {
  element: HTMLElement;
  originalText: string;
}

/**
 * Runs a throttled requestAnimationFrame ASCII symbol-cipher scramble simultaneously across
 * all provided `targets` (e.g., index, project title, and tech stack of a Selected Work row).
 * Returns a cancel function that immediately stops the loop and restores exact original strings.
 */
export function runSymbolCipherScramble(
  targets: SymbolScrambleTarget[],
  options: ScrambleOptions = {},
): () => void {
  if (targets.length === 0) {
    return () => {};
  }

  const durationMs = options.durationMs ?? 460;
  const frameIntervalMs = options.frameIntervalMs ?? 32;
  let rafId = 0;
  let cancelled = false;
  let startTime = 0;
  let lastFrameTime = -frameIntervalMs;

  const restoreAll = () => {
    for (const { element, originalText } of targets) {
      if (element.textContent !== originalText) {
        element.textContent = originalText;
      }
    }
  };

  const renderAt = (progress: number) => {
    for (const { element, originalText } of targets) {
      element.textContent = computeSymbolCipherFrame(originalText, progress);
    }
  };

  // Paint initial scrambled frame immediately on trigger
  renderAt(0);

  const step = (now: number) => {
    if (cancelled) return;
    if (startTime === 0) {
      startTime = now;
      lastFrameTime = now;
    }

    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);

    if (progress >= 1) {
      restoreAll();
      options.onComplete?.();
      return;
    }

    if (now - lastFrameTime >= frameIntervalMs) {
      lastFrameTime = now;
      renderAt(progress);
    }

    rafId = window.requestAnimationFrame(step);
  };

  rafId = window.requestAnimationFrame(step);

  return () => {
    cancelled = true;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    restoreAll();
  };
}
