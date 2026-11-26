import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getReducedMotionMediaQuery, prefersReducedMotion, techAccordionEase } from './easing';
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
export const TECH_ACCORDION_DURATION_SEC = 0.56;
export const TECH_ACCORDION_ICON_DURATION_SEC = 0.42;
export const TECH_ACCORDION_STAGGER_SEC = 0.04;

/**
 * Pure helper computing the vertical document scroll target for a sticky milestone card
 * using the deck's natural flow position and preceding card heights (immune to stuck offsets).
 */
export function computeActivityScrollTarget(
  deckTopDocY: number,
  precedingHeightsSum: number,
  stickyTopPx: number,
): number {
  return Math.max(0, Math.round(deckTopDocY + precedingHeightsSum - stickyTopPx));
}

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
  const techStackSectionEl = document.querySelector<HTMLElement>('[data-tech-stack-section]');
  const techRevealEls = Array.from(
    techStackSectionEl?.querySelectorAll<HTMLElement>('[data-tech-reveal]') ?? [],
  );
  const techTriggers = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-tech-accordion-trigger]'),
  );
  const activitiesSectionEl = document.querySelector<HTMLElement>('[data-activities-section]');
  const activitiesRevealEls = Array.from(
    activitiesSectionEl?.querySelectorAll<HTMLElement>('[data-activities-reveal]') ?? [],
  );
  const activitiesDeckEl = document.querySelector<HTMLElement>('[data-activities-deck]');
  const activityCards = Array.from(
    activitiesDeckEl?.querySelectorAll<HTMLElement>('[data-activity-card]') ?? [],
  );

  let activeCtx: gsap.Context | null = null;
  let heroTl: gsap.core.Timeline | null = null;
  let cancelPreloaderWait: (() => void) | null = null;
  let entrancePlayed = false;
  const panelTimelines = new Map<HTMLElement, gsap.core.Timeline>();
  const cleanups: Array<() => void> = [];

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
    for (const panelTl of panelTimelines.values()) {
      panelTl.kill();
    }
    panelTimelines.clear();
    activeCtx?.revert();
    activeCtx = null;

    applyPrimitivesReducedMotion(aboutHeroEl ?? document);

    for (const word of journeyWordEls) {
      word.style.opacity = '1';
    }

    for (const el of techRevealEls) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
    }

    for (const el of activitiesRevealEls) {
      gsap.set(el, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
    }

    for (const trigger of techTriggers) {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const iconEl = trigger.querySelector<SVGElement>('[data-accordion-icon]');
      const vertEl = trigger.querySelector<SVGLineElement>('[data-accordion-symbol-vert]');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      if (iconEl) {
        gsap.set(iconEl, { rotation: 0, clearProps: 'transform' });
      }
      if (vertEl) {
        gsap.set(vertEl, { scaleY: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 });
      }
      if (!panel) continue;
      if (isOpen) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      gsap.set(panel, { clearProps: 'height,opacity' });
      const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-tech-item]'));
      for (const item of items) {
        gsap.set(item, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
      }
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

      if (techStackSectionEl && techRevealEls.length > 0) {
        gsap.fromTo(
          techRevealEls,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: techAccordionEase,
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: techStackSectionEl,
              start: 'top 85%',
              once: true,
            },
          },
        );
      }

      if (activitiesSectionEl && activitiesRevealEls.length > 0) {
        gsap.fromTo(
          activitiesRevealEls,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: techAccordionEase,
            clearProps: 'opacity,transform',
            scrollTrigger: {
              trigger: activitiesSectionEl,
              start: 'top 85%',
              once: true,
            },
          },
        );
      }
    });
  };

  const toggleTechAccordion = (trigger: HTMLButtonElement) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const currentlyOpen = trigger.getAttribute('aria-expanded') === 'true';
    const nextOpen = !currentlyOpen;
    trigger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');

    const iconEl = trigger.querySelector<SVGElement>('[data-accordion-icon]');
    const vertEl = trigger.querySelector<SVGLineElement>('[data-accordion-symbol-vert]');
    const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-tech-item]'));
    panelTimelines.get(panel)?.kill();
    panelTimelines.delete(panel);

    if (prefersReducedMotion()) {
      if (iconEl) {
        gsap.set(iconEl, { rotation: 0 });
      }
      if (vertEl) {
        gsap.set(vertEl, { scaleY: nextOpen ? 0 : 1, opacity: nextOpen ? 0 : 1 });
      }
      if (nextOpen) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      gsap.set(panel, { clearProps: 'height,opacity' });
      for (const item of items) {
        gsap.set(item, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
      }
      return;
    }

    if (nextOpen) {
      panel.removeAttribute('hidden');
      const tl = gsap.timeline({
        onComplete: () => {
          panelTimelines.delete(panel);
          ScrollTrigger.refresh();
        },
      });
      if (iconEl) {
        tl.to(
          iconEl,
          {
            rotation: 180,
            duration: TECH_ACCORDION_ICON_DURATION_SEC,
            ease: techAccordionEase,
          },
          0,
        );
      }
      if (vertEl) {
        tl.to(
          vertEl,
          {
            scaleY: 0,
            opacity: 0,
            duration: TECH_ACCORDION_ICON_DURATION_SEC * 0.8,
            ease: techAccordionEase,
          },
          0,
        );
      }
      tl.fromTo(
        panel,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: TECH_ACCORDION_DURATION_SEC,
          ease: techAccordionEase,
          clearProps: 'height,opacity',
        },
        0,
      );
      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: -6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: TECH_ACCORDION_STAGGER_SEC,
            ease: techAccordionEase,
            clearProps: 'opacity,transform',
          },
          0.08,
        );
      }
      panelTimelines.set(panel, tl);
    } else {
      const startHeight = panel.offsetHeight;
      const tl = gsap.timeline({
        onComplete: () => {
          panel.setAttribute('hidden', '');
          gsap.set(panel, { clearProps: 'height,opacity' });
          for (const item of items) {
            gsap.set(item, { clearProps: 'opacity,transform' });
          }
          panelTimelines.delete(panel);
          ScrollTrigger.refresh();
        },
      });
      if (iconEl) {
        tl.to(
          iconEl,
          {
            rotation: 0,
            duration: TECH_ACCORDION_ICON_DURATION_SEC,
            ease: techAccordionEase,
          },
          0,
        );
      }
      if (vertEl) {
        tl.to(
          vertEl,
          {
            scaleY: 1,
            opacity: 1,
            duration: TECH_ACCORDION_ICON_DURATION_SEC * 0.85,
            ease: techAccordionEase,
          },
          0.04,
        );
      }
      tl.fromTo(
        panel,
        { height: startHeight, opacity: 1 },
        {
          height: 0,
          opacity: 0,
          duration: TECH_ACCORDION_DURATION_SEC,
          ease: techAccordionEase,
        },
        0,
      );
      panelTimelines.set(panel, tl);
    }
  };

  for (const trigger of techTriggers) {
    if (trigger.getAttribute('data-tech-bound') === 'true') continue;
    trigger.setAttribute('data-tech-bound', 'true');
    const onClick = () => toggleTechAccordion(trigger);
    trigger.addEventListener('click', onClick);
    cleanups.push(() => {
      trigger.removeEventListener('click', onClick);
      trigger.removeAttribute('data-tech-bound');
    });
  }

  const syncNavbarHeightVar = () => {
    const header = document.querySelector<HTMLElement>('header');
    if (header && header.offsetHeight > 0) {
      document.documentElement.style.setProperty('--navbar-height', `${header.offsetHeight}px`);
    }
  };
  syncNavbarHeightVar();
  window.addEventListener('resize', syncNavbarHeightVar, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('resize', syncNavbarHeightVar);
  });

  if (activitiesDeckEl && activityCards.length > 0) {
    activityCards.forEach((card, cardIdx) => {
      const headerBtn = card.querySelector<HTMLButtonElement>('[data-activity-header]');
      if (!headerBtn || headerBtn.getAttribute('data-activity-bound') === 'true') return;
      headerBtn.setAttribute('data-activity-bound', 'true');

      const onHeaderClick = () => {
        const deckTopDocY = activitiesDeckEl.getBoundingClientRect().top + window.scrollY;
        let precedingHeightsSum = 0;
        for (let k = 0; k < cardIdx; k += 1) {
          precedingHeightsSum += activityCards[k]?.offsetHeight ?? 0;
        }
        const stickyTopPx = parseFloat(window.getComputedStyle(card).top) || 0;
        const targetY = computeActivityScrollTarget(deckTopDocY, precedingHeightsSum, stickyTopPx);
        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      };

      headerBtn.addEventListener('click', onHeaderClick);
      cleanups.push(() => {
        headerBtn.removeEventListener('click', onHeaderClick);
        headerBtn.removeAttribute('data-activity-bound');
      });
    });
  }

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
    for (const cleanup of cleanups) {
      cleanup();
    }
    for (const panelTl of panelTimelines.values()) {
      panelTl.kill();
    }
    panelTimelines.clear();
    heroTl?.kill();
    heroTl = null;
    activeCtx?.revert();
    mql?.removeEventListener('change', handleReducedMotionChange);
  };
}
