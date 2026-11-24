import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import {
  applyPrimitivesReducedMotion,
  createBlockMaskTween,
  createCipherTextTween,
  createImageCurtainTween,
  onPreloaderReady,
  prepareBlockMaskState,
  prepareImageCurtainState,
} from './primitives';

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_DIM_OPACITY = 0.22;
const JOURNEY_FEATHER_WORDS = 4;

/**
 * Pure helper computing `[0..total]` per-word opacity for bidirectional scroll-scrubbed
 * journal illumination (`0.22` dimmed start -> `1` full contrast end).
 */
export function computeJourneyWordOpacity(
  wordIndex: number,
  totalWords: number,
  progress: number,
): number {
  if (totalWords <= 0) return 1;
  const clamped = Math.min(1, Math.max(0, progress));
  if (clamped >= 1) return 1;
  if (clamped <= 0) return JOURNEY_DIM_OPACITY;

  const head = clamped * (totalWords + JOURNEY_FEATHER_WORDS);
  const wordT = Math.min(1, Math.max(0, (head - wordIndex) / JOURNEY_FEATHER_WORDS));
  return Number((JOURNEY_DIM_OPACITY + (1 - JOURNEY_DIM_OPACITY) * wordT).toFixed(3));
}

/**
 * Orchestrates `/about` motion:
 * - Concurrent 3-part Hero entrance (`<CipherText />` 800ms, `<BlockMaskReveal />` 700ms, `<ImageCurtainReveal />` 700ms)
 *   synchronized with `azis:preloader-complete`
 * - Bidirectional GSAP `ScrollTrigger` (`scrub: true`) word-by-word journal illumination
 * - Strict `prefers-reduced-motion: reduce` fallback + runtime media-query listener
 */
export function initAboutMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const aboutHeroEl = document.querySelector<HTMLElement>('[data-about-hero]');
  const aboutCipherEl = document.querySelector<HTMLElement>('[data-about-cipher]');
  const aboutMaskEl = document.querySelector<HTMLElement>('[data-about-mask]');
  const aboutCurtainEl = document.querySelector<HTMLElement>('[data-about-curtain]');
  const journeyJournalEl = document.querySelector<HTMLElement>('[data-journey-journal]');
  const journeyWordEls = Array.from(document.querySelectorAll<HTMLElement>('[data-journey-word]'));

  let activeCtx: gsap.Context | null = null;
  let heroTl: gsap.core.Timeline | null = null;
  let cancelPreloaderWait: (() => void) | null = null;
  let entrancePlayed = false;

  const applyJourneyProgress = (progress: number) => {
    const total = journeyWordEls.length;
    for (let i = 0; i < total; i += 1) {
      const word = journeyWordEls[i];
      if (!word) continue;
      word.style.opacity = String(computeJourneyWordOpacity(i, total, progress));
    }
  };

  const applyStaticReducedState = () => {
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    activeCtx = null;

    applyPrimitivesReducedMotion(aboutHeroEl ?? document);

    for (const word of journeyWordEls) {
      word.style.opacity = '1';
    }
  };

  const stageMotionContext = () => {
    if (prefersReducedMotion()) {
      entrancePlayed = true;
      applyStaticReducedState();
      return;
    }

    activeCtx = gsap.context(() => {
      if (aboutMaskEl) {
        prepareBlockMaskState(aboutMaskEl);
      }
      if (aboutCurtainEl) {
        prepareImageCurtainState(aboutCurtainEl);
      }

      const tl = gsap.timeline({ paused: true });
      heroTl = tl;

      if (aboutCipherEl) {
        tl.add(
          createCipherTextTween(aboutCipherEl, {
            durationMs: 800,
            frameIntervalMs: 36,
            charset: 'alnum',
          }),
          0,
        );
      }

      if (aboutMaskEl) {
        tl.add(
          createBlockMaskTween(aboutMaskEl, {
            durationMs: 700,
            expandShare: 0.5,
          }),
          0,
        );
      }

      if (aboutCurtainEl) {
        tl.add(
          createImageCurtainTween(aboutCurtainEl, {
            durationMs: 700,
          }),
          0,
        );
      }

      if (journeyJournalEl && journeyWordEls.length > 0) {
        applyJourneyProgress(0);

        ScrollTrigger.create({
          trigger: journeyJournalEl,
          start: 'top 82%',
          end: 'bottom 45%',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            applyJourneyProgress(self.progress);
          },
          onLeaveBack: () => {
            applyJourneyProgress(0);
          },
          onLeave: () => {
            applyJourneyProgress(1);
          },
        });
      }
    });
  };

  const playAboutEntrance = () => {
    if (entrancePlayed) return;
    entrancePlayed = true;

    if (prefersReducedMotion()) {
      applyStaticReducedState();
      return;
    }

    if (!heroTl) {
      stageMotionContext();
    }
    ScrollTrigger.refresh();
    heroTl?.play(0);
  };

  stageMotionContext();
  cancelPreloaderWait = onPreloaderReady(playAboutEntrance);

  const mql = getReducedMotionMediaQuery();
  const handleReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      cancelPreloaderWait?.();
      cancelPreloaderWait = null;
      entrancePlayed = true;
      applyStaticReducedState();
    }
  };
  mql?.addEventListener('change', handleReducedMotionChange);

  return () => {
    cancelPreloaderWait?.();
    cancelPreloaderWait = null;
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    mql?.removeEventListener('change', handleReducedMotionChange);
  };
}
