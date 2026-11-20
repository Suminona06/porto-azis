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

function isClipFullyHidden(thumb: HTMLElement): boolean {
  const raw = window.getComputedStyle(thumb).clipPath;
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
      const height = thumb.getBoundingClientRect().height || thumb.offsetHeight;
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

function openThumbCurtain(thumb: HTMLElement | null, entryEdge: RowVerticalEdge): void {
  if (!thumb || prefersReducedMotion()) return;

  const startClip = entryEdge === 'top' ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)';
  if (isClipFullyClippedOrInitial(thumb)) {
    thumb.style.transition = 'none';
    thumb.style.clipPath = startClip;
    // Commit hidden edge start frame synchronously before triggering the 340ms clip-path wipe
    void thumb.getBoundingClientRect();
    thumb.style.transition = '';
  }

  thumb.style.clipPath = 'inset(0% 0% 0% 0%)';
}

function isClipFullyClippedOrInitial(thumb: HTMLElement): boolean {
  return !thumb.style.clipPath || isClipFullyHidden(thumb);
}

function closeThumbCurtain(thumb: HTMLElement | null, exitEdge: RowVerticalEdge): void {
  if (!thumb || prefersReducedMotion()) return;

  const endClip = exitEdge === 'bottom' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';
  thumb.style.transition = '';
  thumb.style.clipPath = endClip;
}

/**
 * Orchestrates Selected Work interactions:
 * - Direction-aware vertical clip-path curtain wipe on row thumbnails (zero opacity fade, 340ms exponential out)
 *   with smooth mid-flight reversal continuity.
 * - Snappy ~400ms full-string pure ASCII symbol scramble across Index, Title, and Tech Stack on hover/focus
 *   with instant rAF cancellation & restore on mouseleave/blur so non-hovered rows never scramble.
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
  const rowThumbMap = new Map<HTMLElement, HTMLElement | null>();
  const cleanups: Array<() => void> = [];

  let activeHoveredIndex: number | null = null;
  let lastFocusedIndex: number | null = null;

  rows.forEach((row, index) => {
    rowIndexMap.set(row, index);
    rowThumbMap.set(row, row.querySelector<HTMLElement>('[data-work-thumb]'));
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
      durationMs: 400,
      frameIntervalMs: 48,
      onComplete: () => {
        if (activeCancels.get(row) === cancel) {
          activeCancels.delete(row);
        }
      },
    });
    activeCancels.set(row, cancel);
  };

  const resetAllThumbnails = () => {
    for (const row of rows) {
      const thumb = rowThumbMap.get(row) ?? null;
      if (thumb) {
        thumb.style.transition = '';
        thumb.style.clipPath = '';
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
    const thumb = rowThumbMap.get(row) ?? null;

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
      openThumbCurtain(thumb, entryEdge);
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
      closeThumbCurtain(thumb, exitEdge);
    };

    const onFocus = () => {
      if (activeHoveredIndex === currentIndex) {
        lastFocusedIndex = currentIndex;
        return;
      }
      const entryEdge: RowVerticalEdge =
        lastFocusedIndex !== null && currentIndex < lastFocusedIndex ? 'bottom' : 'top';
      lastFocusedIndex = currentIndex;
      openThumbCurtain(thumb, entryEdge);
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
      closeThumbCurtain(thumb, exitEdge);
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
      resetAllThumbnails();
    }
  };
  mql?.addEventListener('change', handleReducedMotionChange);

  const onPageHide = () => {
    cancelAllScrambles();
    resetAllThumbnails();
  };
  window.addEventListener('pagehide', onPageHide);

  return () => {
    delete section.dataset.workMotionReady;
    cancelAllScrambles();
    resetAllThumbnails();
    for (const cleanup of cleanups) {
      cleanup();
    }
    mql?.removeEventListener('change', handleReducedMotionChange);
    window.removeEventListener('pagehide', onPageHide);
  };
}
