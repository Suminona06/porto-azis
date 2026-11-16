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

#### Scenario: Primary serif title cipher decode
- **WHEN** the hero section enters the viewport
- **THEN** the primary serif headline (`profile.display_name`, defaulting to `AZIS MUHAMAD FADLI`) SHALL animate on GSAP's unified ticker using a progressive left-to-right character scramble/decode effect (`A-Z`, `0-9` uppercase glyphs) rendered inside layout-locked word boxes (`0px` height/wrap shift) resolving into the exact final characters over `800ms`, while preserving the exact final text in the accessible name for assistive technologies.

#### Scenario: Secondary subtitle block mask reveal
- **WHEN** the primary title decode begins
- **THEN** an opaque high-contrast rectangular mask (`--bg-inverse`: `#000000` in Light mode, `#FFFFFF` in Dark mode) SHALL expand horizontally across the hero role subtitle (`pickLocale(profile.role_en, profile.role_id, locale)`) bounding box (`scaleX: 0 -> 1`, `originX: 0`) and retract (`scaleX: 1 -> 0`, `originX: 1`) over `700ms` (easing `[0.77, 0, 0.175, 1]`) to uncover the subtitle text.

#### Scenario: Bio paragraph staggered word fade-in
- **WHEN** the hero headlines settle
- **THEN** individual words in the localized hero bio paragraph (`pickLocale(profile.hero_bio_en, profile.hero_bio_id, locale)`) SHALL transition from `opacity: 0` to `opacity: 1` in randomized/staggered intervals (`duration: 900ms`), settling cleanly at full theme contrast.

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
