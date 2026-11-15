# Design: Monochrome Editorial Motion System for Homepage

## Context

See [proposal.md](./proposal.md) for motivation and capability boundaries. The codebase (`porto-azis`) runs on **Astro v7 (`output: 'server'`) + Tailwind CSS v4 + TypeScript strict mode** with `@astrojs/vercel` and Supabase SSR. Dependency inspection of `package.json` confirms neither `framer-motion` / `motion` nor `gsap` is installed, and `package-lock.json` designates `npm` as the package manager. Existing portfolio data contracts (`SiteProfile`, bilingual `EN / ID` via `pickLocale`, Light default + `[data-theme="dark"]` CSS tokens, and `DESIGN.md` `33554400px` pill CTAs) are already implemented under `src/`.

## Goals / Non-Goals

**Goals:**
- Standardize homepage motion orchestration on **`gsap`** (core timeline + `gsap/ScrollTrigger`) bundled cleanly inside Astro client `<script>` modules with `gsap.context()` cleanup.
- Deliver an **every-load** multilingual preloader (`LOADING` -> `MEMUAT` -> `로딩 중`) and unbroken `600ms` vertical curtain wipe across all public pages (`/`, `/about`, `/work`, `/blog`, `/blog/[slug]`), excluding `/admin` and `/admin/*`, paired on `/` with synchronized GSAP-driven 3-part Hero entrance (`800ms` layout-locked cipher decode, `700ms` block mask reveal, `900ms` bio word stagger), `350ms` location scramble, live `hh:mm A (GMT +7)` hero clock, fixed translucent navbar with sharp `rounded-none` header button inversion, sticky Hero overlap, and bidirectional `ScrollTrigger` word reveal.
- Maintain full compatibility with Light default (`#ffffff` / `#fafafa` / `#000000`), Dark toggle (`#000000` / `#0a0a0a` / `#ffffff`), bilingual `EN / ID` switching, WCAG AA contrast (`--text-muted` -> `--text-primary`), zero horizontal overflow on `320px+`, and immediate static fallbacks under `prefers-reduced-motion: reduce`.

**Non-Goals:**
- Installing React, `@astrojs/react`, or `framer-motion` (unnecessary bundle overhead for an Astro site without React islands).
- Changing Supabase schema, `/admin` CMS fields, `/blog` pages, `SelectedWorkList.astro`'s existing project-row hover scramble, or showing the preloader overlay inside `/admin` or `/admin/login`.
- Dropping Light mode or altering `ContactBanner.astro`'s `DESIGN.md` pill CTA (`33554400px`).

## Decisions

### 1. GSAP + ScrollTrigger via Astro Client Modules (Not Framer Motion)
- **Decision**: Install `gsap` (`npm install gsap`) and implement animation controllers in dedicated client TypeScript modules (`src/lib/motion/landing-motion.ts`, imported by Astro component `<script>` blocks).
- **Rationale**: `package.json` contains no React integration; `gsap` + `ScrollTrigger` natively drives imperative DOM text scrambling, deterministic timeline chaining (`preloader -> curtain -> hero`), and bidirectional scroll scrubbing (`scrub: true`) without adding React hydration runtime. All GSAP calls remain strictly browser-only inside Astro client scripts (equivalent to `"use client"` isolation in React/Next.js).
- **Alternatives Considered**: Pure `IntersectionObserver` + CSS transitions (already used in `StatementReveal.astro`, but cannot cleanly synchronize multi-stage curtain/decode/mask timelines or smooth bidirectional `ScrollTrigger` scrubs); adding `@astrojs/react` + `framer-motion` (rejected due to unnecessary framework bundle bloat).

### 2. Custom `[0.77, 0, 0.175, 1]` Easing Compatibility
- **Decision**: Implement the editorial easing curve `cubic-bezier(0.77, 0, 0.175, 1)` deterministically using a pure TypeScript cubic-bezier easing function (`src/lib/motion/easing.ts`) registered with GSAP (or passed directly as a custom ease callback `(t: number) => number`, paired with CSS `cubic-bezier(0.77, 0, 0.175, 1)` where CSS transitions apply).
- **Rationale**: GSAP accepts arbitrary easing functions `(progress: number) => number` natively in core `gsap` without relying on extra plugin registration, guaranteeing exact `[0.77, 0, 0.175, 1]` motion fidelity on the curtain wipe and block mask.

### 3. Public-Site Every-Load Preloader (Except CMS Admin) Without Jitter or Hash Clobbering
- **Decision**: Centralize `PreloaderCurtain.astro` mounting inside `src/layouts/BaseLayout.astro` with `enablePreloader = !/^\/admin(\/|$)/.test(Astro.url.pathname)` by default (eliminating duplicate prop/component wiring from `src/pages/index.astro`), active on every load or reload of public pages whenever `prefers-reduced-motion: reduce` is NOT enabled.
- **Flow**:
  - **Every public page load/navigation/reload (motion enabled)**: `<head>` inline script synchronously sets `html.classList.add('preloader-active')`, sets `history.scrollRestoration = 'manual'` when `!window.location.hash` (preserving deep-link fragments such as `/blog/[slug]#section`), keeping `PreloaderCurtain` immediately painted (`#000000` backdrop, `#FFFFFF` uppercase serif cycling `"LOADING"` -> `"MEMUAT"` -> `"로딩 중"`, `#FFFFFF` `0%`–`100%` monospace counter, `#FFFFFF` `3px` GSAP-tweened `scaleX: 0 -> 1` progress bar). `html { scrollbar-gutter: stable; }` and dark `html.preloader-active` scrollbar styling avoid horizontal layout shift or white scrollbar flashes.
  - **Unbroken Preloader & Curtain Curve**: Briefly resolve cached fonts up front (`Promise.race([document.fonts.ready, delay(160ms)])`), then run a single continuous `0% -> 100%` GSAP progress tween followed by a single unbroken `600ms` GPU pass (`yPercent: 100 -> -100`, `ease: editorialEase`, `force3D: true`). At exact midpoint (`yPercent <= 0`, full `#FFFFFF` occlusion), hide preloader backdrop, unlock scroll, restore `#hash` anchor target via `scrollIntoView({ behavior: 'instant', block: 'start' })` if present, and seamlessly lift curtain to `-100%` while emitting `azis:preloader-complete` (which triggers the pre-built paused Hero timeline on `/` cleanly and reveals static page content on secondary public pages). A `3200ms` failsafe timeout guarantees the overlay never locks scrolling.
  - **`prefers-reduced-motion: reduce` & CMS Admin routes (`/admin`, `/admin/login`)**: `enablePreloader` evaluates `false` on `/admin*` (and `.preloader-active` is never added under reduced motion); no preloader overlay renders or blocks interactions.
- **Alternatives Considered**: Mounting `<PreloaderCurtain />` in each of the 5 public `.astro` pages manually (rejected due to needless duplication when `BaseLayout.astro` already wraps every HTML route); running preloader on `/admin` too (excluded per user requirement so CMS editing/auth workflows remain instant).

### 4. Accessible Layout-Locked Cipher Decode, Block Mask & GSAP Performance Architecture
- **Decision**:
  - **Layout-Locked GSAP Cipher Decode (`HeroSection.astro` `<h1>` + `text-scramble.ts`)**: Keep `<span class="sr-only">{profile.display_name}</span>` for screen readers, render each uppercase word inside a layout-locked box (`<span class="invisible select-none">` sizing wrapper + `<span class="absolute inset-y-0 left-0 whitespace-nowrap" data-hero-decode>`) so variable-width serif scramble glyphs (`A-Z0-9`) cause `0px` line wrapping or reflow. Drive frame updates inside `gsap.to` on GSAP's unified ticker (`text-scramble.ts`) instead of competing standalone `requestAnimationFrame` loops.
  - **GPU-Composited Block Mask & Staggered Bio (`HeroSection.astro`)**: Wrap localized role text (`roleText`) in a relative `inline-block overflow-hidden` container with a `force3D: true` inverse mask (`scaleX: 0 -> 1 -> 0`, `700ms`, `editorialEase`), and pre-build the paused Hero timeline at mount (behind the opaque preloader) with compositor-only opacity + `4px` micro-rise on pre-split `<span data-hero-bio-word>` spans (`900ms` total) so curtain exit triggers zero style-read thrash.
  - **Location Scramble & Live Clock**: Use GSAP-driven `350ms` trailing-character scramble on `mouseenter`, `focus`, and `click` with locked button `min-width` to avoid width bounce, preserving `aria-label` and rendering `hh:mm A (GMT +7)` via `formatJakartaTime12h`.
  - **Theme-Safe Statement Reveal (`StatementReveal.astro`)**: Drive word active state (`data-revealed="true"`) inside `ScrollTrigger.create({ trigger, start: 'top 82%', end: 'bottom 35%', scrub: true, onUpdate })` rather than baked GSAP hex `color` tweens so dynamic `ThemeToggle` switches stay live (`#52525b -> #000000` Light / `#a1a1aa -> #ffffff` Dark).

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
    PreloaderCurtain.astro  # Public-site every-load #000000 preloader + multilingual label cycle + #FFFFFF curtain
    HeroSection.astro       # Sticky hero, cipher H1, mask subtitle, staggered bio, scramble location, live clock
    StatementReveal.astro   # z-10 opaque curtain band + top hairline + ScrollTrigger word illumination
  components/layout/
    Navbar.astro            # Translucent bg-[var(--bg-primary)]/80 backdrop-blur-sm + rounded-none inversion
    Footer.astro            # relative z-10 layer guard so sticky hero never bleeds through
  layouts/
    BaseLayout.astro        # Shared layout: flushTop, default enablePreloader=!admin, single <PreloaderCurtain /> mount, head anti-FOUC script
  pages/
    index.astro             # Sticky HeroSection + z-10 wrapped downstream sections (inherits public preloader from BaseLayout)
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
