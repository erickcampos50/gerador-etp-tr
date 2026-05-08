# Phase 3: Implement Local Guided Authoring UI - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Mode:** Autonomous discuss synthesis

<domain>
## Phase Boundary

Build a local static browser interface using the structured seed from Phase 2. The UI must support guided fields, explicit choices, contextual notes, live preview and validation. It must not add backend, login, storage or original AGU/CGU endpoint calls.
</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- Use plain HTML, CSS and JavaScript to keep the v1 local and dependency-free.
- Use `app/model-data.js` as the structured data source.
- Render notes as authoring-only contextual help.
- Treat user field values as untrusted and escape them before preview insertion.

### Claude's Discretion

- Exact visual styling, provided it preserves a two-pane guided authoring experience.
</decisions>

<specifics>
## Specific Ideas

- Create `app/index.html`, `app/styles.css` and `app/app.js`.
- Use the Ger@AGU-like two-pane pattern: controls on the left, legal preview on the right.
- Use native browser APIs only.
</specifics>

<deferred>
## Deferred Ideas

- Final printable HTML export is Phase 4.
</deferred>
