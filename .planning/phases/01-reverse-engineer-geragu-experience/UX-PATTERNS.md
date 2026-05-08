# UX Patterns

## Summary

Ger@AGU is product and UX inspiration for REV-01 and REV-03: guided legal form authoring, contextual notas explicativas, live preview, conditional choices, validation before export, and printable HTML output. It is not code to copy, and Phase 1 does not implement the app or converter.

This inventory distinguishes reusable product patterns from implementation artifacts captured in downloaded HTML/JS. REV-02 is satisfied here by preserving the boundary: learn from the authoring experience, but do not reuse original backend calls, session behavior, unsafe rendering, or captured legal content as the TR source of truth.

## Source Scope

Evidence sources for this document are:

- `Ger@AGU - Editais/Edital.html` for form structure, preview, validation, visual affordances, and HTML export behavior.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download` for explanatory-note interaction and rich guidance examples.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download` for modal helper evidence and excluded runtime/session/API behavior.
- `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md` for summarized findings and line-referenced evidence.
- `.planning/phases/01-reverse-engineer-geragu-experience/01-PATTERNS.md` for product-pattern versus implementation-artifact classification.

Ger@AGU legal content is UX evidence only. The TR source of truth remains `Documentos modelo/`, with DOCX preferred in later phases for comments, colors, italics, placeholders, alternatives, and version/origin data.

## Guided Form Patterns

The TR generator should reuse the product pattern of a structured legal authoring surface, not the captured implementation.

- Sectioned/accordion authoring: organize controls by document/legal sections instead of a generic questionnaire.
- Point-of-need controls: place radio buttons, checkboxes, fields, repeated inputs, and note triggers beside the clause or decision they affect.
- Progressive disclosure: reveal dependent fields only when the user's selection requires them.
- Repeated/table-like inputs: support add/remove workflows where the legal output needs repeated rows or item lists.
- Left-form/right-preview workflow: keep the control surface and document preview visible together so choices have immediate visible consequences.

For REV-01, these patterns translate Ger@AGU's edital-oriented authoring model into TR authoring expectations without implementing extraction, UI components, or converter logic during Phase 1.

## Explanatory Note Experience

REV-03 requires preserving an equivalent note experience for the TR model.

- Nearby note triggers should appear close to the field, clause, placeholder, or choice they explain.
- Notes may be modal or otherwise rich displays, but they must remain easy to open and dismiss.
- Rich guidance should preserve legal citations, links, lists, and multi-paragraph explanations where trusted model extraction supports them.
- Notes are authoring-only guidance, not final document content.
- Final printable HTML must suppress notes, drafting instructions, and guidance unless a later explicit review mode says otherwise.

The Ger@AGU note implementation itself is an artifact, not a reusable code path. Later phases should render trusted notes extracted from the TR model using controlled rendering decisions.

## Conditional Choices

Ger@AGU demonstrates legal alternatives as explicit controls that add, remove, or rewrite preview clauses. The TR generator should adapt this product pattern to TR signals found in `Documentos modelo/`:

- `OU` alternatives become explicit user choices.
- Optional blocks become visible include/exclude decisions.
- Red italic variable text becomes fill/adopt/remove/condition controls depending on context.
- Placeholders such as bracketed instructions become fields or unresolved states.

Phase 1 documents these mappings only. It does not implement extraction rules, a converter, conditional rule engine, UI state, or preview rendering.

## Preview And Highlighting

Ger@AGU's useful preview pattern is immediate feedback: the user changes a control and sees the affected clause in the legal document.

- Preview-first feedback should show the consequence of fields and choices as the user works.
- Scroll-to-affected-clause behavior helps users connect a control to its legal impact.
- Changed, inserted, conditional, or unresolved text should be visibly highlighted in authoring mode.
- Unresolved states should remain visible until placeholders, `OU` alternatives, and required choices are resolved.
- Authoring preview may contain highlights, warnings, and guidance markers; clean final output must suppress authoring-only notes and instructions.

The product pattern is live, understandable feedback. The captured implementation's direct DOM mutation and `innerHTML` writes are not the desired implementation model.

## Validation Before Export

The TR generator should reuse validation before final generation as a product requirement.

- Required fields should be checked before export.
- Unresolved placeholders should block or warn before final generation.
- Unresolved `OU` choices should block final output because the legal text remains ambiguous.
- Incompatible choices should be detected where later model/rule extraction supports them.
- Final HTML generation should be blocked for hard errors and should warn for review-needed ambiguities.

Phase 1 only documents the validation patterns. It does not create validation code, tests, runtime behavior, or a converter.

## HTML Output Pattern

Ger@AGU provides product evidence for local, browser-readable HTML output.

- V1 TR output should be printable HTML, suitable for browser print/PDF workflows.
- Output should preserve model/version/origin traceability for legal/process review.
- Notes, drafting instructions, unresolved guidance, and authoring-only affordances should be suppressed from the clean final document.
- Server logging, export metadata posts, original save/recovery behavior, and backend dependencies are excluded.

The output pattern is useful; the captured export implementation and any backend calls are not reusable.

## Visual Affordances

Ger@AGU provides several visual affordances that can inform later UX:

- Two-pane layout: controls on one side, legal document preview on the other.
- Legal document typography: preview should feel like a legal document, with readable paragraph structure and numbering.
- Note buttons: small, repeated affordances near relevant controls establish that guidance is available at the point of need.
- Highlight colors and a legend can distinguish changed, conditional, unresolved, or review-needed text.
- Warning affordances should make missing or incompatible inputs visible before export.
- Fixed text, variable text, unresolved placeholders, and guidance content should be visually distinct during authoring.

Final print mode should be clean unless a later phase deliberately defines a review/highlight output mode.

## Pattern-To-Requirement Map

| Requirement | Documented UX Patterns | Evidence |
| --- | --- | --- |
| REV-01 | Guided form, preview, notes, conditionals, validation, HTML output, visual affordances | `01-RESEARCH.md:30-87`, `01-PATTERNS.md:17-30` |
| REV-02 | Product patterns separated from captured implementation artifacts and unsafe runtime behavior | `01-RESEARCH.md:111-129`, `01-PATTERNS.md:39-46` |
| REV-03 | Contextual note triggers, rich note display, authoring-only visibility, final-output suppression | `01-RESEARCH.md:54-60`, `01-PATTERNS.md:21-22` |

## Evidence

- Form and two-pane layout: `Ger@AGU - Editais/Edital.html:78-98` shows the control/preview split; `01-RESEARCH.md:32` and `01-PATTERNS.md:19` summarize it as two-pane guided authoring.
- Notes: `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5` initializes note lookup/display behavior; `01-RESEARCH.md:56-60` and `01-PATTERNS.md:21-22` summarize nearby note triggers and rich modal guidance.
- Preview and highlighting: `Ger@AGU - Editais/Edital.html:1595-1654` is summarized in `01-RESEARCH.md:49`; scroll-to-affected-clause behavior is summarized from `Ger@AGU - Editais/Edital.html:4233-4243` in `01-RESEARCH.md:50`.
- Validation: `Ger@AGU - Editais/Edital.html:5168-5206` is the required-field matrix evidence summarized in `01-RESEARCH.md:73` and `01-PATTERNS.md:27`.
- HTML export: `Ger@AGU - Editais/Edital.html:1581-1591` shows the `Salvar como HTML` entry point; `Ger@AGU - Editais/Edital.html:5249-5289` and `01-RESEARCH.md:82-87` summarize local HTML download, print/PDF use, and traceability obligations.
- Product versus artifact boundary: `01-PATTERNS.md:39-46` distinguishes reusable patterns from copied layout/CSS/scripts, `innerHTML`, hard-coded DOM lists, and `logsys`/`CarregaDados` backend behavior.
