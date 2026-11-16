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
The system SHALL display a full-viewport centered circular quote motif (`min-h-screen`, `aspect-square`, `2px` `--border-strong` SVG ring animating clockwise from 12 o'clock on vertical scroll over a quiet `1px` `--border-light` track, rendering static full ring under `prefers-reduced-motion: reduce`) with the owner's motto centered dead-center inside the circle in uppercase geometric Sans-Serif (`Plus Jakarta Sans`, `font-medium`, `tracking-wide`, `leading-snug`), followed by a borderless `MOST FAVORITE TECH` row rendering enlarged (`48px`-`56px`) 1:1 official brand SVGs (`LINUX`, `DOCKER`, `KUBERNETES`, `TERRAFORM`, `AWS`, and configured slugs) directly on the canvas with no surrounding square boxes, defaulting to `#737373` monochrome and revealing original brand colors on hover and keyboard focus.

#### Scenario: Centered circular quote renders inside uniform 2px ring in Sans-Serif
- **WHEN** a visitor scrolls through the circular quote section on desktop or mobile viewports
- **THEN** the large responsive circle is centered horizontally and vertically with its `2px` `--border-strong` stroke drawing clockwise on scroll until closed at center viewport (or static full ring under reduced motion), while the uppercase `Plus Jakarta Sans` quote sits dead-center inside the ring without clipping or horizontal overflow

#### Scenario: Tech stack logo responds on hover and keyboard focus
- **WHEN** a visitor hovers or focuses a favorite tech logo in `MOST FAVORITE TECH`
- **THEN** the enlarged borderless 1:1 brand SVG icon transitions smoothly (`0.4s`) from `#737373` monochrome to its original brand colors with subtle `-2px` lift without shifting layout
