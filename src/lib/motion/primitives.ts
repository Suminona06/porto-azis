import gsap from 'gsap';
import { editorialEase, getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import { createAlphabetDecodeTween, createCipherDecodeTween } from './text-scramble';

export const DEFAULT_CIPHER_DURATION_MS = 800;
export const DEFAULT_BLOCK_MASK_DURATION_MS = 700;
export const DEFAULT_IMAGE_CURTAIN_DURATION_MS = 700;

export type CipherCharset = 'alnum' | 'alphabet';

export interface CipherTweenOptions {
  durationMs?: number;
  frameIntervalMs?: number;
  charset?: CipherCharset;
}

export interface BlockMaskTweenOptions {
  durationMs?: number;
  expandShare?: number;
}

export interface ImageCurtainTweenOptions {
  durationMs?: number;
}

declare global {
  interface Window {
    __azisPreloaderDone?: boolean;
  }
}

/**
 * Registers a one-shot callback that runs immediately if the preloader curtain has already
 * completed or is inactive, otherwise fires when `azis:preloader-complete` dispatches.
 */
export function onPreloaderReady(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  if (
    window.__azisPreloaderDone ||
    !document.documentElement.classList.contains('preloader-active')
  ) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener('azis:preloader-complete', handler, { once: true });
  return () => {
    window.removeEventListener('azis:preloader-complete', handler);
  };
}

/**
 * Computes expand and retract durations (in seconds) for BlockMaskReveal so
 * total duration equals `durationMs` (default 700ms -> 0.35s expand + 0.35s retract).
 */
export function getBlockMaskPhaseDurations(
  durationMs = DEFAULT_BLOCK_MASK_DURATION_MS,
  expandShare = 0.5,
): { expandSec: number; retractSec: number } {
  const totalSec = Math.max(0.02, durationMs / 1000);
  const clampedShare = Math.min(0.9, Math.max(0.1, expandShare));
  const expandSec = Number((totalSec * clampedShare).toFixed(4));
  const retractSec = Number((totalSec - expandSec).toFixed(4));
  return { expandSec, retractSec };
}

/**
 * Builds a synchronized GSAP timeline decoding every `[data-cipher-word]` inside `container`
 * left-to-right over `durationMs` (default 800ms).
 */
export function createCipherTextTween(
  container: HTMLElement,
  options: CipherTweenOptions = {},
): gsap.core.Timeline {
  const words = Array.from(container.querySelectorAll<HTMLElement>('[data-cipher-word]'));
  const durationMs =
    options.durationMs ??
    (Number(container.dataset.cipherDuration) || DEFAULT_CIPHER_DURATION_MS);
  const frameIntervalMs =
    options.frameIntervalMs ??
    (Number(container.dataset.cipherInterval) || (options.charset === 'alphabet' ? 42 : 36));
  const charset: CipherCharset =
    options.charset ??
    (container.dataset.cipherCharset === 'alphabet' ? 'alphabet' : 'alnum');

  const tl = gsap.timeline();
  if (words.length === 0) {
    return tl;
  }

  gsap.set(words, { opacity: 1 });

  for (const wordEl of words) {
    const target = wordEl.dataset.cipherTarget ?? wordEl.textContent ?? '';
    const tween =
      charset === 'alphabet'
        ? createAlphabetDecodeTween(wordEl, target, { durationMs, frameIntervalMs })
        : createCipherDecodeTween(wordEl, target, { durationMs, frameIntervalMs });
    tl.add(tween, 0);
  }

  return tl;
}

/**
 * Stages initial hidden state for a `[data-motion-primitive="block-mask"]` container.
 */
export function prepareBlockMaskState(container: HTMLElement): void {
  const contentEl = container.querySelector<HTMLElement>('[data-block-mask-content]');
  const maskEl = container.querySelector<HTMLElement>('[data-block-mask-box]');
  if (contentEl) {
    gsap.set(contentEl, { opacity: 0 });
  }
  if (maskEl) {
    gsap.set(maskEl, {
      scaleX: 0,
      transformOrigin: '0% 50%',
      force3D: true,
      willChange: 'transform',
    });
  }
}

/**
 * Builds the 2-phase horizontal solid block wipe timeline:
 * Phase 1: expand scaleX 0 -> 1 from left while text is hidden
 * Phase 2: reveal text, flip origin to right, retract scaleX 1 -> 0
 */
export function createBlockMaskTween(
  container: HTMLElement,
  options: BlockMaskTweenOptions = {},
): gsap.core.Timeline {
  const contentEl = container.querySelector<HTMLElement>('[data-block-mask-content]');
  const maskEl = container.querySelector<HTMLElement>('[data-block-mask-box]');
  const durationMs =
    options.durationMs ??
    (Number(container.dataset.maskDuration) || DEFAULT_BLOCK_MASK_DURATION_MS);
  const { expandSec, retractSec } = getBlockMaskPhaseDurations(durationMs, options.expandShare);

  const tl = gsap.timeline();
  if (maskEl && contentEl) {
    tl.to(
      maskEl,
      {
        scaleX: 1,
        duration: expandSec,
        ease: editorialEase,
        force3D: true,
      },
      0,
    )
      .set(contentEl, { opacity: 1 }, expandSec)
      .set(maskEl, { transformOrigin: '100% 50%' }, expandSec)
      .to(
        maskEl,
        {
          scaleX: 0,
          duration: retractSec,
          ease: editorialEase,
          force3D: true,
          clearProps: 'willChange',
        },
        expandSec,
      );
  } else if (contentEl) {
    tl.set(contentEl, { opacity: 1 }, 0);
  }

  return tl;
}

/**
 * Stages initial bottom-clipped state for `[data-motion-primitive="image-curtain"]`.
 */
export function prepareImageCurtainState(container: HTMLElement): void {
  const frameEl = container.querySelector<HTMLElement>('[data-image-curtain]');
  if (frameEl) {
    gsap.set(frameEl, {
      clipPath: 'inset(100% 0% 0% 0%)',
      willChange: 'clip-path',
    });
  }
}

/**
 * Builds the vertical curtain wipe (`inset(100% 0 0 0)` -> `inset(0% 0 0 0)`) using `editorialEase`.
 */
export function createImageCurtainTween(
  container: HTMLElement,
  options: ImageCurtainTweenOptions = {},
): gsap.core.Tween | gsap.core.Timeline {
  const frameEl = container.querySelector<HTMLElement>('[data-image-curtain]');
  const durationMs =
    options.durationMs ??
    (Number(container.dataset.curtainDuration) || DEFAULT_IMAGE_CURTAIN_DURATION_MS);

  if (!frameEl) {
    return gsap.timeline();
  }

  return gsap.fromTo(
    frameEl,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: Math.max(0.02, durationMs / 1000),
      ease: editorialEase,
      clearProps: 'willChange',
    },
  );
}

/**
 * Immediately restores all shared motion primitives inside `root` to crisp static final states.
 */
export function applyPrimitivesReducedMotion(root: ParentNode = document): void {
  const cipherWords = Array.from(root.querySelectorAll<HTMLElement>('[data-cipher-word]'));
  for (const el of cipherWords) {
    const target = el.dataset.cipherTarget;
    if (target) {
      el.textContent = target;
    }
    gsap.set(el, { opacity: 1, clearProps: 'opacity,willChange' });
  }

  const maskContents = Array.from(root.querySelectorAll<HTMLElement>('[data-block-mask-content]'));
  for (const el of maskContents) {
    gsap.set(el, { opacity: 1, clearProps: 'opacity' });
  }

  const maskBoxes = Array.from(root.querySelectorAll<HTMLElement>('[data-block-mask-box]'));
  for (const el of maskBoxes) {
    gsap.set(el, { scaleX: 0, clearProps: 'transform,transformOrigin,willChange' });
  }

  const curtainFrames = Array.from(root.querySelectorAll<HTMLElement>('[data-image-curtain]'));
  for (const el of curtainFrames) {
    gsap.set(el, {
      clipPath: 'inset(0% 0% 0% 0%)',
      clearProps: 'willChange',
    });
  }
}

/**
 * Auto-initializes standalone primitives marked `data-motion-trigger="entrance"`.
 * Components orchestrated by a page timeline (such as HeroSection or About) use `trigger="manual"`.
 */
export function initMotionPrimitives(root: ParentNode = document): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>('[data-motion-primitive][data-motion-trigger="entrance"]'),
  );
  if (nodes.length === 0) {
    return () => {};
  }

  let ctx: gsap.Context | null = null;
  let masterTl: gsap.core.Timeline | null = null;
  let cancelPreloaderWait: (() => void) | null = null;
  let played = false;

  const setStatic = () => {
    masterTl?.kill();
    masterTl = null;
    ctx?.revert();
    ctx = null;
    applyPrimitivesReducedMotion(root);
  };

  if (prefersReducedMotion()) {
    setStatic();
    return () => {};
  }

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ paused: true });
    masterTl = tl;

    for (const el of nodes) {
      const kind = el.dataset.motionPrimitive;
      const delaySec = Math.max(0, Number(el.dataset.motionDelay) || 0);
      if (kind === 'cipher') {
        tl.add(createCipherTextTween(el), delaySec);
      } else if (kind === 'block-mask') {
        prepareBlockMaskState(el);
        tl.add(createBlockMaskTween(el), delaySec);
      } else if (kind === 'image-curtain') {
        prepareImageCurtainState(el);
        tl.add(createImageCurtainTween(el), delaySec);
      }
    }
  });

  const play = () => {
    if (played) return;
    played = true;
    if (prefersReducedMotion()) {
      setStatic();
      return;
    }
    masterTl?.play(0);
  };

  cancelPreloaderWait = onPreloaderReady(play);

  const mql = getReducedMotionMediaQuery();
  const onReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      played = true;
      cancelPreloaderWait?.();
      setStatic();
    }
  };
  mql?.addEventListener('change', onReducedMotionChange);

  return () => {
    cancelPreloaderWait?.();
    mql?.removeEventListener('change', onReducedMotionChange);
    masterTl?.kill();
    ctx?.revert();
  };
}
