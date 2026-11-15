import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startJakartaClock } from './clock';
import { editorialEase, getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import { createCipherDecodeTween, runTrailingScramble } from './text-scramble';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __azisPreloaderDone?: boolean;
  }
}

/**
 * Orchestrates homepage motion on `/`:
 * - Pre-staged GSAP 3-part Hero entrance timeline triggered cleanly upon preloader curtain exit
 * - Interactive 350ms GSAP trailing scramble & live GMT +7 clock in Hero footer
 * - Bidirectional ScrollTrigger statement illumination
 * - Strict prefers-reduced-motion static fallback + live media-query listener
 */
export function initLandingMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const decodeEls = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-decode]'));
  const roleTextEl = document.querySelector<HTMLElement>('[data-hero-role-text]');
  const roleMaskEl = document.querySelector<HTMLElement>('[data-hero-role-mask]');
  const bioWordEls = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-bio-word]'));
  const locationBtnEl = document.querySelector<HTMLButtonElement>('[data-hero-location-btn]');
  const locationTextEl = document.querySelector<HTMLElement>('[data-hero-location-text]');
  const clockEl = document.querySelector<HTMLElement>('[data-hero-clock]');
  const statementSectionEl = document.querySelector<HTMLElement>('[data-statement-section]');
  const statementWordEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-word]'));

  let activeCtx: gsap.Context | null = null;
  let heroTl: gsap.core.Timeline | null = null;
  let cancelLocationScramble: (() => void) | null = null;
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

    for (const el of decodeEls) {
      const target = el.dataset.decodeTarget;
      if (target) {
        el.textContent = target;
      }
      gsap.set(el, { opacity: 1, clearProps: 'opacity,willChange' });
    }

    if (roleTextEl) {
      gsap.set(roleTextEl, { opacity: 1, clearProps: 'opacity' });
    }
    if (roleMaskEl) {
      gsap.set(roleMaskEl, { scaleX: 0, clearProps: 'transform,transformOrigin,willChange' });
    }
    for (const word of bioWordEls) {
      gsap.set(word, { opacity: 1, y: 0, clearProps: 'opacity,transform,willChange' });
    }
    for (const word of statementWordEls) {
      word.dataset.revealed = 'true';
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

      if (roleTextEl) {
        gsap.set(roleTextEl, { opacity: 0 });
      }
      if (roleMaskEl) {
        gsap.set(roleMaskEl, {
          scaleX: 0,
          transformOrigin: '0% 50%',
          force3D: true,
          willChange: 'transform',
        });
      }
      if (bioWordEls.length > 0) {
        gsap.set(bioWordEls, {
          opacity: 0,
          y: 5,
          force3D: true,
          willChange: 'transform, opacity',
        });
      }
      if (decodeEls.length > 0) {
        gsap.set(decodeEls, {
          opacity: 0.35,
          willChange: 'opacity',
        });
      }

      const tl = gsap.timeline({ paused: true });
      heroTl = tl;

      // Part 1 (t = 0ms): unified-ticker 800ms A-Z0-9 cipher decode + clean compositor opacity settle.
      if (decodeEls.length > 0) {
        tl.to(
          decodeEls,
          {
            opacity: 1,
            duration: 0.28,
            ease: 'power2.out',
            clearProps: 'willChange',
          },
          0,
        );
        for (const el of decodeEls) {
          const target = el.dataset.decodeTarget ?? el.textContent ?? '';
          tl.add(
            createCipherDecodeTween(el, target, {
              durationMs: 800,
              frameIntervalMs: 40,
            }),
            0,
          );
        }
      }

      // Part 2 (t = 0ms): 700ms inverse rectangular block mask reveal over subtitle.
      if (roleMaskEl && roleTextEl) {
        tl.to(
          roleMaskEl,
          {
            scaleX: 1,
            duration: 0.35,
            ease: editorialEase,
            force3D: true,
          },
          0,
        )
          .set(roleTextEl, { opacity: 1 })
          .set(roleMaskEl, { transformOrigin: '100% 50%' })
          .to(roleMaskEl, {
            scaleX: 0,
            duration: 0.35,
            ease: editorialEase,
            force3D: true,
            clearProps: 'willChange',
          });
      } else if (roleTextEl) {
        tl.set(roleTextEl, { opacity: 1 }, 0);
      }

      // Part 3 (at headline settle): 900ms staggered bio word entrance.
      if (bioWordEls.length > 0) {
        tl.to(
          bioWordEls,
          {
            opacity: 1,
            y: 0,
            duration: 0.44,
            stagger: { amount: 0.46, from: 'random' },
            ease: 'power3.out',
            force3D: true,
            clearProps: 'transform,willChange',
          },
          0.74,
        );
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

  const onPreloaderComplete = () => {
    playHeroEntrance();
  };

  stageMotionContext();

  if (
    window.__azisPreloaderDone ||
    !document.documentElement.classList.contains('preloader-active')
  ) {
    playHeroEntrance();
  } else {
    window.addEventListener('azis:preloader-complete', onPreloaderComplete, { once: true });
  }

  const mql = getReducedMotionMediaQuery();
  const handleReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      window.removeEventListener('azis:preloader-complete', onPreloaderComplete);
      entrancePlayed = true;
      applyStaticReducedState();
    }
  };
  mql?.addEventListener('change', handleReducedMotionChange);

  return () => {
    stopClock();
    cancelLocationScramble?.();
    cancelLocationScramble = null;
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    window.removeEventListener('azis:preloader-complete', onPreloaderComplete);
    mql?.removeEventListener('change', handleReducedMotionChange);
    locationBtnEl?.removeEventListener('mouseenter', triggerLocationScramble);
    locationBtnEl?.removeEventListener('focus', triggerLocationScramble);
    locationBtnEl?.removeEventListener('click', triggerLocationScramble);
  };
}
