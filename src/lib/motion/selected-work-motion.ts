import { getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import { runSymbolCipherScramble, type SymbolScrambleTarget } from './text-scramble';

/**
 * Orchestrates Selected Work row interactions:
 * - Simultaneous 3-column ASCII symbol-cipher scramble (index, title, tech stack)
 *   on viewport entry (IntersectionObserver, once) and on row mouseenter / focus.
 * - Clean rAF cancellation on rapid re-entry, unmount, or reduced-motion change.
 */
export function initSelectedWorkMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-work-section] [data-project-row]'));
  if (rows.length === 0) {
    return () => {};
  }

  const activeCancels = new Map<HTMLElement, () => void>();
  const rowTargets = new Map<HTMLElement, SymbolScrambleTarget[]>();
  const cleanups: Array<() => void> = [];

  const getTargetsForRow = (row: HTMLElement): SymbolScrambleTarget[] => {
    const cached = rowTargets.get(row);
    if (cached) return cached;

    const els = Array.from(row.querySelectorAll<HTMLElement>('[data-symbol-scramble]'));
    const targets = els
      .map((element) => ({
        element,
        originalText: element.dataset.symbolScramble ?? element.textContent ?? '',
      }))
      .filter((item) => item.originalText.length > 0);

    rowTargets.set(row, targets);
    return targets;
  };

  const restoreAllRows = () => {
    for (const [row, cancel] of activeCancels.entries()) {
      cancel();
      activeCancels.delete(row);
    }
    for (const row of rows) {
      for (const { element, originalText } of getTargetsForRow(row)) {
        element.textContent = originalText;
      }
    }
  };

  const triggerRowScramble = (row: HTMLElement) => {
    if (prefersReducedMotion()) {
      return;
    }

    const targets = getTargetsForRow(row);
    if (targets.length === 0) return;

    activeCancels.get(row)?.();
    const cancel = runSymbolCipherScramble(targets, {
      durationMs: 460,
      frameIntervalMs: 32,
      onComplete: () => {
        if (activeCancels.get(row) === cancel) {
          activeCancels.delete(row);
        }
      },
    });
    activeCancels.set(row, cancel);
  };

  // Trigger 1: Viewport entry (once per row) via IntersectionObserver
  let observer: IntersectionObserver | null = null;
  if (!prefersReducedMotion() && typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const row = entry.target as HTMLElement;
            observer?.unobserve(row);
            triggerRowScramble(row);
          }
        }
      },
      { threshold: 0.15 },
    );

    for (const row of rows) {
      observer.observe(row);
    }
  }

  // Trigger 2: Row hover (mouseenter) and keyboard focus
  for (const row of rows) {
    const onEnter = () => triggerRowScramble(row);
    const onFocus = () => triggerRowScramble(row);
    row.addEventListener('mouseenter', onEnter);
    row.addEventListener('focus', onFocus);
    cleanups.push(() => {
      row.removeEventListener('mouseenter', onEnter);
      row.removeEventListener('focus', onFocus);
    });
  }

  const mql = getReducedMotionMediaQuery();
  const handleReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      observer?.disconnect();
      observer = null;
      restoreAllRows();
    }
  };
  mql?.addEventListener('change', handleReducedMotionChange);

  const onPageHide = () => {
    restoreAllRows();
  };
  window.addEventListener('pagehide', onPageHide);

  return () => {
    observer?.disconnect();
    observer = null;
    restoreAllRows();
    for (const cleanup of cleanups) {
      cleanup();
    }
    mql?.removeEventListener('change', handleReducedMotionChange);
    window.removeEventListener('pagehide', onPageHide);
  };
}
