import gsap from 'gsap';
import { getReducedMotionMediaQuery, prefersReducedMotion } from './easing';
import { useSymbolScramble, type SymbolScrambleTarget } from './text-scramble';

export type RowVerticalEdge = 'top' | 'bottom';

export interface RowEdgeInput {
  mode: 'enter' | 'leave';
  currentIndex: number;
  otherIndex: number | null;
  clientY: number;
  rect: Pick<DOMRect, 'top' | 'height'>;
}

const ENTER_DURATION_SEC = 0.55;
const LEAVE_DURATION_SEC = 0.45;

/**
 * Resolves which vertical edge ('top' or 'bottom') the pointer crossed when entering or leaving a row.
 * Row-to-row transitions use index ordering (moving down enters from top / exits through bottom;
 * moving up enters from bottom / exits through top). List entry/exit falls back to clientY vs row midpoint.
 */
export function resolveRowEdge({
  mode,
  currentIndex,
  otherIndex,
  clientY,
  rect,
}: RowEdgeInput): RowVerticalEdge {
  if (otherIndex !== null && otherIndex !== currentIndex) {
    if (mode === 'enter') {
      return currentIndex > otherIndex ? 'top' : 'bottom';
    }
    return otherIndex > currentIndex ? 'bottom' : 'top';
  }

  const midpointY = rect.top + rect.height / 2;
  return clientY < midpointY ? 'top' : 'bottom';
}

function isClipFullyHidden(layer: HTMLElement): boolean {
  const raw = window.getComputedStyle(layer).clipPath;
  if (!raw || raw === 'none') {
    return false;
  }

  const match = raw.match(/inset\(([^)]+)\)/);
  if (!match) {
    return false;
  }

  const tokens = match[1].trim().split(/\s+/);
  const parseValue = (token: string | undefined): number | null => {
    if (!token) return null;
    if (token.endsWith('%')) {
      const n = Number.parseFloat(token);
      return Number.isFinite(n) ? n : null;
    }
    if (token.endsWith('px')) {
      const px = Number.parseFloat(token);
      const height = layer.getBoundingClientRect().height || layer.offsetHeight;
      if (!Number.isFinite(px) || height <= 0) return null;
      return (px / height) * 100;
    }
    const bare = Number.parseFloat(token);
    return bare === 0 ? 0 : null;
  };

  const topPct = parseValue(tokens[0]);
  const bottomPct = parseValue(tokens.length >= 3 ? tokens[2] : tokens[0]);
  if (topPct === null || bottomPct === null) {
    return false;
  }

  return topPct + bottomPct >= 99;
}

function openLayerCurtain(layer: HTMLElement | null, entryEdge: RowVerticalEdge): void {
  if (!layer || prefersReducedMotion()) return;

  const startClip = entryEdge === 'top' ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)';
  gsap.killTweensOf(layer);

  if (!layer.style.clipPath || isClipFullyHidden(layer)) {
    gsap.set(layer, { clipPath: startClip });
  }

  gsap.to(layer, {
    clipPath: 'inset(0% 0% 0% 0%)',
    duration: ENTER_DURATION_SEC,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

function closeLayerCurtain(layer: HTMLElement | null, exitEdge: RowVerticalEdge): void {
  if (!layer || prefersReducedMotion()) return;

  const endClip = exitEdge === 'bottom' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';
  gsap.killTweensOf(layer);
  gsap.to(layer, {
    clipPath: endClip,
    duration: LEAVE_DURATION_SEC,
    ease: 'power3.inOut',
    overwrite: 'auto',
  });
}

/**
 * Orchestrates Selected Work interactions (1:1 Ammar reference parity):
 * - Full-row GSAP vertical clip-path curtain sweep (`.work-layer`) paired with `mix-blend-difference`
 *   text inversion (`0.55s power3.out` enter, `0.45s power3.inOut` leave) and smooth mid-flight reversals.
 * - Snappy ~420ms (`40ms` tick) full-string pure ASCII symbol scramble across Index, Title, and Tech Stack
 *   on hover/focus with instant rAF cancellation & restore on mouseleave/blur.
 */
export function initSelectedWorkMotion(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const section = document.querySelector<HTMLElement>('[data-work-section]');
  const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-work-section] [data-project-row]'));
  if (!section || rows.length === 0) {
    return () => {};
  }

  section.dataset.workMotionReady = 'true';

  const activeCancels = new Map<HTMLElement, () => void>();
  const rowTargets = new Map<HTMLElement, SymbolScrambleTarget[]>();
  const rowIndexMap = new Map<HTMLElement, number>();
  const rowLayerMap = new Map<HTMLElement, HTMLElement | null>();
  const cleanups: Array<() => void> = [];

  let activeHoveredIndex: number | null = null;
  let lastFocusedIndex: number | null = null;

  rows.forEach((row, index) => {
    rowIndexMap.set(row, index);
    rowLayerMap.set(row, row.querySelector<HTMLElement>('[data-work-layer]'));
  });

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

  const cancelRowScramble = (row: HTMLElement) => {
    const cancel = activeCancels.get(row);
    if (cancel) {
      cancel();
      activeCancels.delete(row);
    } else {
      for (const { element, originalText } of getTargetsForRow(row)) {
        if (element.textContent !== originalText) {
          element.textContent = originalText;
        }
      }
    }
  };

  const cancelAllScrambles = (exceptRow?: HTMLElement) => {
    for (const [row, cancel] of activeCancels.entries()) {
      if (row !== exceptRow) {
        cancel();
        activeCancels.delete(row);
      }
    }
  };

  const triggerRowScramble = (row: HTMLElement) => {
    if (prefersReducedMotion()) {
      return;
    }

    const targets = getTargetsForRow(row);
    if (targets.length === 0) return;

    cancelAllScrambles(row);
    activeCancels.get(row)?.();

    const cancel = useSymbolScramble(targets, {
      durationMs: 420,
      frameIntervalMs: 40,
      onComplete: () => {
        if (activeCancels.get(row) === cancel) {
          activeCancels.delete(row);
        }
      },
    });
    activeCancels.set(row, cancel);
  };

  const resetAllLayers = () => {
    for (const row of rows) {
      const layer = rowLayerMap.get(row) ?? null;
      if (layer) {
        gsap.killTweensOf(layer);
        layer.style.clipPath = 'inset(100% 0% 0% 0%)';
      }
    }
  };

  const getRelatedRowIndex = (target: EventTarget | null): number | null => {
    if (!(target instanceof Element)) return null;
    const relatedRow = target.closest<HTMLElement>('[data-project-row]');
    if (!relatedRow) return null;
    return rowIndexMap.get(relatedRow) ?? null;
  };

  for (const row of rows) {
    const currentIndex = rowIndexMap.get(row) ?? 0;
    const layer = rowLayerMap.get(row) ?? null;

    const onMouseEnter = (event: MouseEvent) => {
      const relatedIdx = getRelatedRowIndex(event.relatedTarget);
      const otherIndex = relatedIdx ?? activeHoveredIndex;
      const entryEdge = resolveRowEdge({
        mode: 'enter',
        currentIndex,
        otherIndex,
        clientY: event.clientY,
        rect: row.getBoundingClientRect(),
      });

      activeHoveredIndex = currentIndex;
      openLayerCurtain(layer, entryEdge);
      triggerRowScramble(row);
    };

    const onMouseLeave = (event: MouseEvent) => {
      const relatedIdx = getRelatedRowIndex(event.relatedTarget);
      const exitEdge = resolveRowEdge({
        mode: 'leave',
        currentIndex,
        otherIndex: relatedIdx,
        clientY: event.clientY,
        rect: row.getBoundingClientRect(),
      });

      if (relatedIdx === null) {
        activeHoveredIndex = null;
      }

      cancelRowScramble(row);
      closeLayerCurtain(layer, exitEdge);
    };

    const onFocus = () => {
      if (activeHoveredIndex === currentIndex) {
        lastFocusedIndex = currentIndex;
        return;
      }
      const entryEdge: RowVerticalEdge =
        lastFocusedIndex !== null && currentIndex < lastFocusedIndex ? 'bottom' : 'top';
      lastFocusedIndex = currentIndex;
      openLayerCurtain(layer, entryEdge);
      triggerRowScramble(row);
    };

    const onBlur = (event: FocusEvent) => {
      const nextFocusedIdx = getRelatedRowIndex(event.relatedTarget);
      if (nextFocusedIdx === null) {
        lastFocusedIndex = null;
      }
      if (activeHoveredIndex === currentIndex) {
        return;
      }
      const exitEdge: RowVerticalEdge =
        nextFocusedIdx !== null && nextFocusedIdx < currentIndex ? 'top' : 'bottom';
      cancelRowScramble(row);
      closeLayerCurtain(layer, exitEdge);
    };

    row.addEventListener('mouseenter', onMouseEnter);
    row.addEventListener('mouseleave', onMouseLeave);
    row.addEventListener('focus', onFocus);
    row.addEventListener('blur', onBlur);

    cleanups.push(() => {
      row.removeEventListener('mouseenter', onMouseEnter);
      row.removeEventListener('mouseleave', onMouseLeave);
      row.removeEventListener('focus', onFocus);
      row.removeEventListener('blur', onBlur);
    });
  }

  const mql = getReducedMotionMediaQuery();
  const handleReducedMotionChange = (event: MediaQueryListEvent) => {
    if (event.matches) {
      cancelAllScrambles();
      resetAllLayers();
    }
  };
  mql?.addEventListener('change', handleReducedMotionChange);

  const onPageHide = () => {
    cancelAllScrambles();
    resetAllLayers();
  };
  window.addEventListener('pagehide', onPageHide);

  return () => {
    delete section.dataset.workMotionReady;
    cancelAllScrambles();
    resetAllLayers();
    for (const cleanup of cleanups) {
      cleanup();
    }
    mql?.removeEventListener('change', handleReducedMotionChange);
    window.removeEventListener('pagehide', onPageHide);
  };
}
