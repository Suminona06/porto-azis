# Spec Delta: Public Portfolio

## MODIFIED Requirements

### Requirement: Home Page Hero, Scroll-Reveal Statement, and Dual Marquee
The system SHALL render a borderless full-viewport Home Hero (`min-h-[100svh]`, `#000000` in Dark mode) with top/mid-left Line 1 uppercase Serif `Playfair Display` `font-normal` full name (`Azis Muhamad Fadli`), indented Line 2 (`pl-6 sm:pl-12`) uppercase bold `Plus Jakarta Sans` role (`IT Support, DevOps & Cloud Engineer`), bottom-right justified uppercase geometric Sans-Serif intro paragraph (`max-w-[440px] sm:max-w-[480px] ml-auto text-justify`), and a borderless 3-column bottom meta bar (bottom-left `profile.location`, bottom-center looping `1px × 24px` vertical scroll indicator line, bottom-right live `hh:mm A (GMT +7)` clock), followed by the scroll-reveal manifesto statement and the dual tilted marquee.

#### Scenario: Scroll-reveal statement transitions cleanly and honors reduced motion
- **WHEN** a visitor scrolls through the Home manifesto section
- **THEN** words transition smoothly from muted to full contrast ink (`#000000` in Light, `#ffffff` in Dark), or render immediately at full contrast when `prefers-reduced-motion: reduce` is enabled

#### Scenario: Dual tilted marquee loops without horizontal page overflow
- **WHEN** the Home marquee renders on mobile (320px+) or desktop viewports
- **THEN** the marquee animates smoothly inside an overflow-contained wrapper without introducing horizontal page scrollbars and pauses under `prefers-reduced-motion: reduce`

### Requirement: Interactive Selected Work Showcase with Direct External Links
The system SHALL render `Selected Work` on Home (featured projects) and `/work` (full project list + total count summary) with a baseline-aligned header row containing mixed-weight uppercase Serif title (`<span class="font-normal">SELECTED</span> <span class="font-bold">WORK</span>`) on the left and uppercase monospace project year-span metadata (`(PROJECTS / '24-'25)`) on the right, wrapping zero-gap (`gap-0`) clickable project rows (separated by subtle `1px` dividers inside the full-width row hit target, direct external links with `target="_blank" rel="noopener noreferrer"`) inside an elevated charcoal container (`#0B0B0B` in Dark mode, `#FAFAFA` in Light mode) using a 4-column row layout: fixed `w-12 shrink-0 tabular-nums` monospace index, single-line uppercase Sans-Serif project title, `whitespace-nowrap` monospace tech stack, and a flushed-right inline thumbnail preview slot (`w-[220px] lg:w-[270px] h-[calc(100%-16px)] my-2 mr-2 overflow-hidden relative shrink-0`) with edge-to-edge `w-full h-full object-cover` and no padding frame or border.

#### Scenario: Clicking a project row opens its external destination
- **WHEN** a visitor clicks a project item on Home or `/work`
- **THEN** the browser opens the project's configured external URL in a new tab with safe `rel` attributes

#### Scenario: Hovering a project row on desktop triggers scramble and preview
- **WHEN** a project row receives desktop hover/focus and then loses hover/focus
- **THEN** all three text columns (index, title, tech stack) simultaneously burst into pure ASCII punctuation/symbol characters (`!@#$%^&*()_+-=[]{}|;:',.<>?/~`) for `~420ms` (`~40ms` rAF ticks) before snapping 100% back to exact original text with zero horizontal jitter, resetting instantaneously on `mouseleave`/`blur`, while the full-row `.work-layer` (inverted `--work-curtain-bg` backdrop + flushed-right `opacity: 1` thumbnail) sweeps open/closed using GSAP-driven direction-aware vertical `clip-path` (`0.55s power3.out` enter / `0.45s power3.inOut` leave) and inverts the `mix-blend-difference` text layer seamlessly along the curtain edge.

### Requirement: Circular Quote Motif and Favorite Tech Stack
The system SHALL display a full-viewport centered circular quote motif (`min-h-screen`, `aspect-square`, `2px` `--border-strong` SVG ring animating clockwise from 12 o'clock on vertical scroll over a quiet `1px` `--border-light` track, rendering static full ring under `prefers-reduced-motion: reduce`) with the owner's motto centered dead-center inside the circle in uppercase geometric Sans-Serif (`Plus Jakarta Sans`, `font-medium`, `tracking-wide`, `leading-snug`), followed by a borderless `MOST FAVORITE TECH` row rendering enlarged (`48px`-`56px`) 1:1 official brand SVGs (`LINUX`, `DOCKER`, `KUBERNETES`, `TERRAFORM`, `AWS`, and configured slugs) directly on the canvas with no surrounding square boxes, defaulting to `#737373` monochrome and revealing original brand colors on hover and keyboard focus.

#### Scenario: Centered circular quote renders inside uniform 2px ring in Sans-Serif
- **WHEN** a visitor scrolls through the circular quote section on desktop or mobile viewports
- **THEN** the large responsive circle is centered horizontally and vertically with its `2px` `--border-strong` stroke drawing clockwise on scroll until closed at center viewport (or static full ring under reduced motion), while the uppercase `Plus Jakarta Sans` quote sits dead-center inside the ring without clipping or horizontal overflow

#### Scenario: Tech stack logo responds on hover and keyboard focus
- **WHEN** a visitor hovers or focuses a favorite tech logo in `MOST FAVORITE TECH`
- **THEN** the enlarged borderless 1:1 brand SVG icon transitions smoothly (`0.4s`) from `#737373` monochrome to its original brand colors with subtle `-2px` lift without shifting layout

### Requirement: Direct External Contact CTAs Across Portfolio Pages
The system SHALL render the Contact Banner (`LET'S HAVE A CHAT` on Home/About and `HAVE A PROJECT IN MIND?` on Work, plus localized `ID` equivalents) with mixed display typography—leading phrase (`LET'S HAVE`) in `Playfair Display` italic (`font-display italic font-normal`) and trailing emphasis (`A CHAT`) in `Plus Jakarta Sans` bold (`font-sans-ui font-bold`)—and route `GET IN TOUCH` (Home and Work) and `CONTACT ME` (About) directly to the owner's configured external contact URL (`mailto:` or preferred link) inside a `33554400px` pill CTA featuring a crisp proportional inline SVG right-arrow icon and a rightward-expanding hover/focus transition.

#### Scenario: Contact banner displays mixed italic serif and bold sans-serif headline
- **WHEN** a visitor views the `LET'S HAVE A CHAT` contact banner on `/` (or localized/route CTA headings using `ContactBanner.astro`)
- **THEN** `"LET'S HAVE"` SHALL render in `Playfair Display` italic (`font-normal italic`) and `"A CHAT"` SHALL render in `Plus Jakarta Sans` bold (`font-bold`) on the same editorial display baseline without clipping or horizontal overflow on `320px+` viewports

#### Scenario: Contact CTA pill displays crisp SVG arrow and expands rightward on hover
- **WHEN** a visitor hovers over or keyboard-focuses the `GET IN TOUCH` / `CONTACT ME` pill button (with reduced motion disabled)
- **THEN** the button SHALL display a crisp inline SVG right-arrow icon aligned cleanly with the monospace label and smoothly widen its right edge rightward toward the arrow direction without shifting surrounding elements or breaking `>= 44px` tap target height and WCAG AA contrast

#### Scenario: Visitor activates a Contact CTA button
- **WHEN** a visitor clicks `GET IN TOUCH` or `CONTACT ME`
- **THEN** the link invokes the configured external contact URL directly (`mailto:` or external URL)
