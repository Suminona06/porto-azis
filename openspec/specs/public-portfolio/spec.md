# public-portfolio Specification

## Purpose

Defines the public portfolio pages (Home, About, and Work) tailored for Azis Muhamad Fadli as an IT Support, DevOps, and Cloud Engineer, preserving the reference layout structure, signature interactions, bilingual switching, and direct external links.

## Requirements

### Requirement: Bilingual Route and Locale Switching Across Portfolio Pages
The system SHALL support `EN` and `ID` views controlled by the navbar `EN / ID` switcher, translating all static UI labels and resolving localized CMS copy with automatic fallback on `/`, `/about`, and `/work`.

#### Scenario: Visitor switches language from EN to ID on Home
- **WHEN** a visitor clicks `ID` in the `EN / ID` switcher
- **THEN** navigation labels, section headings, CTAs, and localized profile/project copy update to Indonesian and persist across page navigation

### Requirement: Home Page Hero, Scroll-Reveal Statement, and Dual Marquee
The system SHALL render the Home Hero (`Azis Muhamad Fadli`, role `IT Support, DevOps & Cloud Engineer`, location, live `GMT +7` clock, and summary copy), followed by the scroll-reveal manifesto statement and the dual tilted marquee (engineering domains on the primary Serif track, infrastructure/cloud tools on the monospace track).

#### Scenario: Scroll-reveal statement transitions cleanly and honors reduced motion
- **WHEN** a visitor scrolls through the Home manifesto section
- **THEN** words transition smoothly from muted to full contrast ink (`#000000` in Light, `#ffffff` in Dark), or render immediately at full contrast when `prefers-reduced-motion: reduce` is enabled

#### Scenario: Dual tilted marquee loops without horizontal page overflow
- **WHEN** the Home marquee renders on mobile (320px+) or desktop viewports
- **THEN** the marquee animates smoothly inside an overflow-contained wrapper without introducing horizontal page scrollbars and pauses under `prefers-reduced-motion: reduce`

### Requirement: Circular Quote Motif and Favorite Tech Stack
The system SHALL display the circular progress/quote ring motif containing the owner's motto followed by the `MOST FAVORITE TECH` logo grid whose icons shift from muted grayscale to full opacity/color on hover or tap focus without shifting layout.

#### Scenario: Tech stack logo responds on hover and keyboard focus
- **WHEN** a visitor hovers or focuses a favorite tech logo
- **THEN** the logo transitions smoothly (`0.4s`) from grayscale (`opacity: 0.7`) to full color/contrast (`opacity: 1`) with subtle `-2px` lift

### Requirement: Interactive Selected Work Showcase with Direct External Links
The system SHALL render `Selected Work` on Home (featured projects) and `/work` (full project list + total count summary), displaying numbered project rows (`01`, `02`, ...) with tech stack labels, text scramble hover animation on desktop, hover/focus project preview banner, and direct external URL links (`target="_blank" rel="noopener noreferrer"`).

#### Scenario: Clicking a project row opens its external destination
- **WHEN** a visitor clicks a project item on Home or `/work`
- **THEN** the browser opens the project's configured external URL in a new tab with safe `rel` attributes

#### Scenario: Hovering a project row on desktop triggers scramble and preview
- **WHEN** a desktop visitor hovers or focuses a project row that has a preview image
- **THEN** the row displays the project preview banner with fixed dimensions (no layout shift) and runs a brief character-scramble effect that settles back onto the exact project title

### Requirement: About Page Narrative, Expandable Skills Accordion, and Milestones
The system SHALL render `/about` with the headline and profile photo, `A Journey of Progression` narrative, engineering philosophy with interactive `+`/`-` skills accordion (`aria-expanded`), expandable `Activities & Milestones` entries revealing photo/description/location/year, `Personal Interest` with photo, and closing CTA.

#### Scenario: Visitor expands and collapses skill groups and milestones
- **WHEN** a visitor clicks or presses `Enter`/`Space` on a skill category or milestone row on `/about`
- **THEN** the panel expands or collapses in place, toggles its `+`/`-` indicator and `aria-expanded` attribute, and displays the stored details and photo

### Requirement: Direct External Contact CTAs Across Portfolio Pages
The system SHALL route `GET IN TOUCH →` (Home and Work) and `CONTACT ME →` (About) directly to the owner's configured external contact URL (such as `mailto:` or preferred contact link) with no intermediate form dead-end.

#### Scenario: Visitor activates a Contact CTA button
- **WHEN** a visitor clicks `GET IN TOUCH →` or `CONTACT ME →`
- **THEN** the link invokes the configured external contact URL directly (`mailto:` or external URL)
