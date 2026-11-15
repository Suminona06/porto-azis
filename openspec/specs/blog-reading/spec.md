# blog-reading Specification

## Purpose

Defines the cozy, documentation-friendly Blog index and article reader designed in alignment with DESIGN.md and editorial Read ergonomics for Azis Muhamad Fadli's technical guides and experience sharing.

## Requirements

### Requirement: Editorial Blog Index with Category Filtering and Search
The system SHALL render `/blog` with an editorial header matching the site's typography and grid grammar, displaying published posts ordered newest-first with title, excerpt, category, reading time, publication date, and language badge (`ID` or `EN`), plus category filter controls and keyword search.

#### Scenario: Visitor filters and searches published articles
- **WHEN** a visitor selects a category filter or types a query into the labeled blog search input
- **THEN** the list updates to show only matching published articles and displays the active filter state clearly

#### Scenario: Blog index handles empty, filtered-empty, and error states
- **WHEN** zero posts are published, a filter/search yields zero matches, or the database query fails
- **THEN** the page renders an explicit empty, zero-match (with a "Reset filter" button), or error state with a retry link instead of a blank screen

### Requirement: Cozy Long-Form Reading Column and Wayfinding
The system SHALL render `/blog/[slug]` with a calm reading column constrained to 65ch-72ch width, generous line-height (`1.75`), accessible high-contrast ink on Light (`#ffffff`/`#fafafa`) and soft-charcoal Dark (`#09090b`) surfaces, an auto-generated Table of Contents (collapsible on mobile, sidebar on desktop), and Previous/Next article navigation.

#### Scenario: Reader opens a technical article on desktop or mobile
- **WHEN** a visitor opens `/blog/[slug]` on mobile or desktop
- **THEN** headings link cleanly from the Table of Contents, body prose stays within a comfortable reading measure without horizontal overflow, and Previous/Next links navigate to adjacent posts

### Requirement: Technical Documentation Code Blocks with Copy Action
The system SHALL render sanitized Markdown elements (headings, lists, blockquotes, responsive tables, inline images with explicit dimensions/aspect-ratio) and style fenced code blocks in `JetBrains Mono` with a language label and an accessible Copy button providing visible and screen-reader feedback.

#### Scenario: Reader copies a configuration or command snippet
- **WHEN** a visitor activates the Copy button on a fenced code block
- **THEN** the snippet text is copied to the clipboard and the button updates its visible label and `aria-live` status to confirm copy success

### Requirement: Flexible Single-Language and Linked-Translation Display
The system SHALL display every published article regardless of UI locale (`EN` or `ID`), mark each article's authored language badge (`ID` / `EN`), and surface a quiet translation notice or direct link if a linked counterpart exists in the active locale.

#### Scenario: Indonesian article viewed while UI locale is EN
- **WHEN** a visitor in `EN` mode opens or lists a post authored only in `ID`
- **THEN** the post remains visible with its `ID` language badge and a brief notice indicating the article is written in Indonesian
