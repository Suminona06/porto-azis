import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startJakartaClock } from './clock';
import { getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import {
  applyPrimitivesReducedMotion,
  createBlockMaskTween,
  createCipherTextTween,
  onPreloaderReady,
  prepareBlockMaskState,
} from './primitives';
import {
  computeSeededWordDelays,
  runTrailingScramble,
} from './text-scramble';

gsap.registerPlugin(ScrollTrigger);

/**
 * Orchestrates homepage motion on `/`:
 * - Pre-staged GSAP 3-part Hero entrance timeline using shared primitives upon preloader exit
 * - Interactive 350ms GSAP trailing scramble & live GMT +7 clock in Hero footer
 * - Bidirectional ScrollTrigger statement illumination
 * - Strict prefers-reduced-motion static fallback + live media-query listener
 */
export function initLandingMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const heroSectionEl = document.querySelector<HTMLElement>('[data-hero-section]');
  const heroCipherEl = document.querySelector<HTMLElement>('[data-hero-cipher]');
  const heroRoleRevealEl = document.querySelector<HTMLElement>('[data-hero-role-reveal]');
  const bioWordEls = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-bio-word]'));
  const locationBtnEl = document.querySelector<HTMLButtonElement>('[data-hero-location-btn]');
  const locationTextEl = document.querySelector<HTMLElement>('[data-hero-location-text]');
  const clockEl = document.querySelector<HTMLElement>('[data-hero-clock]');
  const statementSectionEl = document.querySelector<HTMLElement>('[data-statement-section]');
  const statementWordEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-word]'));
  const progressRingEl = document.querySelector<SVGCircleElement>('[data-progress-ring]');

  let activeCtx: gsap.Context | null = null;
  let heroTl: gsap.core.Timeline | null = null;
  let cancelLocationScramble: (() => void) | null = null;
  let cancelPreloaderWait: (() => void) | null = null;
  let entrancePlayed = false;

  const stopClock = clockEl ? startJakartaClock(clockEl) : () => {};

  const applyStaticReducedState = () => {
    cancelLocationScramble?.();
    cancelLocationScramble = null;
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    activeCtx = null;

    if (locationBtnEl) {
      locationBtnEl.style.minWidth = '';
    }

    applyPrimitivesReducedMotion(heroSectionEl ?? document);

    for (const word of bioWordEls) {
      gsap.set(word, { opacity: 1, y: 0, clearProps: 'opacity,transform,willChange' });
    }
    for (const word of statementWordEls) {
      word.dataset.revealed = 'true';
    }
    if (progressRingEl) {
      progressRingEl.style.strokeDashoffset = '0';
      progressRingEl.style.opacity = '';
    }
  };

  const setupStatementScrollTrigger = () => {
    if (!statementSectionEl || statementWordEls.length === 0) return;

    const totalWords = statementWordEls.length;
    const setRevealedCount = (revealedCount: number) => {
      for (let i = 0; i < totalWords; i += 1) {
        const word = statementWordEls[i];
        if (!word) continue;
        if (i < revealedCount) {
          word.dataset.revealed = 'true';
        } else {
          delete word.dataset.revealed;
        }
      }
    };

    if (prefersReducedMotion()) {
      setRevealedCount(totalWords);
      return;
    }

    setRevealedCount(0);

    ScrollTrigger.create({
      trigger: statementSectionEl,
      start: 'top 82%',
      end: 'bottom 35%',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const revealedCount = Math.round(self.progress * totalWords);
        setRevealedCount(revealedCount);
      },
      onLeaveBack: () => {
        setRevealedCount(0);
      },
      onLeave: () => {
        setRevealedCount(totalWords);
      },
    });
  };

  const stageMotionContext = () => {
    if (prefersReducedMotion()) {
      entrancePlayed = true;
      applyStaticReducedState();
      return;
    }

    activeCtx = gsap.context(() => {
      setupStatementScrollTrigger();

      // Smoothly scrubbed GSAP ScrollTrigger draws the circle clockwise with damped inertia.
      const circleTriggerEl =
        progressRingEl?.closest<HTMLElement>('[data-circle-ring]') ?? progressRingEl;

      if (progressRingEl && circleTriggerEl) {
        const ringCircumference = 798;
        const syncRingOpacity = () => {
          const offset = Number.parseFloat(
            String(gsap.getProperty(progressRingEl, 'strokeDashoffset')),
          );
          if (!Number.isFinite(offset)) return;
          progressRingEl.style.opacity = String(
            Math.min(1, Math.max(0, (ringCircumference - offset) / 8)),
          );
        };

        gsap.fromTo(
          progressRingEl,
          { strokeDashoffset: ringCircumference },
          {
            strokeDashoffset: 0,
            ease: 'none',
            onStart: syncRingOpacity,
            onUpdate: syncRingOpacity,
            scrollTrigger: {
              trigger: circleTriggerEl,
              start: 'top 85%',
              end: 'center center',
              scrub: 1.35,
              invalidateOnRefresh: true,
              onRefresh: syncRingOpacity,
            },
          },
        );
        syncRingOpacity();
      }

      if (heroRoleRevealEl) {
        prepareBlockMaskState(heroRoleRevealEl);
      }
      if (bioWordEls.length > 0) {
        gsap.set(bioWordEls, {
          opacity: 0,
          willChange: 'opacity',
        });
      }

      const tl = gsap.timeline({ paused: true });
      heroTl = tl;

      // Part 1 (t = 0s, ~1.1s): shared CipherText left-to-right uppercase A-Z alphabet decode (~42ms/tick).
      if (heroCipherEl) {
        tl.add(
          createCipherTextTween(heroCipherEl, {
            charset: 'alphabet',
            durationMs: 1100,
            frameIntervalMs: 42,
          }),
          0,
        );
      }

      // Part 2 (t = 0.2s, 0.95s): shared BlockMaskReveal inverse wipe over indented role line.
      if (heroRoleRevealEl) {
        tl.add(
          createBlockMaskTween(heroRoleRevealEl, {
            durationMs: 950,
            expandShare: 0.45 / 0.95,
          }),
          0.2,
        );
      }

      // Part 3 (t = 0.4s): seeded deterministic random word-by-word fade-in (0ms-950ms delays, 0.65s silky easeOut).
      if (bioWordEls.length > 0) {
        const randomDelays = computeSeededWordDelays(bioWordEls.length, 950);
        bioWordEls.forEach((wordEl, idx) => {
          const delaySec = (randomDelays[idx] ?? 0) / 1000;
          tl.to(
            wordEl,
            {
              opacity: 1,
              duration: 0.65,
              ease: 'power2.out',
              clearProps: 'willChange',
            },
            0.4 + delaySec,
          );
        });
      }
    });
  };

  const playHeroEntrance = () => {
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

  // Mount location hover/focus/tap scramble handler.
  const triggerLocationScramble = () => {
    if (!locationBtnEl || !locationTextEl) return;
    const original = locationBtnEl.dataset.locationOriginal ?? locationTextEl.textContent ?? '';
    if (prefersReducedMotion()) {
      locationTextEl.textContent = original;
      return;
    }
    if (!locationBtnEl.style.minWidth) {
      locationBtnEl.style.minWidth = `${Math.ceil(locationBtnEl.getBoundingClientRect().width)}px`;
    }
    cancelLocationScramble?.();
    cancelLocationScramble = runTrailingScramble(locationTextEl, original, {
      durationMs: 350,
    });
  };

  locationBtnEl?.addEventListener('mouseenter', triggerLocationScramble);
  locationBtnEl?.addEventListener('focus', triggerLocationScramble);
  locationBtnEl?.addEventListener('click', triggerLocationScramble);

  stageMotionContext();
  cancelPreloaderWait = onPreloaderReady(playHeroEntrance);

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
    stopClock();
    cancelLocationScramble?.();
    cancelLocationScramble = null;
    cancelPreloaderWait?.();
    cancelPreloaderWait = null;
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    mql?.removeEventListener('change', handleReducedMotionChange);
    locationBtnEl?.removeEventListener('mouseenter', triggerLocationScramble);
    locationBtnEl?.removeEventListener('focus', triggerLocationScramble);
    locationBtnEl?.removeEventListener('click', triggerLocationScramble);
  };
}
