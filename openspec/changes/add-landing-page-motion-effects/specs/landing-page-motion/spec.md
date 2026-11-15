# Spec: Landing Page Motion

## Purpose

Defines the monochrome editorial motion system and scroll choreography for the portfolio homepage (`/`), delivering a session-scoped multilingual preloader, synchronized hero entrance animations, interactive monospace feedback, live `GMT +7` metadata, and layered sticky scroll depth integrated with Azis Muhamad Fadli's dual-theme (`Light`/`Dark`) and bilingual (`EN`/`ID`) CMS content.

## ADDED Requirements

### Requirement: Multilingual Preloader & Curtain Transition
The system SHALL display a full-screen `#000000` preloader overlay on the visitor's initial load of `/` per browser session before revealing the hero canvas, unless reduced motion is active.

#### Scenario: Loading progress & localized label cycling
- **WHEN** the homepage initializes asset loading from `0%` to `100%` on the first `/` visit in the browser session with reduced motion disabled
- **THEN** a centered uppercase serif label SHALL cycle through localized loading strings (`"LOADING"` -> `"MEMUAT"` -> `"로딩 중"`), paired with a bottom-right `#FFFFFF` monospace percentage counter (`0%`–`100%`) and a full-width `3px` `#FFFFFF` horizontal progress bar pinned to the bottom viewport edge (`scaleX: 0` to `1`).

#### Scenario: Preloader exit wipe
- **WHEN** loading progress reaches `100%`
- **THEN** a solid `#FFFFFF` vertical curtain panel SHALL wipe upward across the viewport (`duration: 600ms`, easing `[0.77, 0, 0.175, 1]`) and dismiss the preloader overlay to reveal the hero in the visitor's active Light or Dark theme.

#### Scenario: Repeat visits within the same session skip the preloader
- **WHEN** the visitor reloads `/` or returns to `/` within the same browser session after the preloader has completed once
- **THEN** the system SHALL skip the preloader overlay and curtain wipe, reveal the hero immediately, and trigger the hero entrance choreography directly.

### Requirement: Hero Entrance Choreography
The system SHALL execute a synchronized 3-part entrance sequence on the homepage hero immediately after the preloader curtain exits (or on immediate mount when the preloader is skipped for repeat session visits), binding animations to Azis Muhamad Fadli's localized CMS profile fields (`site_profile`).

#### Scenario: Primary serif title cipher decode
- **WHEN** the hero section enters the viewport
- **THEN** the primary serif headline (`profile.display_name`, defaulting to `AZIS MUHAMAD FADLI`) SHALL animate using a progressive left-to-right character scramble/decode effect (`A-Z`, `0-9` uppercase glyphs) resolving into the exact final characters over `800ms`, while preserving the exact final text in the accessible name for assistive technologies.

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

#### Scenario: Fixed translucent navbar & sharp header controls
- **WHEN** the user scrolls past the initial fold
- **THEN** the top navigation bar (`position: fixed`, `z-index: 50`) SHALL maintain a theme-adaptive translucent backdrop (`--bg-primary` at 80% opacity with `backdrop-blur-sm`) and sharp rectangular (`rounded-none`) header action controls that invert (`--bg-inverse` / `--text-inverse`) cleanly on hover, while primary page contact CTA buttons (`GET IN TOUCH →`) retain the `DESIGN.md` `33554400px` pill shape.

### Requirement: Sticky Hero Overlap & Scroll-Scrubbed Text Illumination
The transition from the Hero section to the Statement/About section on `/` SHALL use layered sticky depth and scroll-linked typography contrast compatible with Light and Dark themes and WCAG AA readability.

#### Scenario: Curtain-over-hero sticky scroll
- **WHEN** the user scrolls vertically from the initial hero viewport into the Statement/About section
- **THEN** the Hero container SHALL remain pinned (`position: sticky; top: 0; z-index: 0`, cleared below the fixed header and safe on mobile `svh` heights) while the Statement/About section (`z-index: 10`, opaque `--bg-alt` surface with a `1px solid var(--border-light)` top hairline border) and all downstream homepage sections (`z-index: 10`) slide smoothly upward over it without bleed-through or horizontal overflow.

#### Scenario: Scroll-scrubbed word-by-word contrast reveal
- **WHEN** the user scrolls through the large uppercase localized Statement (`pickLocale(profile.statement_en, profile.statement_id, locale)`)
- **THEN** each word SHALL transition sequentially from WCAG AA compliant muted ink (`--text-muted`: `#52525b` in Light, `#a1a1aa` in Dark) to full-contrast primary ink (`--text-primary`: `#000000` in Light, `#ffffff` in Dark) scrubbed directly to vertical scroll progress, and reverse smoothly when scrolling back up.

### Requirement: Reduced-Motion Accessibility & Static Fallback
The homepage motion system SHALL respect user motion preferences and remain resilient if animation scripts are bypassed or delayed.

#### Scenario: Reduced motion renders static high-contrast states immediately
- **WHEN** `prefers-reduced-motion: reduce` is enabled on the user's device
- **THEN** the system SHALL bypass the preloader overlay, vertical curtain wipe, title cipher decode, subtitle block mask, bio staggered fade-in, location hover scramble, and scroll-scrubbing, rendering all hero and statement typography immediately at full `--text-primary` contrast while still displaying live `hh:mm A (GMT +7)` clock updates.
