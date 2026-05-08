---
phase: 1
plan: Reverse Engineer Ger@AGU Experience
type: documentation
wave: 1
depends_on: []
files_modified:
  - .planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md
  - .planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md
  - .planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md
autonomous: true
requirements:
  - REV-01
  - REV-02
  - REV-03
---

# Phase 1 Plan: Reverse Engineer Ger@AGU Experience

<objective>
Create executable documentation that captures the useful Ger@AGU authoring experience as product guidance for the local TR generator while explicitly excluding captured backend, session, API, and unsafe implementation behavior.

This phase is documentation-only. Do not implement app code, extraction code, UI components, tests, build configuration, or runtime behavior. Modify only files under `.planning/phases/01-reverse-engineer-geragu-experience/`.

The phase must produce these deliverables:

- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`
</objective>

<threat_model>
Phase 1 is docs-only, but the plan must preserve security and product boundaries for downstream implementation.

- Do not copy original Ger@AGU backend, session, API, localStorage, token refresh, server logging, CGI, BrasilAPI lookup, or hidden captured state behavior into any deliverable as reusable implementation guidance.
- Do not execute external calls or require network access while producing documentation.
- Do not treat captured hidden inputs, saved browser state, sample edital data, or downloaded runtime artifacts as source-of-truth model data.
- Do not treat `Ger@AGU - Editais` legal content as the TR source of truth; it is UX evidence only. The TR source of truth remains `Documentos modelo/`, with DOCX preferred in later phases.
- Treat original note HTML as product evidence only. In later phases, note HTML must be considered trusted model content only after extraction from the TR model and controlled rendering decisions.
- Treat user-entered values in future implementation as untrusted, even for local browser usage; avoid recommending arbitrary `innerHTML` writes for user data.
- Separate authoring aids from final document output: notes, drafting instructions, highlights, and warnings may guide the user but must not silently pollute final printable HTML.
</threat_model>

<tasks>

## Task 1: Create UX-PATTERNS.md

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/01-PATTERNS.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/PROJECT.md`
</read_first>

<actions>
1. Create `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`.
2. Include these exact top-level headings in this order: `# UX Patterns`, `## Summary`, `## Source Scope`, `## Guided Form Patterns`, `## Explanatory Note Experience`, `## Conditional Choices`, `## Preview And Highlighting`, `## Validation Before Export`, `## HTML Output Pattern`, `## Visual Affordances`, `## Pattern-To-Requirement Map`, `## Evidence`.
3. Under `## Summary`, state that Ger@AGU is product/UX inspiration for REV-01 and REV-03, not code to copy.
4. Under `## Source Scope`, identify `Ger@AGU - Editais/Edital.html`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download`, `Ger@AGU - Editais/Edital_files/common_v205.js.download`, `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md`, and `.planning/phases/01-reverse-engineer-geragu-experience/01-PATTERNS.md` as evidence sources.
5. Under `## Guided Form Patterns`, document sectioned/accordion authoring, point-of-need controls, progressive disclosure, repeated/table-like input patterns, and left-form/right-preview workflow.
6. Under `## Explanatory Note Experience`, document nearby note triggers, modal/rich display, legal citations, authoring-only visibility, and final-output suppression. Include the string `REV-03` in this section.
7. Under `## Conditional Choices`, document how Ger@AGU product patterns should translate to TR alternatives such as `OU`, optional blocks, red italic variable text, and placeholders without implementing extraction in this phase.
8. Under `## Preview And Highlighting`, document preview-first feedback, scroll-to-affected-clause behavior, changed text highlights, unresolved-state visibility, and distinction between authoring preview and clean final output.
9. Under `## Validation Before Export`, document required fields, unresolved placeholders, unresolved `OU` choices, incompatible choices, and final-generation blocking/warnings as patterns only.
10. Under `## HTML Output Pattern`, document local printable HTML, model/version traceability, suppression of notes/instructions, and exclusion of server logging.
11. Under `## Visual Affordances`, document two-pane layout, legal document typography, note buttons, highlight colors/legend, warning affordances, and distinction between fixed, variable, unresolved, and guidance content.
12. Under `## Pattern-To-Requirement Map`, include a compact table with rows for `REV-01`, `REV-02`, and `REV-03`, mapping each requirement to documented UX patterns and evidence.
13. Under `## Evidence`, include line-referenced evidence copied or summarized from `01-RESEARCH.md` and `01-PATTERNS.md`, including at least these strings: `Ger@AGU - Editais/Edital.html:78-98`, `Ger@AGU - Editais/Edital.html:1581-1591`, `Ger@AGU - Editais/Edital.html:5168-5206`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5`.
</actions>

<acceptance_criteria>
- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md` exists.
- The file contains every required heading exactly as specified.
- The file contains `REV-01`, `REV-02`, and `REV-03`.
- The file states that Phase 1 does not implement the app or converter.
- The file distinguishes product patterns from implementation artifacts.
- The file includes concrete evidence references for form, notes, preview, validation, and HTML export behavior.
</acceptance_criteria>

## Task 2: Create SAFETY-INVENTORY.md

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/01-PATTERNS.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
</read_first>

<actions>
1. Create `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`.
2. Include these exact top-level headings in this order: `# Safety Inventory`, `## Summary`, `## Do Not Reuse Directly`, `## Network And Backend Calls`, `## Session And localStorage Behavior`, `## Unsafe Rendering Patterns`, `## Downloaded Artifact Risks`, `## Approved Reuse Boundary`, `## Evidence`.
3. Under `## Summary`, state that this deliverable satisfies `REV-02` by defining the boundary between safe UX inspiration and unsafe captured behavior.
4. Under `## Do Not Reuse Directly`, list raw captured HTML/JS, downloaded bundles, inline imperative implementation, hidden captured values, server save/recover behavior, and Ger@AGU legal content as non-reusable implementation/source-of-truth artifacts.
5. Under `## Network And Backend Calls`, explicitly list and prohibit original same-origin CGI calls, token refresh endpoints, server logging/export metadata posts, and BrasilAPI CNPJ lookup. Include the strings `CarregaDados`, `logsys`, `refresh/rtoken.py`, `coleta.py`, and `brasilapi.com.br`.
6. Under `## Session And localStorage Behavior`, explicitly prohibit copying login/logoff, session profile, token renewal, SISCON redirects, and `localStorage` key behavior. Include the strings `localStorage`, `TestaTempoSessao`, and `renovaTS`.
7. Under `## Unsafe Rendering Patterns`, document that direct `innerHTML` writes for user-entered content are not approved and that future note rendering must use trusted extracted TR model content and controlled rendering decisions.
8. Under `## Downloaded Artifact Risks`, document risks from browser-saved files, remote fonts/favicon/assets, minified vendor files, hidden state, stale runtime code, and non-canonical legal content.
9. Under `## Approved Reuse Boundary`, list safe reusable patterns only: guided legal form, contextual notes, live preview, conditional choices, visible highlights, validation before export, printable local HTML, and traceability.
10. Under `## Evidence`, include line-referenced evidence from research/pattern files, including at least these strings: `Ger@AGU - Editais/Edital_files/common_v205.js.download:1-23`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:39-43`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:737-770`, `Ger@AGU - Editais/Edital.html:136-159`, `Ger@AGU - Editais/Edital.html:2435-2442`.
</actions>

<acceptance_criteria>
- `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md` exists.
- The file contains every required heading exactly as specified.
- The file contains `REV-02`.
- The file explicitly excludes original backend/session/API behavior.
- The file states that captured hidden data is not source of truth.
- The file defines an approved reuse boundary limited to product/UX patterns.
</acceptance_criteria>

## Task 3: Create PHASE-1-HANDOFF.md

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/01-PATTERNS.md`
- `.planning/ROADMAP.md`
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
</read_first>

<actions>
1. Create `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`.
2. Include these exact top-level headings in this order: `# Phase 1 Handoff`, `## Summary`, `## Decisions For Phase 2`, `## Required Converter Metadata`, `## Note Experience Contract`, `## Output Contract Inputs`, `## Open Questions`, `## Verification Checklist`.
3. Under `## Summary`, state that Phase 1 documents reusable Ger@AGU UX patterns and safety exclusions for `REV-01`, `REV-02`, and `REV-03`.
4. Under `## Decisions For Phase 2`, state that Phase 2 must prefer DOCX as canonical TR source, use HTML only as auxiliary visual/layout evidence, and preserve source evidence for ambiguous cases.
5. Under `## Required Converter Metadata`, list metadata the converter must preserve for later UI/output: section hierarchy, clause IDs, fixed text, red italic variable text, placeholders, `OU` alternatives, optional blocks, explanatory notes/comments, note anchors, validation hints, numbering dependencies, model version/origin, and ambiguity flags.
6. Under `## Note Experience Contract`, define the required downstream note behavior: note trigger near field/clause/choice, rich guidance retained, authoring-only display, easy dismiss/open, no final printable inclusion, and controlled rendering after trusted extraction.
7. Under `## Output Contract Inputs`, define data needed for later printable HTML generation: chosen clauses, filled field values, unresolved placeholders, unresolved alternatives, required-field status, model version/origin, suppressed notes/instructions, and optional review/highlight mode indicator.
8. Under `## Open Questions`, carry forward unresolved decisions from research that are not Phase 1 blockers, including modal versus inline notes, whether final HTML preserves review highlights, traceability depth, offline handling of links in notes, and how exhaustive Ger@AGU inventory must be.
9. Under `## Verification Checklist`, include checkboxes requiring that `UX-PATTERNS.md`, `SAFETY-INVENTORY.md`, and `PHASE-1-HANDOFF.md` each exist and that requirement IDs `REV-01`, `REV-02`, and `REV-03` appear in the relevant files.
</actions>

<acceptance_criteria>
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md` exists.
- The file contains every required heading exactly as specified.
- The file contains `REV-01`, `REV-02`, and `REV-03`.
- The file gives Phase 2 concrete converter metadata requirements without requiring Phase 2 implementation during Phase 1.
- The file carries forward note and output contracts needed by later phases.
</acceptance_criteria>

## Task 4: Verify Phase Deliverables

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`
- `.planning/phases/01-reverse-engineer-geragu-experience/01-PLAN.md`
</read_first>

<actions>
1. Read `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md` and verify it contains `## Summary`, `## Source Scope`, `## Guided Form Patterns`, `## Explanatory Note Experience`, `## Conditional Choices`, `## Preview And Highlighting`, `## Validation Before Export`, `## HTML Output Pattern`, `## Visual Affordances`, `## Pattern-To-Requirement Map`, `## Evidence`, `REV-01`, `REV-02`, and `REV-03`.
2. Read `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md` and verify it contains `## Summary`, `## Do Not Reuse Directly`, `## Network And Backend Calls`, `## Session And localStorage Behavior`, `## Unsafe Rendering Patterns`, `## Downloaded Artifact Risks`, `## Approved Reuse Boundary`, `## Evidence`, and `REV-02`.
3. Read `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md` and verify it contains `## Summary`, `## Decisions For Phase 2`, `## Required Converter Metadata`, `## Note Experience Contract`, `## Output Contract Inputs`, `## Open Questions`, `## Verification Checklist`, `REV-01`, `REV-02`, and `REV-03`.
4. Run content searches or grep-equivalent checks for `REV-01`, `REV-02`, and `REV-03` across `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`, `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`, and `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`.
5. Run content searches or grep-equivalent checks for the required safety strings `CarregaDados`, `logsys`, `refresh/rtoken.py`, `coleta.py`, `brasilapi.com.br`, `localStorage`, `TestaTempoSessao`, `renovaTS`, and `innerHTML` in `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`.
6. Confirm no files outside `.planning/phases/01-reverse-engineer-geragu-experience/` were modified by Phase 1 execution.
</actions>

<acceptance_criteria>
- All three deliverable files exist.
- All required headings are present in the correct deliverable files.
- Requirement IDs `REV-01`, `REV-02`, and `REV-03` are present where required.
- Safety exclusion strings are present in `SAFETY-INVENTORY.md`.
- Verification confirms Phase 1 remains documentation-only and does not require implementation of the app.
- Verification confirms no source files outside `.planning/phases/01-reverse-engineer-geragu-experience/` were modified.
</acceptance_criteria>

</tasks>

<verification>
Use read/search checks after writing the deliverables. Minimum verification commands or equivalent tool checks:

- Check `UX-PATTERNS.md` headings and IDs: search for `## Summary|## Source Scope|## Guided Form Patterns|## Explanatory Note Experience|## Conditional Choices|## Preview And Highlighting|## Validation Before Export|## HTML Output Pattern|## Visual Affordances|## Pattern-To-Requirement Map|## Evidence|REV-01|REV-02|REV-03` in `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`.
- Check `SAFETY-INVENTORY.md` headings and exclusions: search for `## Summary|## Do Not Reuse Directly|## Network And Backend Calls|## Session And localStorage Behavior|## Unsafe Rendering Patterns|## Downloaded Artifact Risks|## Approved Reuse Boundary|## Evidence|REV-02|CarregaDados|logsys|refresh/rtoken.py|coleta.py|brasilapi.com.br|localStorage|TestaTempoSessao|renovaTS|innerHTML` in `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`.
- Check `PHASE-1-HANDOFF.md` headings and IDs: search for `## Summary|## Decisions For Phase 2|## Required Converter Metadata|## Note Experience Contract|## Output Contract Inputs|## Open Questions|## Verification Checklist|REV-01|REV-02|REV-03` in `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`.
- Confirm the plan artifact frontmatter includes `requirements:` with `REV-01`, `REV-02`, and `REV-03`.
- Confirm this phase did not create implementation files and did not modify files outside `.planning/phases/01-reverse-engineer-geragu-experience/`.
</verification>

<must_haves>
- Valid YAML frontmatter at the top of `.planning/phases/01-reverse-engineer-geragu-experience/01-PLAN.md` with keys `phase`, `plan`, `type`, `wave`, `depends_on`, `files_modified`, `autonomous`, and `requirements`.
- Frontmatter `requirements` must include `REV-01`, `REV-02`, and `REV-03`.
- Phase deliverables must be exactly `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`, `.planning/phases/01-reverse-engineer-geragu-experience/SAFETY-INVENTORY.md`, and `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`.
- All tasks must remain documentation-only and must not require app implementation.
- Every deliverable must use concrete target filenames, required headings, and requirement IDs where specified.
- Safety boundaries must explicitly exclude original backend/session/API behavior.
- The plan must be executable by `/gsd-execute-phase 1` without specialized agents.
</must_haves>

<success_criteria>
- `UX-PATTERNS.md` gives the next phases a clear reusable UX pattern inventory for guided form authoring, contextual notes, conditional choices, preview/highlighting, validation, and printable HTML output.
- `SAFETY-INVENTORY.md` gives the next phases a clear exclusion list for captured runtime/backend/session/API/localStorage/network/rendering risks.
- `PHASE-1-HANDOFF.md` gives Phase 2 concrete converter metadata and note/output contracts without implementing extraction or UI.
- REV-01 is covered by the documented inventory of Ger@AGU form, preview, note, validation, conditional, output, and visual patterns.
- REV-02 is covered by the product-pattern versus unsafe-artifact safety boundary.
- REV-03 is covered by a documented note experience contract preserving point-of-need contextual guidance and final-output suppression.
- Verification confirms all required headings, evidence strings, safety strings, and requirement IDs are present.
</success_criteria>
