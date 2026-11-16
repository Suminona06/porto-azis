# Spec Delta: Public Portfolio

## MODIFIED Requirements

### Requirement: Home Page Hero, Scroll-Reveal Statement, and Dual Marquee
The system SHALL render a borderless Home Hero (`Azis Muhamad Fadli`, role `IT Support, DevOps & Cloud Engineer`, location, live `GMT +7` clock, and summary copy) with zero horizontal divider borders (`border-b`, `border-t`) and zero vertical separator bar between `location` and the live `GMT +7` clock, followed by the scroll-reveal manifesto statement and the dual tilted marquee (engineering domains on the primary Serif track, infrastructure/cloud tools on the monospace track).

#### Scenario: Scroll-reveal statement transitions cleanly and honors reduced motion
- **WHEN** a visitor scrolls through the Home manifesto section
- **THEN** words transition smoothly from muted to full contrast ink (`#000000` in Light, `#ffffff` in Dark), or render immediately at full contrast when `prefers-reduced-motion: reduce` is enabled

#### Scenario: Dual tilted marquee loops without horizontal page overflow
- **WHEN** the Home marquee renders on mobile (320px+) or desktop viewports
- **THEN** the marquee animates smoothly inside an overflow-contained wrapper without introducing horizontal page scrollbars and pauses under `prefers-reduced-motion: reduce`

### Requirement: Circular Quote Motif and Favorite Tech Stack
The system SHALL display a full-viewport centered circular quote motif (`min-h-screen`, `aspect-square`, uniform `2px` solid `--border-strong` stroke, no partial gradient or side-by-side offset) with the owner's motto centered dead-center inside the circle in uppercase geometric Sans-Serif (`Plus Jakarta Sans`, `font-medium`, `tracking-wide`, `leading-snug`), followed by a borderless `MOST FAVORITE TECH` grid rendering 1:1 official brand SVG silhouettes (`LINUX`, `DOCKER`, `KUBERNETES`, `TERRAFORM`, `AWS`, and configured slugs) inside square cards with muted monochrome `#737373` default state and crisp brand-accent or high-contrast highlight on hover and keyboard focus.

#### Scenario: Centered circular quote renders inside uniform 2px ring in Sans-Serif
- **WHEN** a visitor scrolls to the circular quote section on desktop or mobile viewports
- **THEN** the large responsive circle is centered horizontally and vertically with a uniform `2px` solid stroke (`#FFFFFF` in Dark mode, `#000000` in Light mode) and the uppercase `Plus Jakarta Sans` quote sits dead-center inside the ring without clipping or horizontal overflow

#### Scenario: Tech stack logo responds on hover and keyboard focus
- **WHEN** a visitor hovers or focuses a favorite tech card in `MOST FAVORITE TECH`
- **THEN** the authentic 1:1 brand SVG icon transitions smoothly (`0.4s`) from `#737373` monochrome to its brand accent color (or crisp high-contrast `--text-primary` / `#FFFFFF` highlight) alongside a crisp `--border-strong` card highlight and subtle `-2px` lift without shifting layout
