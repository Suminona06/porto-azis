# Spec: Design System & Theming

## Purpose

Defines the shared visual tokens, Light-default and Dark theme switching, typography, responsive navigation shell, bilingual switcher, and accessibility guarantees across the portfolio, blog, and admin surfaces.

## ADDED Requirements

### Requirement: Light Default Theme with Functional Dark Mode Toggle
The system SHALL render Light mode (`#ffffff` canvas, `#fafafa` secondary surface, `#000000` primary ink, `#09090b` secondary ink) by default on initial visit and persist a working Light/Dark toggle (`#000000` dark canvas, `#0a0a0a` dark surface, `#ffffff` light ink) across pages without style breakage or flash of unstyled theme.

#### Scenario: Initial visit defaults to Light mode
- **WHEN** a visitor opens the site with no saved theme preference in browser storage
- **THEN** the system renders the Light theme tokens (`#ffffff` background, `#000000` text) and sets the toggle state to Light

#### Scenario: Visitor switches between Light and Dark themes
- **WHEN** a visitor activates the Light/Dark theme toggle in the header or mobile navigation drawer
- **THEN** the system switches all surface, text, border, and logo tokens to the selected mode, persists the preference, and preserves readability across every route

### Requirement: Design Token Typography and Spacing Discipline
The system SHALL apply `Playfair Display` (600) for editorial display headings, `Plus Jakarta Sans` (400 and 600) for body and UI headings, and `JetBrains Mono` (400) for technical labels and metadata, using the 4px base spacing scale and `33554400px` radius only on pill CTA buttons and the circular quote motif without `box-shadow` elevation.

#### Scenario: Typography and elevation tokens are applied consistently
- **WHEN** any public portfolio or blog page is rendered at desktop or mobile viewports
- **THEN** display titles use `Playfair Display`, body copy uses `Plus Jakarta Sans` (16px base, 1.5 line-height), technical labels use `JetBrains Mono`, and no component uses `box-shadow`

### Requirement: Responsive Navigation Bar, Blog Replacement, and Mobile Drawer
The system SHALL render a fixed header containing the owner wordmark (`AZIS MUHAMAD FADLI`), desktop links `HOME`, `ABOUT`, `WORK`, `BLOG` (replacing the reference `API` button), the `EN / ID` language switcher, and the Light/Dark toggle, collapsing into a full-screen mobile drawer on narrow viewports with labeled menu trigger and `Escape` dismissal.

#### Scenario: Desktop navigation routes to all primary pages
- **WHEN** a visitor views the site on a desktop viewport
- **THEN** the header displays `HOME`, `ABOUT`, `WORK`, `BLOG`, `EN / ID`, and the theme toggle, highlighting the active route with the inverted active link style

#### Scenario: Mobile drawer opens, navigates, and closes cleanly
- **WHEN** a visitor on a mobile viewport activates the labeled menu button and then presses `Escape` or the close button
- **THEN** the mobile drawer opens displaying numbered destinations (`/01 HOME`, `/02 ABOUT`, `/03 WORK`, `/04 BLOG`) plus language and theme controls, and closes cleanly while returning focus to the menu trigger

### Requirement: Global Footer with Live GMT+7 Time and Social Links
The system SHALL render a footer displaying the copyright line for `Azis Muhamad Fadli` (using a standard hyphen instead of an em dash), a live Asia/Jakarta (`GMT +7`) clock, a large central wordmark (`azis`), and external social links sourced from the profile configuration.

#### Scenario: Footer displays live WIB clock and verified external links
- **WHEN** a visitor scrolls to the footer on any public page
- **THEN** the footer displays the live `GMT +7` time, `Azis Muhamad Fadli` copyright without em dashes, and clickable external social links opening safely in new tabs

### Requirement: Copy Hygiene without Em Dashes and Preserved CTA Arrows
The system SHALL prohibit the em dash character (`—`) in all UI copy and sample text, replacing it with commas or standard hyphens (`-`), while preserving the `→` directional arrow on primary contact CTAs.

#### Scenario: UI copy and CTA buttons follow copywriting rules
- **WHEN** any public or admin page renders headlines, descriptions, copyright lines, or CTAs
- **THEN** no em dash (`—`) appears in UI text and primary contact CTAs (`GET IN TOUCH →` / `CONTACT ME →`) display the `→` cue

### Requirement: WCAG AA Contrast, Keyboard Operability, and Responsive Resilience
The system SHALL meet WCAG AA contrast minimums (4.5:1 normal text, 3:1 large text and interactive boundaries) across all static text in both Light and Dark themes, support full `Tab`/`Enter`/`Space`/`Escape` keyboard navigation with visible focus rings, set `cursor: pointer` on enabled controls, prevent horizontal overflow at 320px+ viewports, and honor `prefers-reduced-motion`.

#### Scenario: Static metadata and inactive links remain readable in both themes
- **WHEN** static metadata, timestamps, or inactive navigation links are rendered in Light or Dark mode
- **THEN** their foreground-to-background contrast ratio meets at least 4.5:1

#### Scenario: Keyboard and reduced-motion users operate all interactive controls
- **WHEN** a visitor navigates solely by keyboard or enables `prefers-reduced-motion: reduce`
- **THEN** every link, button, accordion, drawer, and toggle displays a high-contrast focus indicator, activates via keyboard, and disables non-essential motion

