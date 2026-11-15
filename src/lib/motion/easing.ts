/**
 * Cubic-bezier editorial easing and reduced-motion detection utilities.
 */

export const EDITORIAL_EASE_POINTS: readonly [number, number, number, number] = [
  0.77, 0, 0.175, 1,
];

function sampleBezier(u: number, a: number, b: number, c: number): number {
  return ((a * u + b) * u + c) * u;
}

function sampleBezierDerivative(u: number, a: number, b: number, c: number): number {
  return (3 * a * u + 2 * b) * u + c;
}

/**
 * Creates a pure-JS GSAP-compatible ease function for a cubic-bezier(x1, y1, x2, y2) curve.
 * Combines Newton-Raphson iteration with bisection fallback for guaranteed monotonicity.
 */
export function createCubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const solveCurveX = (x: number): number => {
    let u = x;
    for (let i = 0; i < 6; i += 1) {
      const error = sampleBezier(u, ax, bx, cx) - x;
      if (Math.abs(error) < 1e-6) {
        return u;
      }
      const slope = sampleBezierDerivative(u, ax, bx, cx);
      if (Math.abs(slope) < 1e-6) {
        break;
      }
      u -= error / slope;
    }

    let low = 0;
    let high = 1;
    u = x;
    for (let i = 0; i < 16; i += 1) {
      const value = sampleBezier(u, ax, bx, cx);
      if (Math.abs(value - x) < 1e-6) {
        return u;
      }
      if (x > value) {
        low = u;
      } else {
        high = u;
      }
      u = (low + high) * 0.5;
    }
    return u;
  };

  return (progress: number): number => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    return sampleBezier(solveCurveX(progress), ay, by, cy);
  };
}

/**
 * Sharp monochrome editorial ease: cubic-bezier(0.77, 0, 0.175, 1).
 */
export const editorialEase = createCubicBezierEase(...EDITORIAL_EASE_POINTS);

export function getReducedMotionMediaQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

/**
 * Returns true when the user or OS requests reduced motion.
 */
export function prefersReducedMotion(): boolean {
  return Boolean(getReducedMotionMediaQuery()?.matches);
}
