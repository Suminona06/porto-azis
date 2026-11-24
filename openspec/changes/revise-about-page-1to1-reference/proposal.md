# Proposal: Revise About Page for 1:1 Reference Parity & Shared Motion Primitives

## Why

While the Homepage (`/`) already delivers a choreographed editorial entrance and scroll-scrubbed statement reveal, `/about` (`src/pages/about.astro`) still uses a stacked static hero with boxed padding and a static multi-paragraph bio. Refactoring `/about` to match the reference video 1:1—while extracting the existing Hero motion mechanics from `HeroSection.astro` and `src/lib/motion/landing-motion.ts` into reusable primitives—creates a single motion source of truth across `/` and `/about` and preserves Azis Muhamad Fadli's bilingual (`EN` / `ID`) personal engineering bio and Light/Dark theme support.

## What Changes

- **Extract Shared Motion Primitives (`src/components/motion/` + `src/lib/motion/`):** Extract the existing Homepage Hero entrance animations (`computeCipherFrame` / `computeAlphabetDecodeFrame` character decode and the inverse `scaleX` block mask reveal in `HeroSection.astro` and `src/lib/motion/landing-motion.ts`) into reusable Astro primitives under `src/components/motion/`:
  - `CipherText.astro` (`<CipherText />`): progressive left-to-right character decode (`800ms` default, configurable duration/charset) inside layout-locked text wrappers, triggered on mount or `azis:preloader-complete`.
  - `BlockMaskReveal.astro` (`<BlockMaskReveal />`): solid inverse rectangular wipe mask (`--bg-inverse`, `#FFFFFF` in Dark mode) expanding `scaleX: 0 -> 1` from `origin-left`, revealing the child text, and retracting `scaleX: 1 -> 0` to `origin-right` over `700ms` using `cubic-bezier(0.77, 0, 0.175, 1)` (`editorialEase`).
  - `ImageCurtainReveal.astro` (`<ImageCurtainReveal />`): vertical `clip-path` curtain wipe (`inset(100% 0 0 0)` to `inset(0% 0 0 0)`, `700ms`, `editorialEase`) for sharp rectangular (`rounded-none`) media frames.
  - Refactor `HeroSection.astro` and `src/lib/motion/landing-motion.ts` to consume the shared motion helpers/primitives so `/` and `/about` share one implementation. (Because this codebase is Astro v7 + GSAP with no React or `framer-motion` installed, primitives are authored as `.astro` components backed by shared GSAP/`ScrollTrigger` controllers.)
- **Overhaul About Hero for 1:1 Reference Layout & Minimal Copy Density (`src/pages/about.astro`):**
  - Remove extra stacked paragraphs, bio walls, `/02` eyebrow prefixes, badges, and outer card padding from the About Hero, confining the Hero to a clean `min-h-screen` (`min-h-[100svh]`) viewport with zero overlap between headline and portrait on desktop (`1440px`) and mobile (`375px`).
  - Render the 3-element reference composition:
    1. **Top Metadata Baseline Row:** Two uppercase monospace micro-labels (`text-xs tracking-[0.2em] uppercase`, `#666666` / theme-adaptive muted ink) aligned horizontally directly above the main headline—left `BASED IN INDONESIA` and right `ENGINEER` (localized via `i18n.ts`).
    2. **Staggered 2-Line Display Headline Lockup:** Line 1 in large uppercase editorial Serif (`font-display uppercase tracking-tight`) animated via `<CipherText />` (`800ms` progressive left-to-right decode); Line 2 in large bold uppercase geometric Sans-Serif (`font-sans-ui font-bold uppercase tracking-tight`), indented horizontally (`ml-[12%] md:ml-[16%]`), animated concurrently via `<BlockMaskReveal />` (`700ms`, `editorialEase`).
    3. **Bottom-Right Monochrome Portrait Frame:** Sharp rectangular `3:4` frame (`rounded-none`, grayscale/desaturated filter, `w-[220px] sm:w-[250px] lg:w-[290px]`, anchored bottom-right `self-end`), revealed concurrently via `<ImageCurtainReveal />` (`clipPath: inset(100% 0 0 0)` to `inset(0% 0 0 0)`, `700ms`, `editorialEase`).
- **Build "A Journey of Progression" Sticky Split & Scroll-Scrubbed Journal (`src/pages/about.astro` + `src/lib/motion/about-motion.ts`):**
  - Add generous vertical spacing (`py-24 lg:py-36`), a 12-column asymmetric split (`grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12`), and a bottom `1px solid` hairline divider (`#262626` in Dark mode / `var(--border-light)`).
  - **Left Column (`lg:col-span-5`):** Sticky uppercase Serif heading `A JOURNEY OF PROGRESSION` (`font-display uppercase text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight`, `lg:sticky lg:top-32 self-start`, natural static flow below `1024px`).
  - **Right Column (`lg:col-span-7`):** 3 concise, well-paced paragraphs (`space-y-7 font-sans-ui text-base md:text-lg leading-relaxed max-w-[62ch]`) preserving Azis's personal engineering progression (IT Support frontline -> DevOps & automation -> Cloud infrastructure & observability), with GSAP `ScrollTrigger` (`scrub: true`) bidirectional word-by-word illumination transitioning from dimmed (`#333333` / `opacity: 0.25` in Dark mode, theme-adapted in Light mode) to full contrast (`#FFFFFF` / `var(--text-primary)`).
- **Overhaul Tech Stack Section for 1:1 Reference Parity (`src/pages/about.astro` + `src/components/portfolio/SkillsAccordion.astro` + `src/lib/motion/about-motion.ts`):**
  - Replace the oversized uppercase serif philosophy block and top thick divider beneath `A JOURNEY OF PROGRESSION` with a minimalist left-aligned editorial intro (`pt-20 pb-14 lg:pt-28 lg:pb-16`): monospace micro-index label `/00-2` (`font-mono text-[11px] tracking-[0.08em] text-[#666666] mb-4`) followed by a clean sentence-case sans-serif engineering philosophy statement (`max-w-[44ch]`) preserving `philosophy_en` / `philosophy_id` from CMS (`about_sections`).
  - Refactor `SkillsAccordion.astro` to remove `/01`–`/04` numeric prefixes and bordered `+`/`-` square boxes: render flush-left ALL-CAPS geometric sans-serif category rows (`#A3A3A3` idle -> `#FFFFFF` hover/active in Dark mode, theme-adapted in Light mode) separated by crisp `1px solid #222222` (`var(--tech-divider)`) hairlines with a bare `14px`–`16px` `1.5px`-stroke `+`/`-` morph icon (`300ms`, `[0.22, 1, 0.36, 1]`).
  - Replace horizontal bordered tech badge pills with a flush-left single-column vertical ALL-CAPS monospace list (`#8A8A8A` -> `#FFFFFF` hover) preserving Azis's existing IT/DevOps/Cloud `skillGroups` categories & items and supporting independent multi-open toggle state.
  - Animate expand/collapse smoothly (`height: 0, opacity: 0` <-> `height: auto, opacity: 1` over `380ms`, `[0.22, 1, 0.36, 1]`) with `y: -4px -> 0` `25ms` item stagger, `once: true` section viewport entrance, and `prefers-reduced-motion` static fallback.
- **Preserve Downstream About Sections & Reduced-Motion Accessibility:**
  - Keep existing CMS-backed downstream sections (`ActivitiesList`, `Personal Interest`, `ContactBanner`) intact below the Tech Stack section.
  - Enforce `prefers-reduced-motion: reduce` across all entrance primitives, scroll-scrubbed journal words, and Tech Stack accordion/entrance transitions so crisp static full-contrast states render immediately without cipher scrambles, mask wipes, clip-path transitions, scrubbed fades, or drawer motion.

## Capabilities

### New Capabilities
- `about-page`: Minimalist 1:1 reference-aligned About Hero (`min-h-screen`, metadata baseline row, staggered 2-line `<CipherText />` + `<BlockMaskReveal />` display lockup, bottom-right `<ImageCurtainReveal />` monochrome portrait), shared motion primitives under `src/components/motion/`, sticky 2-column `A JOURNEY OF PROGRESSION` section with bidirectional `ScrollTrigger` word-by-word illumination, minimalist `/00-2` Tech Stack intro with borderless multi-open vertical monospace accordion, and `prefers-reduced-motion` support.

### Modified Capabilities
- None (existing `public-portfolio`, `design-system-theming`, and `landing-page-motion` contracts remain satisfied while `/about` behavior is specified in detail under `about-page`).

## Impact

- **Affected Files (planned for implementation):**
  - New shared motion primitives: `src/components/motion/CipherText.astro`, `src/components/motion/BlockMaskReveal.astro`, `src/components/motion/ImageCurtainReveal.astro`
  - Shared/page motion controllers: `src/lib/motion/text-scramble.ts`, `src/lib/motion/landing-motion.ts`, `src/lib/motion/about-motion.ts` (and/or primitive-level scripts)
  - Pages & components: `src/pages/about.astro`, `src/components/portfolio/HeroSection.astro`, `src/components/portfolio/SkillsAccordion.astro`
  - Content & styles: `src/lib/content/placeholder.ts`, `src/lib/content/i18n.ts`, `src/styles/global.css`, `supabase/migrations/0002_seed_placeholder.sql` (3-paragraph journey, concise 2-line headline, and sentence-case philosophy seed alignment)
  - Unit tests: `tests/unit/motion-utils.test.ts` (and new motion helper tests)
- **Compatibility & Guardrails:** No new npm dependencies required (uses installed `gsap` + `ScrollTrigger`); preserves Supabase `about_sections` / `site_profile` CMS contracts, `EN`/`ID` locale switching, Light/Dark theme CSS tokens, `azis:preloader-complete` synchronization, and WCAG AA static contrast.
