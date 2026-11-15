# Design: Monochrome Editorial Motion System for Homepage

## Context

See [proposal.md](./proposal.md) for motivation and capability boundaries. The codebase (`porto-azis`) runs on **Astro v7 (`output: 'server'`) + Tailwind CSS v4 + TypeScript strict mode** with `@astrojs/vercel` and Supabase SSR. Dependency inspection of `package.json` confirms neither `framer-motion` / `motion` nor `gsap` is installed, and `package-lock.json` designates `npm` as the package manager. Existing portfolio data contracts (`SiteProfile`, bilingual `EN / ID` via `pickLocale`, Light default + `[data-theme="dark"]` CSS tokens, and `DESIGN.md` `33554400px` pill CTAs) are already implemented under `src/`.

## Goals / Non-Goals

**Goals:**
- Standardize homepage motion orchestration on **`gsap`** (core timeline + `gsap/ScrollTrigger`) bundled cleanly inside Astro client `<script>` modules with `gsap.context()` cleanup.
- Deliver the session-scoped multilingual preloader (`LOADING` -> `MEMUAT` -> `로딩 중`), `600ms` vertical curtain wipe, synchronized 3-part Hero entrance (`800ms` cipher decode, `700ms` block mask reveal, `900ms` bio word stagger), `350ms` location scramble, live `hh:mm A (GMT +7)` hero clock, fixed translucent navbar with sharp `rounded-none` header button inversion, sticky Hero overlap, and bidirectional `ScrollTrigger` word reveal.
- Maintain full compatibility with Light default (`#ffffff` / `#fafafa` / `#000000`), Dark toggle (`#000000` / `#0a0a0a` / `#ffffff`), bilingual `EN / ID` switching, WCAG AA contrast (`--text-muted` -> `--text-primary`), zero horizontal overflow on `320px+`, and immediate static fallbacks under `prefers-reduced-motion: reduce`.

**Non-Goals:**
- Installing React, `@astrojs/react`, or `framer-motion` (unnecessary bundle overhead for an Astro site without React islands).
- Changing Supabase schema, `/admin` CMS fields, `/blog` pages, or `SelectedWorkList.astro`'s existing project-row hover scramble.
- Dropping Light mode or altering `ContactBanner.astro`'s `DESIGN.md` pill CTA (`33554400px`).

## Decisions

### 1. GSAP + ScrollTrigger via Astro Client Modules (Not Framer Motion)
- **Decision**: Install `gsap` (`npm install gsap`) and implement animation controllers in dedicated client TypeScript modules (`src/lib/motion/landing-motion.ts`, imported by Astro component `<script>` blocks).
- **Rationale**: `package.json` contains no React integration; `gsap` + `ScrollTrigger` natively drives imperative DOM text scrambling, deterministic timeline chaining (`preloader -> curtain -> hero`), and bidirectional scroll scrubbing (`scrub: true`) without adding React hydration runtime. All GSAP calls remain strictly browser-only inside Astro client scripts (equivalent to `"use client"` isolation in React/Next.js).
- **Alternatives Considered**: Pure `IntersectionObserver` + CSS transitions (already used in `StatementReveal.astro`, but cannot cleanly synchronize multi-stage curtain/decode/mask timelines or smooth bidirectional `ScrollTrigger` scrubs); adding `@astrojs/react` + `framer-motion` (rejected due to unnecessary framework bundle bloat).

### 2. Custom `[0.77, 0, 0.175, 1]` Easing Compatibility
- **Decision**: Implement the editorial easing curve `cubic-bezier(0.77, 0, 0.175, 1)` deterministically using a pure TypeScript cubic-bezier easing function (`src/lib/motion/easing.ts`) registered with GSAP (or passed directly as a custom ease callback `(t: number) => number`, paired with CSS `cubic-bezier(0.77, 0, 0.175, 1)` where CSS transitions apply).
- **Rationale**: GSAP accepts arbitrary easing functions `(progress: number) => number` natively in core `gsap` without relying on extra plugin registration, guaranteeing exact `[0.77, 0, 0.175, 1]` motion fidelity on the curtain wipe and block mask.

### 3. Session-Scoped Preloader Without SSR Flash or Reduced-Motion Flicker
- **Decision**: Add `PreloaderCurtain.astro` only on `/` (`src/pages/index.astro`), gated by an inline synchronous `<head>` check in `BaseLayout.astro` (enabled via `enablePreloader` prop on `/` only) that inspects `sessionStorage.getItem('azis_preloader_seen')` and `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Flow**:
  - **First `/` visit in session (motion enabled)**: `<head>` script sets `html.classList.add('preloader-active')`, keeping `PreloaderCurtain` visible (`z-[var(--z-overlay)]` = `9999`, `#000000` backdrop, `#FFFFFF` uppercase serif cycling `"LOADING"` -> `"MEMUAT"` -> `"로딩 중"`, `#FFFFFF` `0%`–`100%` bottom-right monospace counter, `#FFFFFF` `3px` bottom progress bar `scaleX: 0 -> 1`). When progress hits `100%` (bounded by `document.fonts.ready` + max failsafe timeout `2500ms`), a solid `#FFFFFF` curtain panel wipes upward (`600ms`), writes `sessionStorage.setItem('azis_preloader_seen', '1')`, removes `.preloader-active`, marks preloader `hidden` + `aria-hidden="true"`, and immediately invokes `runHeroEntrance()`.
  - **Repeat `/` visits, `EN / ID` switches, or `prefers-reduced-motion: reduce`**: `.preloader-active` is never set; `PreloaderCurtain` stays `hidden` from first paint, preventing reload friction and ensuring zero LCP/visibility delay.
- **Alternatives Considered**: Running preloader on every `/` load (rejected per user choice A5 so `EN / ID` switching and back-navigation stay fast); hiding hero via default CSS `opacity: 0` (rejected because JS failure or crawlers would see blank hero content).

### 4. Accessible Cipher Decode, Block Mask & Theme-Safe Word Scrubbing
- **Decision**:
  - **Cipher Decode (`HeroSection.astro` `<h1>`)**: Store `data-original-text` on the visual text element and set `aria-label={profile.display_name}` on the `<h1>` (or keep `.sr-only` real text + `aria-hidden="true"` animated span) so screen readers always announce `AZIS MUHAMAD FADLI` rather than random cipher glyphs. During `800ms`, animate progress from `0` to `1` via GSAP tween `onUpdate`, resolving characters left-to-right while scrambling unresolved non-space characters across `A-Z0-9`.
  - **Block Mask Reveal (`HeroSection.astro` role subtitle)**: Wrap localized role text (`roleText`) in a relative `inline-block overflow-hidden` container with an inner text span (initially `opacity: 0`) and an absolute overlay mask (`bg-[var(--bg-inverse)]`, `inset-0`, `transform-origin: left`). GSAP timeline expands mask `scaleX: 0 -> 1` (`originX: 0`), reveals text (`opacity: 1`), switches `transformOrigin: 'right center'`, and retracts `scaleX: 1 -> 0` over `700ms` total.
  - **Bio Paragraph Stagger (`HeroSection.astro`)**: Server-render `bioText` words into `<span data-hero-bio-word>` spans so hydration requires zero DOM text re-splitting (no layout shift), then fade `opacity: 0 -> 1` across randomized/staggered intervals (`900ms`) after headlines settle.
  - **Location Scramble & Live Clock**: Trigger `350ms` trailing-character scramble on `mouseenter`, `focus`, and `pointerdown`/tap (`profile.location`), preserving `aria-label={profile.location}` and exact character count (with `tabular-nums` / monospace sizing to avoid horizontal jitter). Format the hero clock using `Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: true })` + ` (GMT +7)`, rendered server-side at request time and ticked client-side every second.
  - **Theme-Safe Statement Reveal (`StatementReveal.astro`)**: Do NOT bake hardcoded `#ffffff` or `#000000` inline `color` values via GSAP `to(..., { color })`, because toggling Light <-> Dark mode via `ThemeToggle.astro` would leave stale inline colors. Instead, drive each word's active state (`is-revealed` class / `data-revealed="true"` or `--word-reveal` CSS transition between `var(--text-muted)` and `var(--text-primary)`) inside `ScrollTrigger.create({ trigger, start: 'top 80%', end: 'bottom 35%', scrub: true, onUpdate })`. This ensures Light (`#52525b` -> `#000000`), Dark (`#a1a1aa` -> `#ffffff`), and live theme toggles all stay WCAG AA compliant (`7.0:1+`) and reverse smoothly on scroll-up.

### 5. Sticky Hero Stacking Context & Navbar Polish
- **Decision**:
  - Pass `flushTop={true}` from `src/pages/index.astro` to `BaseLayout.astro` so `<main id="main-content">` omits `pt-16` on `/` (keeping `pt-16` on `/about`, `/work`, `/blog`, `/admin`).
  - Give `HeroSection.astro` `sticky top-0 z-0 min-h-[100svh] pt-20 sm:pt-24` so it pins cleanly at `top: 0` while giving hero content clearance below the `64px` fixed navbar (`h-16`) and adapting safely on mobile viewports (`100svh` prevents iOS/Android address-bar clipping).
  - Wrap `StatementReveal` and all subsequent homepage sections (`TiltedMarquee`, `QuoteTechCircle`, `SelectedWorkList`, `ContactBanner`) in `<div class="relative z-10 bg-[var(--bg-primary)]">` (and give `Footer.astro` `relative z-10`), with `StatementReveal` bearing `border-t border-[var(--border-light)]` (mapping to `#1F1F1F` in Dark mode and `rgba(0,0,0,0.12)` in Light mode) and opaque `bg-[var(--bg-alt)]`.
  - Keep `overflow-x: clip` on `body` (never `overflow: hidden` on `body` or `<main>`), because `overflow: hidden` disables `position: sticky` in CSS.
  - Update `Navbar.astro` header backdrop to `bg-[var(--bg-primary)]/80 backdrop-blur-sm` and sharpen header action hover inversion (`nav-link-blog`, `ThemeToggle`, `LocaleToggle` remain `rounded-none` and invert cleanly to `bg-[var(--bg-inverse)] text-[var(--text-inverse)]` on hover), while keeping `.button-primary` (`GET IN TOUCH →` / `CONTACT ME →`) `rounded-full` (`33554400px`) per `DESIGN.md`.

### 6. Reduced Motion Fallback (`prefers-reduced-motion: reduce`)
- **Decision**: Centralize `prefersReducedMotion()` check in `src/lib/motion/landing-motion.ts`. When `true`, skip preloader activation, skip GSAP timelines and `ScrollTrigger` registration, ensure all hero titles, subtitles, bio words, and statement words stay at `opacity: 1` and `var(--text-primary)`, and only run the text-only `hh:mm A (GMT +7)` clock interval. Also add a `matchMedia('(prefers-reduced-motion: reduce)')` change listener to revert GSAP context (`ctx.revert()`) if the user enables reduced motion mid-session.

## Architecture & File Map

```text
src/
  lib/motion/
    easing.ts               # Pure cubic-bezier(0.77, 0, 0.175, 1) evaluator & reduced-motion helper
    text-scramble.ts        # Reusable left-to-right cipher decode & trailing location scramble engine
    clock.ts                # Asia/Jakarta hh:mm A (GMT +7) formatter & ticker
    landing-motion.ts       # GSAP + ScrollTrigger orchestrator (preloader, 3-part hero, statement scrub)
  components/portfolio/
    PreloaderCurtain.astro  # Session-gated #000000 preloader + multilingual label cycle + #FFFFFF curtain
    HeroSection.astro       # Sticky hero, cipher H1, mask subtitle, staggered bio, scramble location, live clock
    StatementReveal.astro   # z-10 opaque curtain band + top hairline + ScrollTrigger word illumination
  components/layout/
    Navbar.astro            # Translucent bg-[var(--bg-primary)]/80 backdrop-blur-sm + rounded-none inversion
    Footer.astro            # relative z-10 layer guard so sticky hero never bleeds through
  layouts/
    BaseLayout.astro        # Optional flushTop + inline head preloader-pending check (no FOUC)
  pages/
    index.astro             # Mounts PreloaderCurtain + sticky HeroSection + z-10 wrapped downstream sections
  styles/
    global.css              # Preloader active lock, dark hairline token (#1F1F1F), reduced-motion safety overrides
tests/
  unit/
    motion-utils.test.ts    # Deterministic unit tests for cubic-bezier easing, clock format, and scramble convergence
```

## Risks / Trade-offs

- **Sticky Ancestor Overflow Trap**: Any `overflow: hidden` or `overflow-x: hidden` on `html`, `body`, or `<main>` disables `position: sticky` on `HeroSection`. → **Mitigation**: Keep `overflow-x: clip` exclusively on `body` (already in `src/styles/global.css`) and avoid `overflow: hidden` on `<main>` or section wrappers outside `TiltedMarquee`.
- **Hero Content Height on Short Viewports / 320px Mobile**: If `HeroSection` content exceeds `100svh` on a 320px-wide or short landscape screen while `position: sticky; top: 0` is active, the bottom hero footer could be overlapped by the incoming Statement curtain too early. → **Mitigation**: Keep `min-h-[100svh]` with compact mobile spacing and test `HeroSection` + sticky transition across `320px`, `375px`, `768px`, and `1280px` viewports (and desktop short-height viewports).
- **Preloader Stall on Slow Font Network**: Waiting forever for `document.fonts.ready` could freeze the preloader at `90%+`. → **Mitigation**: Race `document.fonts.ready` against a hard `1500ms` timeout and attach a `2500ms` safety exit so the hero is always revealed.
- **Smooth Scroll vs. ScrollTrigger Scrub Conflict**: `html { scroll-behavior: smooth; }` in `src/styles/global.css` can lag programmatic or scrub scrolling in some browsers. → **Mitigation**: Verify `ScrollTrigger` scrub smoothness during browser verification and keep `scroll-behavior: auto` when reduced motion is enabled (already in `global.css`).
