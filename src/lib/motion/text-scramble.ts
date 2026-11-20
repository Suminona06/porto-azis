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
export const SYMBOL_CIPHER_CHARSET = "!@#$%^&*()_+-=[]{}|;:',.<>?/~";

function easeOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3);
}

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
  return randomFrom(SYMBOL_CIPHER_CHARSET);
}

/**
 * Computes a single progressive left-to-right A-Z alphabet decode frame for `target`.
 * Holds a brief full-alphabet shimmer for the first 15% of progress before resolving smoothly
 * left-to-right, guaranteeing exact `target` convergence at `progress >= 1` and preserving whitespace.
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
  const holdPhase = 0.15;
  const resolveProgress =
    clamped <= holdPhase ? 0 : easeOutCubic((clamped - holdPhase) / (1 - holdPhase));
  const resolvedCount = Math.floor(resolveProgress * target.length);
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
 * Computes a single full-string pure ASCII punctuation/symbol burst frame for `target`:
 * - While `progress < 1`: scrambles ALL non-space characters simultaneously (preserving spaces & exact length)
 * - At `progress >= 1`: snaps 100% back to the exact `target` string all at once.
 */
export function computeSymbolCipherFrame(
  target: string,
  progress: number,
  pickGlyph: (index: number) => string = randomSymbolGlyph,
): string {
  if (progress >= 1 || target.length === 0) {
    return target;
  }

  let output = '';
  for (let i = 0; i < target.length; i += 1) {
    const ch = target[i];
    output += /\s/.test(ch) ? ch : pickGlyph(i);
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
 * Runs a snappy throttled requestAnimationFrame full-string ASCII punctuation/symbol scramble
 * simultaneously across all provided `targets` (index, project title, tech stack) for ~400ms,
 * snapping cleanly back to exact original strings at completion or immediately upon cancellation.
 */
export function runSymbolCipherScramble(
  targets: SymbolScrambleTarget[],
  options: ScrambleOptions = {},
): () => void {
  if (targets.length === 0) {
    return () => {};
  }

  const durationMs = options.durationMs ?? 400;
  const frameIntervalMs = options.frameIntervalMs ?? 48;
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

  const renderBurstFrame = () => {
    for (const { element, originalText } of targets) {
      element.textContent = computeSymbolCipherFrame(originalText, 0);
    }
  };

  // Paint initial full-string scrambled frame immediately on trigger
  renderBurstFrame();

  const step = (now: number) => {
    if (cancelled) return;
    if (startTime === 0) {
      startTime = now;
      lastFrameTime = now;
    }

    const elapsed = now - startTime;
    if (elapsed >= durationMs) {
      restoreAll();
      options.onComplete?.();
      return;
    }

    if (now - lastFrameTime >= frameIntervalMs) {
      lastFrameTime = now;
      renderBurstFrame();
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

export const useSymbolScramble = runSymbolCipherScramble;
