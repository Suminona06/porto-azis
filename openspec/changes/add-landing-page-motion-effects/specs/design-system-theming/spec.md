# Spec Delta: Design System & Theming

## MODIFIED Requirements

### Requirement: Design Token Typography and Spacing Discipline
The system SHALL apply `Playfair Display` (400, 600, and 700) for editorial display headings (`400` normal on Hero Line 1 and `SELECTED`, `700` bold on `WORK` and the lowercase footer wordmark), `Plus Jakarta Sans` (400, 500, 600, and 700) for body copy, UI headings, Hero Line 2 role, Hero justified intro paragraph, Selected Work project titles, and the centered circular quote motif, and `JetBrains Mono` (400 and 500) for technical labels and metadata, using the 4px base spacing scale and `33554400px` radius only on pill CTA buttons and the circular quote motif without `box-shadow` elevation.

#### Scenario: Typography and elevation tokens are applied consistently
- **WHEN** any public portfolio or blog page is rendered at desktop or mobile viewports
- **THEN** display titles use `Playfair Display` (600, with 700 bold on the lowercase footer wordmark), body copy and the circular quote use `Plus Jakarta Sans` (`font-medium` 500 inside the circle motif), technical labels use `JetBrains Mono`, and no component uses `box-shadow`

### Requirement: Responsive Navigation Bar, Blog Replacement, and Mobile Drawer
The system SHALL render a borderless fixed header containing the owner wordmark (`azis`), desktop links `HOME`, `ABOUT`, `WORK`, `BLOG` (replacing the reference `API` button with a sharp rectangular inverted box), a borderless `EN / ID` slash language switcher, and a borderless Light/Dark toggle, collapsing into a full-screen mobile drawer on narrow viewports with labeled menu trigger and `Escape` dismissal.

#### Scenario: Desktop navigation routes to all primary pages
- **WHEN** a visitor views the site on a desktop viewport
- **THEN** the fixed header renders with zero bottom border (`border-b`) and displays `HOME`, `ABOUT`, `WORK`, inverted `BLOG`, borderless `EN / ID` (separated by `/` without an outer box border or vertical `w-px` rule), and a borderless theme toggle, highlighting the active route with the active link style

#### Scenario: Mobile drawer opens, navigates, and closes cleanly
- **WHEN** a visitor on a mobile viewport activates the labeled menu button and then presses `Escape` or the close button
- **THEN** the mobile drawer opens displaying numbered destinations (`/01 HOME`, `/02 ABOUT`, `/03 WORK`, `/04 BLOG`) plus language and theme controls, and closes cleanly while returning focus to the menu trigger

### Requirement: Global Footer with Live GMT+7 Time and Social Links
The system SHALL render a borderless footer (`#000000` canvas in Dark mode, theme-adaptive `--bg-primary` in Light mode) with zero top or bottom horizontal divider lines, displaying a two-line top-left uppercase monospace metadata block (`© 2026 — AZIS MUHAMAD FADLI` and live `hh:mm A (GMT +7)` Asia/Jakarta clock), a centered bold lowercase `Playfair Display` (`700`) wordmark (`azis`) spanning roughly 85-90% of the container width, and bottom-right uppercase monospace social links (`LINKEDIN`, `GITHUB`, `INSTAGRAM`, `THREADS`), omitting the `CMS` admin link and `BASED IN INDONESIA` footer line.

#### Scenario: Footer displays live WIB clock and verified external links
- **WHEN** a visitor scrolls to the footer on any public page
- **THEN** the footer renders borderlessly with top-left `© 2026 — AZIS MUHAMAD FADLI` stacked above the live `hh:mm A (GMT +7)` clock, the centered bold lowercase `azis` serif wordmark scaled cleanly within 320px+ viewports without overflow, and bottom-right `LINKEDIN`, `GITHUB`, `INSTAGRAM`, `THREADS` links opening safely in new tabs

### Requirement: Copy Hygiene without Em Dashes and Preserved CTA Arrows
The system SHALL prohibit the em dash character (`—`) in all UI copy and sample text, replacing it with commas or standard hyphens (`-`), except for the explicitly owner-approved footer copyright string `© 2026 — AZIS MUHAMAD FADLI` (`antislop` R-37 override), while preserving the `→` directional arrow on primary contact CTAs.

#### Scenario: UI copy and CTA buttons follow copywriting rules
- **WHEN** any public or admin page renders headlines, descriptions, or CTAs
- **THEN** no unapproved em dash (`—`) appears outside `© 2026 — AZIS MUHAMAD FADLI` and primary contact CTAs (`GET IN TOUCH →` / `CONTACT ME →`) display the `→` cue
