# About Page Specification

## Purpose

Defines the 1:1 reference-aligned About page (`/about`) experience, shared entrance motion behaviors across Home and About, sticky asymmetric split narrative layout, scroll-scrubbed word-by-word journal illumination, minimalist `/00-2` Tech Stack intro and borderless vertical monospace accordion, `/00-3` Activities & Milestones scroll-driven sticky stacked card deck with full-bleed panoramic media overlays, `/00-4` Personal Interest 2-column asymmetric split with vertical media-and-copy rhythm and dual scroll-scrubbed word illumination, and reduced-motion accessibility while preserving Azis Muhamad Fadli's personal engineering bio, bilingual (`EN` / `ID`) CMS integration, and Light/Dark theme support.

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
The system SHALL continue sourcing localized About content (`EN` / `ID` with automatic fallback) from the CMS data layer (`about_sections`, `skill_groups`, `activities`, and `site_profile`), render Light and Dark themes legibly across all refactored sections, and preserve the closing Contact CTA section downstream.

#### Scenario: Switching locale updates About Hero metadata, headline, 3-paragraph journal, Tech Stack, Activities & Milestones, and Personal Interest
- **WHEN** a visitor toggles between `EN` and `ID` on `/about`
- **THEN** the top metadata micro-labels, 2-line Hero display lockup, `A JOURNEY OF PROGRESSION` heading, 3-paragraph narrative, Tech Stack philosophy intro (`philosophy_en`/`philosophy_id`) and `skill_groups` categories, Activities & Milestones heading/metadata/cards (`activities`), Personal Interest `/00-4` 2-line heading and 2-paragraph narrative (`interest_en`/`interest_id`), and downstream closing Contact CTA SHALL render in the active language with automatic fallback if a translation is empty

### Requirement: Reduced-Motion Accessibility for About Motion & Primitives
The system SHALL respect `prefers-reduced-motion: reduce` across all shared entrance primitives, the scroll-scrubbed journal, and the Tech Stack section, rendering full-contrast static states from first paint and responding immediately if the user's motion preference changes at runtime.

#### Scenario: Reduced motion bypasses scrambles, wipes, clip-paths, scroll scrubbing, and accordion transitions
- **WHEN** `prefers-reduced-motion: reduce` is enabled
- **THEN** the About Hero headline lines, monochrome portrait, all 3 paragraphs of the Journey journal, and the Tech Stack header, dividers, and accordion expand/collapse states SHALL bypass character scrambles, block mask wipes, vertical clip-path transitions, scroll-scrubbed dimming, and height/stagger/rotation animations, rendering immediately at crisp static contrast

### Requirement: Tech Stack Section Header & Introductory Statement (1:1 Parity)
The Tech Stack section SHALL replace the oversized uppercase serif block and thick white divider with the exact minimalist left-aligned editorial intro from the reference.

#### Scenario: Micro-index label & sentence-case sans-serif intro
- **WHEN** the user scrolls past the Journey section into the Tech Stack section
- **THEN** the section SHALL render a small uppercase monospace index label `/00-2` (`font-mono text-[11px] tracking-[0.08em] text-[#666666] mb-4` in Dark mode, theme-adapted muted ink in Light mode), followed immediately by a concise engineering philosophy statement in clean **Sentence-Case Sans-Serif** (`font-sans font-normal text-xl sm:text-2xl lg:text-[26px] leading-[1.38] tracking-[-0.01em] max-w-[44ch]`, `#FFFFFF` in Dark mode / `#000000` in Light mode) left-aligned within the main container (`pt-20 pb-14 lg:pt-28 lg:pb-16`), with NO thick `#FFFFFF` horizontal divider rule beneath it

### Requirement: Borderless Accordion Category Rows & Hover Illumination
The expandable category rows SHALL match the exact typography, alignment, hairline dividers, and hover state transitions of the reference while preserving existing IT/DevOps/Cloud engineering domain categories.

#### Scenario: Category row typography & borderless layout
- **WHEN** the category list renders
- **THEN** each category row SHALL omit numeric prefixes (`/01`, `/02`, `/03`, `/04`) and display its title flush-left in **ALL-CAPS geometric Sans-Serif** (`font-sans font-medium uppercase text-[15px] sm:text-base lg:text-[18px] tracking-[0.015em]`), separated by crisp dark hairline borders (`1px solid #222222` top/bottom dividers in Dark mode, theme-adapted hairline in Light mode) with compact vertical row padding (`py-3.5 lg:py-4`)

#### Scenario: Row hover & active text color transition
- **WHEN** a category row is idle or expanded (unhovered)
- **THEN** its title text color SHALL be bright crisp primary ink (`#FFFFFF` in Dark mode, `#000000` in Light mode)
- **WHEN** the user hovers over the row
- **THEN** the category title text color SHALL transition smoothly (`transition-colors duration-300 ease-out`) to muted neutral gray (`#A3A3A3` in Dark mode, theme-adapted muted ink in Light mode) with zero horizontal layout shift

### Requirement: Bare Minimalist + / - Toggle Icon
The accordion toggle indicator SHALL match the bare, borderless vector icon in the reference.

#### Scenario: Borderless + icon and smooth - state transition
- **WHEN** a category row renders on the right edge
- **THEN** it SHALL display a **bare, borderless thin `+` icon** (`14px` size, `1.5px` stroke width, `#FFFFFF` idle color transitioning to `#A3A3A3` on row hover in Dark mode, theme-adapted in Light mode)—completely removing the bordered square box wrapper around the icon
- **WHEN** the user clicks the row to expand or collapse it
- **THEN** the `+` icon SHALL smoothly rotate `180deg` and collapse its vertical bar (`duration: 420ms`, `ease: [0.22, 1, 0.36, 1]`) into a horizontal `-` minus sign when open and rotate/expand back to `+` when closed

### Requirement: Single-Column Vertical Monospace Tech Stack List
The expanded content inside each category SHALL replace horizontal bordered pill boxes with a clean vertical monospace stack preserving all domain items.

#### Scenario: Vertical single-column layout & typography
- **WHEN** a category row is expanded
- **THEN** its tech stack items SHALL render as a **single-column vertical list** (`flex flex-col items-start space-y-1.5 pt-0.5 pb-4`) aligned flush-left directly beneath the category title, with **zero borders, zero background boxes, and zero horizontal wrapping**
- **AND** each item SHALL be styled in **ALL-CAPS Monospace** (`font-mono uppercase text-[10px] sm:text-[11px] tracking-[0.08em] text-[#8A8A8A]` in Dark mode, theme-adapted in Light mode), transitioning smoothly on individual item hover (`hover:text-[#FFFFFF]` / primary ink, `transition-colors duration-200`)

#### Scenario: Independent multi-open accordion behavior
- **WHEN** the user clicks multiple category rows sequentially
- **THEN** multiple categories SHALL be able to remain open simultaneously (independent toggle state per category) without force-closing previously opened rows

### Requirement: Smooth Accordion & Entrance Choreography
All motion in the Tech Stack section SHALL be fluid, GPU-accelerated, and consistent with the rest of the About page.

#### Scenario: Smooth height & staggered item reveal on expand/collapse
- **WHEN** a category row toggles open or closed
- **THEN** the drawer container SHALL animate smoothly between `height: 0, opacity: 0` and `height: "auto", opacity: 1` (`duration: 560ms`, `ease: [0.22, 1, 0.36, 1]`, `overflow: hidden`), while the vertical monospace items inside reveal with a gentle staggered fade/slide (`y: -6px -> 0`, `40ms` stagger per item)

#### Scenario: Viewport entrance & reduced-motion accessibility
- **WHEN** the Tech Stack section enters the viewport
- **THEN** the `/00-2` label, intro statement, and category dividers SHALL enter smoothly using the shared About page reveal timing (`once: true`), and when `prefers-reduced-motion` is enabled, all animations SHALL bypass transitions to render static `#FFFFFF` / `#A3A3A3` (or Light theme equivalent) states immediately

### Requirement: Activities & Milestones Section Header (1:1 Parity)
The section header SHALL replace the standalone serif title and thick white divider rule with the exact micro-indexed editorial header from the reference.

#### Scenario: Micro-index, serif display heading, and dual metadata sub-row
- **WHEN** the Activities & Milestones section renders
- **THEN** it SHALL display:
  1. Top monospace micro-index `/00-3` (`font-mono text-[11px] tracking-[0.08em] text-[#666666] mb-3`).
  2. Uppercase editorial Serif heading `ACTIVITIES & MILESTONES` (`font-serif uppercase text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-[-0.01em]`).
  3. A sub-header metadata row (`mt-3 mb-10 lg:mb-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-[#737373] uppercase`) containing dot-separated domain keywords on the left and `(ACTIVITIES / '24–'26)` on the right—with NO thick `#FFFFFF` horizontal divider rule beneath it.

### Requirement: Scroll-Driven Sticky Stacked Card Deck (Accordion Stack)
The milestone items SHALL replace the `[+]`/`[-]` bordered box accordion and white-framed split cards with a **scroll-driven sticky stacked card deck** matching the reference video 1:1.

#### Scenario: Incremental sticky header stacking on vertical scroll
- **WHEN** the user scrolls vertically through the Activities & Milestones section
- **THEN** each milestone card `i` (`0, 1, 2, ...`) SHALL use `position: sticky` with an incremental top offset below the fixed navbar (`top: calc(var(--navbar-height, 64px) + i * 48px)` on desktop; `top: calc(var(--navbar-height, 56px) + i * 44px)` on mobile) and ascending `z-index` (`10 + i`), so each subsequent card's dark header bar slides smoothly upward over the preceding card's photograph and docks cleanly beneath the previous header bar.
- **WHEN** the user scrolls back upward
- **THEN** the stacked header bars SHALL un-dock smoothly in reverse sequence without layout jitter.

#### Scenario: Click-to-scroll header navigation
- **WHEN** the user clicks any pinned or visible card header bar
- **THEN** the viewport SHALL smoothly scroll (`behavior: 'smooth'`) to that card's corresponding vertical anchor position.

### Requirement: Sticky Card Header Bar Typography & Status Dot
Each card's top header strip SHALL match the exact typography, contrast, and right-hand dot indicator of the reference.

#### Scenario: Header bar structure, colors, and hover illumination
- **WHEN** a milestone card header bar renders
- **THEN** it SHALL span full container width (`h-11 sm:h-12 px-4 sm:px-6 bg-[#0A0A0A] border-t border-[#262626] flex items-center justify-between gap-4 cursor-pointer select-none group`).
- **THEN** the left side (`flex items-center gap-3 sm:gap-4 min-w-0`) SHALL render the zero-padded monospace index (`/01`, `/02`, etc., `font-mono text-[11px] tracking-[0.06em] text-[#737373] shrink-0`) followed by the milestone title in **ALL-CAPS geometric Sans-Serif** (`font-sans font-semibold uppercase text-xs sm:text-sm lg:text-[16px] tracking-[0.02em] text-[#D4D4D4] group-hover:text-[#FFFFFF] transition-colors duration-300 truncate`), removing any `[SAMPLE]` prefixes.
- **THEN** the right side (`flex items-center gap-2.5 sm:gap-3 shrink-0 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-[#8A8A8A] uppercase`) SHALL render `<CATEGORY> • <YEAR>` followed by a solid circular white dot (`w-1.5 h-1.5 rounded-full bg-white`), completely eliminating `+`/`-` icons and bordered boxes.

### Requirement: Full-Bleed Panoramic Photograph & Bottom-Left Overlay Caption
The body of each card SHALL display an edge-to-edge dark-scrim photograph with overlaid editorial metadata in the bottom-left corner.

#### Scenario: Full-bleed image container, gradient scrim, and subtle hover zoom
- **WHEN** a milestone card body renders directly beneath its sticky header bar
- **THEN** it SHALL occupy a full-width panoramic viewport (`relative w-full h-[360px] sm:h-[460px] lg:h-[540px] overflow-hidden bg-[#111111]`).
- **THEN** the image SHALL cover the full container (`w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]`), covered by a bottom-heavy dark gradient scrim (`bg-gradient-to-t from-black/90 via-black/45 to-black/15`). If no image URL is set yet, render a dark monochrome textured surface (`#141414`) instead of a bright white placeholder box.

#### Scenario: Bottom-left overlaid metadata block
- **WHEN** the card media renders
- **THEN** a content overlay (`absolute bottom-0 left-0 right-0 p-5 sm:p-7 lg:p-9`) with a constrained text column (`max-w-[540px]`) SHALL display:
  1. Uppercase monospace eyebrow subtitle (`font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-[#D4D4D4] uppercase mb-2`).
  2. Concise Sans-Serif description (`font-sans text-xs sm:text-sm lg:text-[15px] leading-[1.55] text-[#EDEDED] mb-4`).
  3. Subtle hairline divider (`border-t border-white/25 pt-2.5 flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.08em] text-[#A3A3A3] uppercase`) showing the city/venue on the left and the year on the right.

### Requirement: Responsive & Accessibility Constraints
The Activities & Milestones card deck SHALL adapt header density and sticky offsets for narrow mobile viewports (`< 640px` / `< 480px`) and honor `prefers-reduced-motion: reduce`.

#### Scenario: Mobile header condensation and capped sticky stacking offsets
- **WHEN** the Activities & Milestones section renders on mobile (`< 640px`)
- **THEN** it SHALL condense header bar height to `44px` (`h-11`), hide the category word on `< 480px` (`hidden min-[480px]:inline`) while keeping `<YEAR> •` visible so the ALL-CAPS milestone title never collides on narrow screens, and cap stacked sticky offset gracefully so cards remain readable.

#### Scenario: Reduced motion disables image zoom and smooth-scroll interpolation
- **WHEN** `prefers-reduced-motion` is enabled
- **THEN** the Activities & Milestones cards SHALL disable image hover zoom scaling and smooth-scroll interpolation while preserving clean static card readability.

### Requirement: 2-Column Asymmetric Split Layout & Micro-Indexed Header (1:1 Parity)
The Personal Interest section SHALL replace the left-stacked paragraph and white wireframe box with the exact 2-column editorial split from the reference video.

#### Scenario: Section spacing, surface, and 12-column desktop grid
- **WHEN** the user scrolls past the Activities & Milestones section into the Personal Interest section
- **THEN** the section SHALL render on a deep `#000000` background with generous vertical padding (`py-24 sm:py-32 lg:py-40`) and a 12-column desktop grid (`grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-12 items-start`).

#### Scenario: Left column micro-index & 2-line serif heading (`lg:col-span-4` or `lg:col-span-5`)
- **WHEN** the left column renders
- **THEN** it SHALL contain ONLY:
  1. Top monospace micro-index `/00-4` (`font-mono text-[11px] tracking-[0.08em] text-[#666666] mb-3 block`).
  2. Two-line uppercase editorial Serif heading `PERSONAL` (line 1) and `INTEREST` (line 2) (`font-serif uppercase text-white text-3xl sm:text-4xl lg:text-[42px] leading-[1.08] tracking-[-0.01em]`).
- **THEN** the left column SHALL align cleanly to the top baseline (`self-start`, non-sticky) with NO body paragraphs beneath it on desktop.

### Requirement: Right Column Vertical Choreography (Paragraph 1 -> Sharp Photo -> Paragraph 2)
The right column (`lg:col-span-8` or `lg:col-span-7`) SHALL sequence two narrative paragraphs sandwiching a full-width borderless photograph.

#### Scenario: Top narrative paragraph (Paragraph 1)
- **WHEN** the right column renders at the same top baseline as `/00-4`
- **THEN** it SHALL display the first personal interest paragraph (`font-sans font-normal text-sm sm:text-base lg:text-[16px] leading-[1.65] max-w-[60ch]`) detailing personal homelab, Proxmox, self-hosted backups, and network experiments outside daily operations.

#### Scenario: Full-bleed sharp rectangular photograph
- **WHEN** Paragraph 1 concludes
- **THEN** directly beneath it (`mt-8 lg:mt-10`), the section SHALL render a sharp-cornered, borderless full-color photograph (`relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-none bg-[#111111] group`) with zero white outer border frames and zero inner text overlay.
- **THEN** hovering over the photograph on pointer devices SHALL apply a subtle, smooth zoom (`w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]`). If no image is configured yet, render a clean dark neutral surface (`#141414`) instead of a bright white wireframe placeholder.

#### Scenario: Bottom narrative paragraph (Paragraph 2)
- **WHEN** the photograph concludes
- **THEN** directly beneath it (`mt-8 lg:mt-10`), the section SHALL render a second balanced narrative paragraph (`font-sans font-normal text-sm sm:text-base lg:text-[16px] leading-[1.65] max-w-[60ch]`) covering personal downtime, continuous reading, and physical/mental recharge outside engineering work.

### Requirement: Dual Scroll-Scrubbed Word-by-Word Illumination
Both Paragraph 1 (above the photo) and Paragraph 2 (below the photo) SHALL reuse the shared scroll-scrubbed text illumination primitive from the Journey section.

#### Scenario: Progressive scroll-linked word illumination & reverse dimming
- **WHEN** the user scrolls vertically through Paragraph 1 and subsequently Paragraph 2
- **THEN** each word SHALL transition sequentially from dim dark gray (`#333333` / `opacity: 0.25`) to pure crisp white (`#FFFFFF` / `opacity: 1`) scrubbed directly to vertical scroll progress (`useScroll` + `useTransform` or GSAP `ScrollTrigger` `scrub: true`), and smoothly dim back to `#333333` when scrolling upward.

### Requirement: Responsive Mobile Layout & Reduced-Motion Accessibility
The Personal Interest section SHALL stack cleanly in reading order on narrow viewports and bypass motion/hover effects when reduced motion is preferred.

#### Scenario: Mobile (`< 1024px`) vertical stacking order
- **WHEN** the Personal Interest section renders on mobile (`< 1024px`)
- **THEN** it SHALL stack elements in a single clean vertical column in exact reading order: (1) `/00-4` + `PERSONAL INTEREST`, (2) Paragraph 1, (3) Full-width `aspect-[16/10]` `rounded-none` photo, and (4) Paragraph 2, maintaining identical font ratios and scroll-scrubbed illumination.

#### Scenario: Reduced Motion (`prefers-reduced-motion`)
- **WHEN** `prefers-reduced-motion` is enabled
- **THEN** the Personal Interest section SHALL bypass scroll-scrubbed opacity transitions and image hover scaling to render crisp static `#FFFFFF` body text immediately.
