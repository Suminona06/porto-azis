# Spec: Landing Page Motion

## Purpose

Defines the monochrome editorial motion system and scroll choreography across Azis Muhamad Fadli's portfolio website, delivering an every-load multilingual preloader across all public pages (excluding CMS `/admin` routes) alongside jitter-free GSAP hero entrance animations, interactive monospace feedback, live `GMT +7` metadata, and layered sticky scroll depth on `/` integrated with dual-theme (`Light`/`Dark`) and bilingual (`EN`/`ID`) CMS content.

## ADDED Requirements

### Requirement: Multilingual Preloader & Curtain Transition
The system SHALL display a full-screen `#000000` preloader overlay on every initial load, route navigation, and reload across all public website pages (`/`, `/about`, `/work`, `/blog`, `/blog/[slug]`) before revealing the target page, unless `prefers-reduced-motion: reduce` is active. CMS admin routes (`/admin`, `/admin/*`) SHALL NOT display the preloader overlay.

#### Scenario: Loading progress & localized label cycling
- **WHEN** any public website page (`/`, `/about`, `/work`, `/blog`, `/blog/[slug]`) loads or reloads with reduced motion disabled
- **THEN** a centered uppercase serif label SHALL cycle smoothly through localized loading strings (`"LOADING"` -> `"MEMUAT"` -> `"로딩 중"`), paired with a bottom-right `#FFFFFF` monospace percentage counter (`0%`–`100%`) and a full-width `3px` `#FFFFFF` horizontal progress bar pinned to the bottom viewport edge (`scaleX: 0` to `1`).

#### Scenario: Preloader exit wipe
- **WHEN** loading progress reaches `100%`
- **THEN** a solid `#FFFFFF` vertical curtain panel SHALL wipe upward cleanly across the viewport in a single continuous GPU-composited pass (`duration: 600ms`, easing `[0.77, 0, 0.175, 1]`) without scrollbar width jump or velocity stutter to transition cleanly into the active page (and trigger the hero entrance when on `/`) in the visitor's active Light or Dark theme.

#### Scenario: Reloads trigger the preloader smoothly without scroll-restoration, hash loss, or FOUC jitter
- **WHEN** the visitor reloads any public page or opens a deep-link fragment URL (e.g., `/blog/[slug]#section`) with reduced motion disabled
- **THEN** the system SHALL stabilize scroll restoration and scrollbar gutter before first paint, conceal page content beneath the `#000000` preloader overlay with zero unstyled flash, execute the unbroken preloader and curtain sequence, restore `#hash` fragment scroll position if present during curtain occlusion (or reset to top otherwise), and launch the hero entrance when on `/`.

#### Scenario: CMS admin routes bypass the preloader immediately
- **WHEN** the visitor opens or reloads `/admin` or `/admin/login`
- **THEN** `.preloader-active` SHALL NOT be applied and the CMS interface or sign-in form SHALL render immediately without preloader overlay obstruction.

### Requirement: Hero Entrance Choreography
The system SHALL execute a synchronized 3-part GSAP entrance sequence on the homepage hero immediately after the preloader curtain exits (or immediately render static text when `prefers-reduced-motion: reduce` is active), binding animations to Azis Muhamad Fadli's localized CMS profile fields (`site_profile`) with zero layout reflow jitter.

#### Scenario: Primary serif name left-to-right alphabet decode
- **WHEN** the hero section enters after preloader exit
- **THEN** Line 1 (`profile.display_name`, uppercase `Playfair Display` `font-normal`) SHALL animate on GSAP's unified ticker using a progressive left-to-right uppercase alphabetic scramble (`A-Z`, `~35ms`/tick) rendered inside layout-locked word boxes (`0px` height/wrap shift) resolving into the exact final characters over `~1.0s`, while preserving the exact final text in the accessible name for assistive technologies.

#### Scenario: Indented role solid block wipe reveal
- **WHEN** `~0.2s` has elapsed since hero entrance start
- **THEN** Line 2 (`pickLocale(profile.role_en, profile.role_id, locale)`, indented `pl-6 sm:pl-12` in large uppercase bold `Plus Jakarta Sans`) SHALL reveal via an opaque inverse rectangular block (`--bg-inverse`: `#FFFFFF` in Dark mode, `#000000` in Light mode) that expands left-to-right (`origin-left`, `scaleX: 0 -> 1`, `0.4s`) while text is hidden (`opacity: 0`), flips text to `opacity: 1`, and retracts left-to-right (`origin-right`, `scaleX: 1 -> 0`, `0.45s`) using `cubic-bezier(0.77, 0, 0.175, 1)`.

#### Scenario: Bottom-right justified intro paragraph seeded-random word fade-in
- **WHEN** `~0.4s` has elapsed since hero entrance start
- **THEN** individual words in the bottom-right justified intro paragraph (`pickLocale(profile.hero_bio_en, profile.hero_bio_id, locale)`, uppercase geometric Sans-Serif, `text-justify`, `#8A8A8A` in Dark mode) SHALL fade individually from `opacity: 0` to `opacity: 1` (`duration: 0.45s`, `easeOut`) using deterministic seeded randomized delays between `0ms` and `900ms` (non-sequential), preserving inter-word spacing so `text-justify` remains intact.

#### Scenario: Bottom-center looping vertical scroll indicator
- **WHEN** the hero section is rendered with reduced motion disabled
- **THEN** a `1px × 24px` vertical scroll indicator line centered in the borderless bottom meta bar SHALL animate in a smooth `~1.8s` continuous loop (`scaleY: 0 -> 1` from `origin-top`, then `scaleY: 1 -> 0` from `origin-bottom`), pausing statically when `prefers-reduced-motion: reduce` is enabled.

### Requirement: Selected Work Snappy ASCII Symbol Scramble & Direction-Aware Thumbnail Curtain Wipe
The Selected Work section SHALL trigger a snappy `~400ms` full-string pure ASCII punctuation/symbol scramble across all three text columns on row hover/focus with instant cancellation and reset on `mouseleave`/`blur`, paired with a zero-opacity-fade direction-aware vertical `clip-path` thumbnail curtain wipe and zero horizontal layout jitter.

#### Scenario: Snappy full-string ASCII symbol scramble on hover/focus and instant reset on leave
- **WHEN** a Selected Work row receives pointer hover (`mouseenter`) or keyboard focus (`focus`)
- **THEN** all three text columns of that row (fixed-width `w-12 tabular-nums` Index `01` with hover underline, single-line uppercase Sans-Serif Project Title, and `whitespace-nowrap` monospace Tech Stack) SHALL simultaneously scramble all non-space characters using pure ASCII punctuation/symbols (`!@#$%^&*()_+-=[]{}|;:',.<>?/~`) at a `~40ms` throttled `requestAnimationFrame` cadence for `~420ms`, snapping 100% back to the exact original strings simultaneously upon completion (`t >= 420ms`) with zero horizontal or ellipsis jitter, and cancelling immediately (`cancelAnimationFrame` + instant string restore) the millisecond `mouseleave` or `blur` fires so no non-hovered row ever remains scrambling.

#### Scenario: Direction-aware vertical clip-path curtain wipe on thumbnail enter/exit
- **WHEN** the visitor moves the pointer into, across, or out of Selected Work rows on desktop (`md+` / `lg+`) with reduced motion disabled
- **THEN** the isolated row's full-width `.work-layer` (`z-10`, containing the inverted `--work-curtain-bg` backdrop `#000000` Light / `#FFFFFF` Dark and the flushed-right edge-to-edge thumbnail `w-[220px] lg:w-[270px] h-[calc(100%-16px)] my-2 mr-2`, `opacity: 1` at all times) SHALL remain mounted across zero-gap (`gap-0`) rows and animate ONLY `clip-path` via GSAP (`0.55s power3.out` enter, `0.45s power3.inOut` leave) according to vertical travel direction (`prevHoveredIndex` vs `currentHoveredIndex` and `e.clientY` vs row midpoint): wiping open downward (`inset(0% 0% 100% 0%)` -> `inset(0% 0% 0% 0%)`) and closed downward (`inset(0% 0% 0% 0%)` -> `inset(100% 0% 0% 0%)`) when moving down, wiping open upward (`inset(100% 0% 0% 0%)` -> `inset(0% 0% 0% 0%)`) and closed upward (`inset(0% 0% 0% 0%)` -> `inset(0% 0% 100% 0%)`) when moving up, smoothly inverting the `z-20` `mix-blend-difference` text layer across the curtain edge and reversing smoothly mid-flight without snapping during rapid sweeps. Under `prefers-reduced-motion: reduce`, `clip-path` wipe and symbol scrambles SHALL be bypassed with static text and a `150ms` opacity `.work-layer` hover fallback.

### Requirement: Interactive Monospace Micro-Interactions & Live Metadata
The hero footer and fixed header SHALL provide tactile monospace feedback and real-time timezone metadata across both Light and Dark themes while maintaining WCAG AA contrast and `DESIGN.md` button hierarchy.

#### Scenario: Location text hover, focus, and tap scramble
- **WHEN** the user hovers over, focuses via keyboard, or taps the hero footer monospace location label (`profile.location`)
- **THEN** the trailing characters SHALL scramble into random alphanumeric/numeric glyphs for `350ms` before resolving back to the exact `profile.location` string without causing layout shift or clipping.

#### Scenario: Live timezone clock
- **WHEN** the hero section is mounted
- **THEN** the hero footer monospace clock SHALL render and update in real time in the `Asia/Jakarta` timezone formatted as `hh:mm A (GMT +7)`.

#### Scenario: Fixed translucent navbar & borderless header controls
- **WHEN** the user scrolls past the initial fold
- **THEN** the top navigation bar (`position: fixed`, `z-index: 50`) SHALL maintain a borderless theme-adaptive translucent backdrop (`--bg-primary` at 80% opacity with `backdrop-blur-sm`) with borderless `EN / ID` and theme toggle controls, while the `BLOG` header action retains its sharp rectangular (`rounded-none`) high-contrast inversion and primary page contact CTA buttons (`GET IN TOUCH →`) retain the `DESIGN.md` `33554400px` pill shape.

### Requirement: Sticky Hero Overlap & Scroll-Scrubbed Text Illumination
The transition from the Hero section to the Statement/About section on `/` SHALL use layered sticky depth and scroll-linked typography contrast compatible with Light and Dark themes and WCAG AA readability.

#### Scenario: Curtain-over-hero sticky scroll
- **WHEN** the user scrolls vertically from the initial hero viewport into the Statement/About section
- **THEN** the borderless Hero container SHALL remain pinned (`position: sticky; top: 0; z-index: 0`, cleared below the fixed header and safe on mobile `svh` heights, with zero horizontal or vertical divider bars in the hero footer) while the Statement/About section (`z-index: 10`, opaque `--bg-alt` surface with a `1px solid var(--border-light)` top hairline border) and all downstream homepage sections (`z-index: 10`) slide smoothly upward over it without bleed-through or horizontal overflow.

#### Scenario: Scroll-scrubbed word-by-word contrast reveal
- **WHEN** the user scrolls through the large uppercase localized Statement (`pickLocale(profile.statement_en, profile.statement_id, locale)`)
- **THEN** each word SHALL transition sequentially from WCAG AA compliant muted ink (`--text-muted`: `#52525b` in Light, `#a1a1aa` in Dark) to full-contrast primary ink (`--text-primary`: `#000000` in Light, `#ffffff` in Dark) scrubbed directly to vertical scroll progress, and reverse smoothly when scrolling back up.

### Requirement: Reduced-Motion Accessibility & Static Fallback
The homepage motion system SHALL respect user motion preferences and remain resilient if animation scripts are bypassed or delayed.

#### Scenario: Reduced motion renders static high-contrast states immediately
- **WHEN** `prefers-reduced-motion: reduce` is enabled on the user's device
- **THEN** the system SHALL bypass the preloader overlay, vertical curtain wipe, title cipher decode, subtitle block mask, bio staggered fade-in, location hover scramble, and scroll-scrubbing, rendering all hero and statement typography immediately at full `--text-primary` contrast while still displaying live `hh:mm A (GMT +7)` clock updates.
