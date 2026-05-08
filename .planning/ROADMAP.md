# Roadmap: Gerador de Termo de Referencia AGU

**Created:** 2026-05-08
**Granularity:** Coarse
**Execution:** Sequential
**Research:** Skipped during initialization by user choice; enabled for future phase planning.

## Milestone 1: Local TR Generator v1

Goal: deliver a local browser-based tool that converts the current AGU Termo de Referencia model into guided fields, contextual notes, conditional choices and printable HTML output.

## Phase 1: Reverse Engineer Ger@AGU Experience

**Status:** Complete

**Goal:** Understand the interaction patterns worth carrying into the TR generator without inheriting unsafe or irrelevant captured runtime behavior.

**Covers:** REV-01, REV-02, REV-03

**Scope:**
- Inventory the Ger@AGU form, preview, note buttons, validation patterns, output behavior and visual affordances.
- Identify which behaviors are product requirements versus implementation artifacts from the downloaded capture.
- Document reusable UX patterns for notes, choices, highlighted changes and final HTML generation.
- Explicitly exclude or neutralize original backend/session/API behavior.

**Done When:**
- There is a concise engineering note/spec explaining how the new app should emulate the useful Ger@AGU conveniences.
- Risky inherited behaviors such as external endpoints and localStorage/session code are listed as non-goals.
- The next phase has enough context to design the converter.

**Delivered:**

- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`

**Plan:** `.planning/phases/01-reverse-engineer-geragu-experience/01-PLAN.md`

**Wave 1:** Documentation and handoff

- Create `UX-PATTERNS.md` to capture reusable Ger@AGU authoring patterns.
- Create `SAFETY-INVENTORY.md` to define unsafe captured behavior and reuse boundaries.
- Create `PHASE-1-HANDOFF.md` to pass converter metadata and note/output contracts to Phase 2.

**Cross-cutting constraints:**

- Phase 1 remains documentation-only and must not implement app or converter code.
- Original Ger@AGU backend/session/API/localStorage behavior must not be reused.
- Ger@AGU is UX evidence only; `Documentos modelo/` remains the TR source of truth.

## Phase 2: Build TR Model Extraction Contract

**Status:** Complete

**Goal:** Define and implement the conversion layer from the current DOCX/HTML model into structured data usable by the app.

**Covers:** EXT-01, EXT-02, EXT-03, EXT-04, EXT-05, EXT-06, EXT-07

**Scope:**
- Prefer DOCX parsing for canonical extraction of document text, comments, colors, italics, placeholders, alternatives and version/footer data.
- Use the HTML model only where it helps with layout, preview styling or visual cross-checking.
- Create a structured representation for clauses, fixed text, variable red italic text, bracket fields, notes, alternatives, optional blocks and warnings.
- Write detailed conversion instructions so future LLM-assisted extraction treats each semantic signal correctly.
- Add fixtures or snapshots for representative clauses, including the vigencia/prorrogacao `OU` example.

**Done When:**
- The model can be represented as structured data with explicit fields and decision points.
- Notes are attached to relevant clauses or fields where possible.
- Placeholder and unresolved `OU` detection is reliable on representative samples.
- Conversion limitations and ambiguous cases are documented for review.

**Delivered:**

- `tools/extract_docx_model.py`
- `docs/conversion-contract.md`
- `app/model-data.js`

## Phase 3: Implement Local Guided Authoring UI

**Status:** Complete

**Goal:** Build the local browser app for filling the TR through guided fields, notes and conditional decisions.

**Covers:** GUI-01, GUI-02, GUI-03, GUI-04, GUI-05, APP-01, APP-02, APP-03

**Scope:**
- Create a maintainable local web structure for app code, extracted model data and styles.
- Implement guided inputs, selects, checkboxes/radios for alternatives and conditional sections.
- Show notes explicativas contextually using a Ger@AGU-like interaction pattern.
- Render live preview and update it when fields or decisions change.
- Add validation for missing required fields, unresolved placeholders and incompatible choices.
- Ensure no original AGU/CGU endpoint calls are executed.

**Done When:**
- A user can fill representative TR sections through the UI without manually editing raw document text.
- Notes appear at the point of need and do not pollute the final document.
- The app runs locally in a browser without backend services.

**Delivered:**

- `app/index.html`
- `app/styles.css`
- `app/app.js`

## Phase 4: Printable HTML Output And Verification

**Status:** Complete

**Goal:** Finalize document generation, printing behavior and verification for v1.

**Covers:** OUT-01, OUT-02, OUT-03, OUT-04, OUT-05, APP-04

**Scope:**
- Generate a clean HTML document suitable for browser print/PDF.
- Suppress notes explicativas and drafting instructions from the final original version.
- Preserve model version/origin metadata for legal/process traceability.
- Block or warn on unresolved placeholders, alternatives and required fields.
- Create manual smoke tests covering extraction, notes, `OU` choices, preview, validation and HTML output.

**Done When:**
- The printable HTML output contains the chosen clauses and filled fields only.
- The output does not include notes that official instructions require suppressing.
- Verification confirms representative sections can be completed and printed.

**Delivered:**

- Printable HTML generation in `app/app.js`
- `app/README.md`
- `docs/manual-verification.md`

## Phase Dependencies

| Phase | Depends On | Why |
|-------|------------|-----|
| 1 | None | Establishes UX and safety baseline from Ger@AGU |
| 2 | Phase 1 | Conversion contract should reflect intended UX patterns |
| 3 | Phase 2 | UI needs structured model data and rules |
| 4 | Phase 3 | Output verification depends on implemented UI and preview |

## Risks And Watchpoints

- DOCX comments and style runs may not map cleanly to nearby clauses; ambiguous note attachment must be reviewed manually.
- Red italic text can indicate both fillable content and optional/adoptable clauses; conversion rules must not flatten all red text into simple text inputs.
- Alternatives separated by `OU` may span multiple paragraphs and require block-level grouping.
- The Ger@AGU capture includes external calls and session logic that should not be copied into the new local app.
- Legal correctness depends on preserving AGU notes and avoiding silent modification of black invariant text.

## Next Command

Milestone complete. Review `.planning/MILESTONE-AUDIT.md`.
