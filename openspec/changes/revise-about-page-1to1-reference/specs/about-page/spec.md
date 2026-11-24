# About Page Specification

## Purpose

Defines the 1:1 reference-aligned About page (`/about`) experience, shared entrance motion behaviors across Home and About, sticky asymmetric split narrative layout, scroll-scrubbed word-by-word journal illumination, and reduced-motion accessibility while preserving Azis Muhamad Fadli's personal engineering bio, bilingual (`EN` / `ID`) CMS integration, and Light/Dark theme support.

## ADDED Requirements

### Requirement: Shared Entrance Motion Primitives Behavior
The system SHALL share a single source of truth for entrance reveal behaviors across the Homepage Hero and the About Hero, synchronizing reveal playback with preloader completion (`azis:preloader-complete` or immediate mount when the preloader is already complete or bypassed) without causing layout shift or text wrapping changes.

#### Scenario: Progressive character decode reveals display serif text without layout jitter
- **WHEN** a primary serif headline using the shared character-decode behavior enters on mount or immediately after preloader exit
- **THEN** each word SHALL maintain fixed layout dimensions (`0px` height or line-wrap shift), decode progressively left-to-right into the exact final characters over `800ms` (or the configured duration), and expose the exact unscrambled text to assistive technologies

#### Scenario: Horizontal block mask wipe reveals indented geometric sans-serif text
- **WHEN** an indented bold sans-serif headline using the shared block-mask reveal enters
- **THEN** a solid high-contrast rectangular mask SHALL expand horizontally from the left edge (`scaleX: 0` to `1`) while the underlying text is hidden, flip the text visible at full coverage, and retract horizontally toward the right edge (`scaleX: 1` to `0`) over `700ms` total using cubic-bezier `[0.77, 0, 0.175, 1]`

#### Scenario: Vertical curtain wipe reveals sharp rectangular media frames
- **WHEN** the About Hero portrait frame enters concurrently with the headline lockup
- **THEN** the sharp rectangular (`0px` border radius) image container SHALL animate its visible boundary vertically from bottom to top (`clip-path: inset(100% 0 0 0)` to `inset(0% 0 0 0)`) over `700ms` using cubic-bezier `[0.77, 0, 0.175, 1]`

### Requirement: Minimalist About Hero 1:1 Layout Parity
The system SHALL render the `/about` Hero inside a clean `min-h-screen` viewport containing strictly the 3-element reference composition—removing stacked bio paragraphs, status badges, eyebrow prefixes, and outer boxed card padding—while maintaining zero visual overlap between the headline lockup and the portrait frame across desktop (`1440px`) and mobile (`375px`) viewports.

#### Scenario: Three-element About Hero renders with top metadata row, staggered 2-line headline, and bottom-right portrait
- **WHEN** a visitor loads `/about` on desktop (`1440px`) or mobile (`375px`)
- **THEN** the Hero SHALL render:
  1. a single horizontal top metadata baseline row positioned with generous breathing room below the fixed header (`pt-32 sm:pt-40 lg:pt-44`) directly above the headline displaying two uppercase monospace micro-labels (`BASED IN INDONESIA` on the left and `ENGINEER` on the right, localized when `ID` is active) with `0.2em` tracking and muted ink;
  2. a restrained, reference-proportioned staggered 2-line display headline lockup with Line 1 in uppercase editorial serif (`clamp(1.75rem,3.4vw,3.1rem)`, left-aligned, decoded via the shared character-decode behavior) and Line 2 in bold uppercase geometric sans-serif (`clamp(1.45rem,2.9vw,2.65rem)`) indented slightly to the right beneath Line 1 (`6%` mobile / `7.5%` desktop left margin, revealed concurrently via the shared block-mask wipe); and
  3. a sharp rectangular (`rounded-none`) monochrome/grayscale `3:4` portrait frame (`210px` mobile, `240px` small tablet, `280px` desktop width) anchored cleanly to the bottom-right corner of the Hero container with zero overlap against the headline lockup

### Requirement: Sticky Asymmetric "A Journey of Progression" Split & Scroll-Scrubbed Journal
The system SHALL render a second section below the About Hero with generous vertical padding (`py-24 lg:py-36`), a bottom `1px` hairline border (`#262626` in Dark mode, theme-adapted subtle hairline in Light mode), and a wide asymmetric 12-column desktop split (`lg:col-span-5` single-line sticky heading, `lg:col-start-8 lg:col-span-5` compact `max-w-[52ch]` engineering journal) with bidirectional scroll-scrubbed word-by-word illumination.

#### Scenario: Left column heading remains sticky on desktop and flows statically on mobile
- **WHEN** a visitor scrolls through the "A Journey of Progression" section on a desktop viewport (`>= 1024px`)
- **THEN** the uppercase editorial serif heading `A JOURNEY OF PROGRESSION` (localized `PERJALANAN PROGRESI` in `ID`, sized `1.75rem`–`2rem` so it sits cleanly on a single line on desktop) SHALL remain pinned (`sticky`, `top-32`) in the left 5-column track until the section finishes scrolling out of view
- **AND WHEN** the viewport width is narrower than `1024px` (such as `375px` mobile)
- **THEN** sticky positioning SHALL be disabled so the heading flows naturally above the narrative paragraphs with zero overlapping text

#### Scenario: Three-paragraph personal engineering journal illuminates word-by-word on scroll
- **WHEN** a visitor scrolls downward into the right-hand personal engineering narrative (`lg:col-start-8 lg:col-span-5`, `max-w-[52ch]`, `14px`–`15px` sans-serif with `1.68` line-height, preserving Azis's progression across IT Support, DevOps/automation, and Cloud infrastructure & observability and normalizing escaped newlines)
- **THEN** words entering from the lower viewport SHALL start dimmed (`#333333` / `opacity: 0.25` in Dark mode, theme-adapted dimmed ink in Light mode) and progressively illuminate to full primary contrast (`#FFFFFF` / `opacity: 1` in Dark mode, `#000000` in Light mode) word-by-word in sync with vertical scroll progress, and reverse smoothly back to the dimmed state when scrolling upward

### Requirement: Bilingual CMS Continuity & Downstream About Sections
The system SHALL continue sourcing localized About content (`EN` / `ID` with automatic fallback) from the CMS data layer (`about_sections` and `site_profile`), render Light and Dark themes legibly across all refactored sections, and preserve the downstream Philosophy & Skills Accordion, Activities & Milestones, Personal Interest, and closing Contact CTA sections below the Journey section's bottom hairline divider.

#### Scenario: Switching locale updates About Hero metadata, headline, and 3-paragraph journal
- **WHEN** a visitor toggles between `EN` and `ID` on `/about`
- **THEN** the top metadata micro-labels, 2-line Hero display lockup, `A JOURNEY OF PROGRESSION` heading, 3-paragraph narrative, and downstream CMS sections SHALL render in the active language with automatic fallback if a translation is empty

### Requirement: Reduced-Motion Accessibility for About Motion & Primitives
The system SHALL respect `prefers-reduced-motion: reduce` across all shared entrance primitives and the scroll-scrubbed journal, rendering full-contrast static states from first paint and responding immediately if the user's motion preference changes at runtime.

#### Scenario: Reduced motion bypasses scrambles, wipes, clip-paths, and scroll scrubbing
- **WHEN** `prefers-reduced-motion: reduce` is enabled
- **THEN** the About Hero headline lines, monochrome portrait, and all 3 paragraphs of the Journey journal SHALL bypass character scrambles, block mask wipes, vertical clip-path transitions, and scroll-scrubbed dimming, rendering immediately at crisp full primary contrast
