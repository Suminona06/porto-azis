# Tasks

## 1. Library Check & Installation

- [x] 1.1 Verify `package.json` and `package-lock.json` (`npm` lockfile, Astro v7 without React) and run `npm install gsap`; verify `gsap` is added to `package.json` dependencies and `npm run check` succeeds with `gsap` and `gsap/ScrollTrigger` TypeScript imports.
- [x] 1.2 Implement `src/lib/motion/easing.ts` (pure `[0.77, 0, 0.175, 1]` cubic-bezier evaluator and `prefersReducedMotion()` helper) and `src/lib/motion/clock.ts` (`Asia/Jakarta` `hh:mm A (GMT +7)` formatter and minute/second ticker), plus unit tests in `tests/unit/motion-utils.test.ts`; verify `npm test` and `npm run check` pass.

## 2. Preloader & Curtain Transition

- [x] 2.1 Add session-aware inline `<head>` preloader check (`sessionStorage.getItem('azis_preloader_seen')` and `prefers-reduced-motion`) plus optional `enablePreloader` and `flushTop` props to `src/layouts/BaseLayout.astro` and `.preloader-active` scroll-lock rules in `src/styles/global.css`; verify repeat `/` visits and secondary routes (`/about`, `/work`, `/blog`) render without flash or stuck scroll lock.
- [x] 2.2 Implement `src/components/portfolio/PreloaderCurtain.astro` (`#000000` full-screen overlay, `"LOADING"` -> `"MEMUAT"` -> `"로딩 중"` uppercase `Playfair Display` label cycle, bottom-right `#FFFFFF` `0%`–`100%` `JetBrains Mono` counter, full-width `3px` `#FFFFFF` bottom progress bar `scaleX: 0 -> 1`, and `600ms` upward `#FFFFFF` vertical curtain wipe with `[0.77, 0, 0.175, 1]` easing plus failsafe timeout) and mount it on `src/pages/index.astro`; verify in browser that the preloader runs once per session on `/` and dismisses cleanly into the hero.

## 3. Hero Text Scramble, Block Mask, Micro-Interactions & Live Clock

- [x] 3.1 Implement `src/lib/motion/text-scramble.ts` (progressive `800ms` left-to-right `A-Z0-9` cipher decode and `350ms` trailing-character scramble) and extend `tests/unit/motion-utils.test.ts` to verify exact convergence and whitespace preservation; verify `npm test` passes.
- [x] 3.2 Update `src/components/portfolio/HeroSection.astro` and create `src/lib/motion/landing-motion.ts` to execute the synchronized 3-part post-curtain Hero entrance (`800ms` cipher decode on `profile.display_name` with accessible `aria-label`, `700ms` `--bg-inverse` block mask `scaleX: 0 -> 1 -> 0` over `pickLocale(role_en, role_id)`, and `900ms` staggered word fade-in on `pickLocale(hero_bio_en, hero_bio_id)`), wire the `350ms` hover/focus/tap scramble on `profile.location`, and render the real-time `hh:mm A (GMT +7)` hero clock; verify entrance timing, hover/tap scramble, and live clock in `EN`/`ID` and Light/Dark modes with zero console errors or layout shift.
- [x] 3.3 Update `src/components/layout/Navbar.astro` and `src/styles/global.css` so the fixed `z-index: 50` header uses `bg-[var(--bg-primary)]/80 backdrop-blur-sm` and sharp rectangular (`rounded-none`) header buttons (`BLOG`, `LocaleToggle`, `ThemeToggle`) invert cleanly (`--bg-inverse` / `--text-inverse`) on hover while preserving `DESIGN.md` `33554400px` pill CTAs on `ContactBanner.astro`; verify WCAG AA contrast (4.5:1+) and visible `:focus-visible` outlines across Light and Dark modes.

## 4. Sticky Hero Overlap & Scroll-Scrubbed Statement Illumination

- [x] 4.1 Layer `src/pages/index.astro`, `src/components/portfolio/HeroSection.astro` (`position: sticky; top: 0; z-index: 0; min-h-[100svh]` with header clearance while preserving `overflow-x: clip` on `body`), `src/components/portfolio/StatementReveal.astro` (`relative z-10`, opaque `bg-[var(--bg-alt)]`, `1px solid var(--border-light)` top hairline border matching `#1F1F1F` in Dark mode), downstream homepage sections (`relative z-10`), and `src/components/layout/Footer.astro` (`relative z-10`); verify curtain-over-hero overlap, zero bleed-through, and zero horizontal overflow at `320px`, `375px`, `768px`, and `1280px`.
- [x] 4.2 Replace the inline scroll listener in `src/components/portfolio/StatementReveal.astro` with GSAP `ScrollTrigger` (`scrub: true`) inside `src/lib/motion/landing-motion.ts` so localized statement words transition sequentially between WCAG AA `--text-muted` (`#52525b` Light / `#a1a1aa` Dark) and `--text-primary` (`#000000` Light / `#ffffff` Dark) and reverse smoothly on scroll up without breaking dynamic `ThemeToggle` color switching; verify bidirectional scroll scrubbing and live theme switching in browser tests.

## 5. Reduced-Motion Accessibility Fallback & Verification

- [x] 5.1 Enforce `prefers-reduced-motion: reduce` detection and live media-query listener (`ctx.revert()`) in `src/lib/motion/landing-motion.ts` and `src/styles/global.css` so reduced-motion mode bypasses preloader, curtain wipe, cipher decode, block mask, bio stagger, location scramble, and `ScrollTrigger` scrubbing while rendering static `--text-primary` states and live `hh:mm A (GMT +7)` clock updates; verify with emulated `prefers-reduced-motion: reduce` in Chromium headless checks.
- [x] 5.2 Run `npm run check`, `npm test`, and `npm run build` after final implementation edits, perform headless browser verification across `/`, Light/Dark modes, `EN`/`ID` locales, and `320px`/`375px`/`768px`/`1280px` viewports, and execute the `antislop` Mode `AFTER` audit (`anti-slop/audit-001-YYYY-MM-DD.md`) and Delivery Gate before closing.

## 6. Every-Load Preloader & Jitter-Free GSAP Polish Revision

- [x] 6.1 Update `src/layouts/BaseLayout.astro` (`<head>` inline script: remove `sessionStorage` skip gate so `preloader-active` applies on every `/` load/reload unless reduced motion is active, reset reload scroll restoration manually to `(0, 0)`) and add `scrollbar-gutter: stable` plus clean compositor/reduced-motion safety in `src/styles/global.css`.
- [x] 6.2 Refactor `src/components/portfolio/PreloaderCurtain.astro` to await cached/fast fonts up front (bounded `160ms`), play a single unbroken `0% -> 100%` GSAP progress curve with GPU `scaleX` tweening, execute one continuous `600ms` GPU `yPercent: 100 -> -100` (`[0.77, 0, 0.175, 1]`, `force3D: true`) curtain sweep without mid-screen stop-and-go hitching, and emit `azis:preloader-complete` seamlessly on exit.
- [x] 6.3 Refactor `src/lib/motion/text-scramble.ts`, `src/components/portfolio/HeroSection.astro`, and `src/lib/motion/landing-motion.ts` so cipher decodes and trailing scrambles run on GSAP's unified ticker inside layout-locked word wrappers (`0px` bounding box shift / zero line wrap jitter), pre-build the paused Hero entrance timeline behind the preloader (`force3D: true`, smooth opacity + micro-rise bio stagger, `clearProps` cleanup), lock button min-width during location scramble, and verify zero layout shift across reloads.
- [x] 6.4 Re-run `npm test`, `npm run check`, `npm run build`, and headless Chromium reload/jitter verification (`/` fresh load + reload + `EN`/`ID` + Light/Dark + `320px`/`375px`/`768px`/`1280px` + `prefers-reduced-motion: reduce`), and update the `antislop` Mode `AFTER` audit before closing.

## 7. Site-Wide Public Preloader Rollout (Except CMS Admin)

- [x] 7.1 Update `src/layouts/BaseLayout.astro` to default `enablePreloader = !/^\/admin(\/|$)/.test(Astro.url.pathname)`, mount `<PreloaderCurtain />` inside `BaseLayout.astro` across all public pages (excluding `/admin` and `/admin/login`), guard `history.scrollRestoration = 'manual'` with `!window.location.hash`, update `unlockScroll()` in `src/components/portfolio/PreloaderCurtain.astro` to scroll `#hash` targets cleanly into view after unlocking, and remove redundant `<PreloaderCurtain />` / `enablePreloader={true}` wiring from `src/pages/index.astro`.
- [x] 7.2 Run `npm test && npm run check && npm run build` and verify in headless Chromium across public pages (`/`, `/about`, `/work`, `/blog`, `/blog/[slug]#hash`) and CMS admin routes (`/admin/login`, `/admin` bypass) plus `prefers-reduced-motion: reduce` before completing.

## Workflow follow-up

- Optionally archive `portfolio-cms` (`openspec archive portfolio-cms`) and later `add-landing-page-motion-effects` once implementation and review requirements are satisfied.
- Verify the archived specs in `openspec/specs/` match the delivered behavior.
