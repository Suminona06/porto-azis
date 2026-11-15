import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startJakartaClock } from './clock';
import { editorialEase, getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import { runCipherDecode, runTrailingScramble } from './text-scramble';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __azisPreloaderDone?: boolean;
  }
}

/**
 * Orchestrates homepage motion on `/`:
 * - Synchronized 3-part Hero entrance after preloader exit
 * - Interactive 350ms location hover/focus/tap scramble & live GMT +7 clock
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
  let cancelDecodes: Array<() => void> = [];
  let cancelLocationScramble: (() => void) | null = null;
  let entrancePlayed = false;

  const stopClock = clockEl ? startJakartaClock(clockEl) : () => {};

  const stopAllTextEffects = () => {
    for (const cancel of cancelDecodes) {
      cancel();
    }
    cancelDecodes = [];
    cancelLocationScramble?.();
    cancelLocationScramble = null;
  };

  const applyStaticReducedState = () => {
    stopAllTextEffects();
    activeCtx?.revert();
    activeCtx = null;

    for (const el of decodeEls) {
      const target = el.dataset.decodeTarget;
      if (target) {
        el.textContent = target;
      }
    }

    if (roleTextEl) {
      roleTextEl.style.opacity = '1';
      gsap.set(roleTextEl, { clearProps: 'opacity' });
    }
    if (roleMaskEl) {
      gsap.set(roleMaskEl, { scaleX: 0, clearProps: 'transform,transformOrigin' });
    }
    for (const word of bioWordEls) {
      word.style.opacity = '1';
      gsap.set(word, { clearProps: 'opacity' });
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
    ScrollTrigger.refresh();
  };

  const playHeroEntrance = () => {
    if (entrancePlayed) return;
    entrancePlayed = true;

    if (prefersReducedMotion()) {
      applyStaticReducedState();
      return;
    }

    activeCtx = gsap.context(() => {
      setupStatementScrollTrigger();

      if (roleTextEl) {
        gsap.set(roleTextEl, { opacity: 0 });
      }
      if (roleMaskEl) {
        gsap.set(roleMaskEl, { scaleX: 0, transformOrigin: '0% 50%' });
      }
      if (bioWordEls.length > 0) {
        gsap.set(bioWordEls, { opacity: 0 });
      }

      const heroTl = gsap.timeline();

      // Part 1 (t = 0ms): progressive 800ms A-Z0-9 cipher decode on serif display name.
      heroTl.add(() => {
        for (const el of decodeEls) {
          const target = el.dataset.decodeTarget ?? el.textContent ?? '';
          cancelDecodes.push(
            runCipherDecode(el, target, {
              durationMs: 800,
            }),
          );
        }
      }, 0);

      // Part 2 (t = 0ms): 700ms inverse rectangular block mask reveal over subtitle.
      if (roleMaskEl && roleTextEl) {
        heroTl
          .to(
            roleMaskEl,
            {
              scaleX: 1,
              duration: 0.35,
              ease: editorialEase,
            },
            0,
          )
          .set(roleTextEl, { opacity: 1 })
          .set(roleMaskEl, { transformOrigin: '100% 50%' })
          .to(roleMaskEl, {
            scaleX: 0,
            duration: 0.35,
            ease: editorialEase,
          });
      } else if (roleTextEl) {
        heroTl.set(roleTextEl, { opacity: 1 }, 0);
      }

      // Part 3 (after headlines settle at 800ms): 900ms staggered bio word fade-in.
      if (bioWordEls.length > 0) {
        heroTl.fromTo(
          bioWordEls,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            stagger: { amount: 0.55, from: 'random' },
            ease: 'power2.out',
          },
          0.8,
        );
      }
    });
  };

  // Mount location hover/focus/tap scramble handler.
  const triggerLocationScramble = () => {
    if (!locationBtnEl || !locationTextEl) return;
    const original = locationBtnEl.dataset.locationOriginal ?? locationTextEl.textContent ?? '';
    if (prefersReducedMotion()) {
      locationTextEl.textContent = original;
      return;
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

  if (prefersReducedMotion()) {
    entrancePlayed = true;
    applyStaticReducedState();
  } else if (
    window.__azisPreloaderDone ||
    !document.documentElement.classList.contains('preloader-active')
  ) {
    playHeroEntrance();
  } else {
    // Keep role subtitle and bio concealed beneath preloader until curtain exit finishes.
    if (roleTextEl) roleTextEl.style.opacity = '0';
    for (const word of bioWordEls) word.style.opacity = '0';
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
    stopAllTextEffects();
    activeCtx?.revert();
    window.removeEventListener('azis:preloader-complete', onPreloaderComplete);
    mql?.removeEventListener('change', handleReducedMotionChange);
    locationBtnEl?.removeEventListener('mouseenter', triggerLocationScramble);
    locationBtnEl?.removeEventListener('focus', triggerLocationScramble);
    locationBtnEl?.removeEventListener('click', triggerLocationScramble);
  };
}
