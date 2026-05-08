# Phase 1 Research: Reverse Engineer Ger@AGU Experience

## Summary

Phase 1 should produce a concise UX/patterns and safety inventory for using `Ger@AGU - Editais` as product inspiration, not as source code to copy. The captured page demonstrates a useful authoring model: a left-side guided form, a right-side live legal-document preview, contextual explanatory-note buttons, conditional clause insertion/removal, highlighted changed text, required-field checks, and generated HTML output.

The plan must also preserve a hard boundary: original endpoints, session/token/localStorage behavior, same-origin CGI calls, BrasilAPI lookups, raw downloaded bundles, and captured implementation code should not be reused in the local TR app. The reusable value is the interaction pattern and legal-authoring experience.

## Phase Objective

Research what Phase 1 must document so later phases can design the TR generator well:

- Inventory Ger@AGU patterns relevant to REV-01: guided form, preview, notes, conditional rules, validations, and HTML output.
- Identify safe inspiration versus unsafe captured implementation artifacts for REV-02.
- Specify how the new app should preserve an equivalent explanatory-note experience for REV-03.
- Provide enough evidence and boundaries for a planner to create `PLAN.md` without prematurely designing Phase 2 extraction or Phase 3 implementation.

## Source Materials Inspected

- `.planning/PROJECT.md`: project value, constraints, and decision that Ger@AGU is UX inspiration only; see `.planning/PROJECT.md:5`, `.planning/PROJECT.md:34-37`, `.planning/PROJECT.md:57-62`, `.planning/PROJECT.md:71`.
- `.planning/REQUIREMENTS.md`: REV-01, REV-02, REV-03 and downstream requirements; see `.planning/REQUIREMENTS.md:10-14`.
- `.planning/ROADMAP.md`: Phase 1 scope and done-when criteria; see `.planning/ROADMAP.md:12-27`.
- `.planning/STATE.md`: current focus and user decisions; see `.planning/STATE.md:22-35`, `.planning/STATE.md:37-43`.
- `.planning/codebase/*.md`: existing capture map, architecture, integrations, concerns, testing, conventions, and stack.
- `Ger@AGU - Editais/Edital.html`: captured UI, form, preview, dynamic script, validation and export behavior.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download`: explanatory-note data and display function.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download`: alert helpers, utility functions, session/API behavior, and external integrations.
- `Documentos modelo/`: enough to confirm TR relevance. The DOCX and HTML model exist; DOCX inspection found 28 comments, 134 red runs, 123 italic runs, 35 placeholder runs, and 14 `OU` runs, matching the project need to turn notes, variable text, placeholders, and alternatives into guided authoring patterns.

## Ger@AGU Interaction Patterns

- Two-pane authoring: the left pane is a scrollable control surface and the right pane is a scrollable document preview; see `Ger@AGU - Editais/Edital.html:78-98`, `Ger@AGU - Editais/Edital.html:181-183`, `Ger@AGU - Editais/Edital.html:1595-1624`.
- Sectioned workflow: the form is organized as an accordion by legal/document sections such as data/hora, objeto, participação, proposta, abertura, habilitação, contrato, recursos, sanções and gerais; see `Ger@AGU - Editais/Edital.html:217-260`, `Ger@AGU - Editais/Edital.html:313-320`, `Ger@AGU - Editais/Edital.html:494-500`, `Ger@AGU - Editais/Edital.html:891-897`.
- Point-of-need controls: radio buttons, checkboxes, date/time pickers, text inputs, numeric inputs, select-like widgets, add/remove table controls, and explanatory-note buttons appear beside the relevant decision; see `Ger@AGU - Editais/Edital.html:229-247`, `Ger@AGU - Editais/Edital.html:278-293`, `Ger@AGU - Editais/Edital.html:325-333`, `Ger@AGU - Editais/Edital.html:527-579`.
- Preview-first feedback: changes are written into named preview spans/divs using `preencheCampo`, then the preview scrolls to the affected clause using `ColocaNoTopo`; see `Ger@AGU - Editais/Edital.html:232`, `Ger@AGU - Editais/Edital.html:2435-2442`, `Ger@AGU - Editais/Edital.html:4233-4243`.
- Context summary: a “Resumo da Capa” button displays selected high-level metadata in a modal, useful as a pattern for quickly reviewing global choices; see `Ger@AGU - Editais/Edital.html:210-213`.

## Guided Form Patterns

- Use legal/document structure as navigation. Ger@AGU does not expose a generic form; it maps controls to document clauses and sections.
- Convert legal alternatives into explicit controls. Example: the object section asks whether the licitação is divided into items, groups, or items and groups, then asks sub-choices such as “Vários itens” or “Item único”; see `Ger@AGU - Editais/Edital.html:2703-2880`.
- Use progressive disclosure. Controls and dependent inputs are injected only when choices require them, such as item-list inputs after participation checkboxes; see `Ger@AGU - Editais/Edital.html:2974-3011`.
- Support repeated/table-like data through add/remove workflows where the output requires rows; see proposal and interval tables around `Ger@AGU - Editais/Edital.html:519-607`, `Ger@AGU - Editais/Edital.html:742-787`.
- Keep optional versus required choices visible. Inputs use `required`, placeholders, labels, and warning messages, but Phase 1 should document the pattern rather than copy the exact validation implementation.

## Preview And Document Update Patterns

- The preview is not a separate final export renderer; it is the visible document being mutated by controls. The new app can reuse this product idea but should implement it with maintainable state/data rather than arbitrary `innerHTML` mutation.
- Changed or inserted text is highlighted with `<mark>` and color-coded marks so users see consequences of choices immediately; see `Ger@AGU - Editais/Edital.html:31-34`, `Ger@AGU - Editais/Edital.html:1599-1624`, `Ger@AGU - Editais/Edital.html:1636-1654`.
- Ger@AGU scrolls the preview to the affected clause after edits; see `ColocaNoTopo` at `Ger@AGU - Editais/Edital.html:4233-4243`.
- Numbering is recalculated after conditional insertions through `Numera`; this is an important product requirement for legal documents, even if the implementation should not be copied; see `Ger@AGU - Editais/Edital.html:2633-2662`.
- The TR app should plan a preview pattern that distinguishes fixed text, variable choices, unresolved placeholders, and notes during authoring, while leaving notes out of the printable final output.

## Explanatory Note Patterns

- Notes are displayed at point of need through small circular buttons with a teacher/chalkboard icon beside fields or choices; see `Ger@AGU - Editais/Edital.html:267-273`, `Ger@AGU - Editais/Edital.html:330-333`, `Ger@AGU - Editais/Edital.html:431-445`, `Ger@AGU - Editais/Edital.html:699-702`.
- Notes are modal overlays, not inline document content. `NotaExplicativa(id)` looks up note text and calls `AvisoErro(..., "Nota Explicativa", "question")`; see `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:234-236`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:205-210`.
- Notes can contain formatted HTML, legal citations, links, lists, and multi-paragraph guidance; see `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:6-18`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:77-88`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:110-122`.
- Some notes explain how to use the generator itself, including save/export behavior; see note 46 at `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:132-137`.
- For REV-03, the planner should require an equivalent note experience: contextual, close to the field/clause, easy to open/dismiss, preserving rich guidance, and excluded from final printable HTML.

## Conditional Rule Patterns

- Ger@AGU encodes business/legal conditions as controls that add, remove, or rewrite clauses in the preview.
- Examples include SRP-specific clauses and form sections when `isrp` is selected; see `Ger@AGU - Editais/Edital.html:2447-2501`, `Ger@AGU - Editais/Edital.html:2523-2569`.
- Margin of preference uses green highlighting and conditionally added text/notes; see `Ger@AGU - Editais/Edital.html:2272-2289`.
- Services with exclusive labor dedication trigger additional notes, clauses, annexes, and related warnings; see `Ger@AGU - Editais/Edital.html:3057-3189`.
- Object structure decisions affect later text and validation through the `tpobj` state; see `Ger@AGU - Editais/Edital.html:2703-2880`, `Ger@AGU - Editais/Edital.html:5224-5244`.
- Phase 1 should catalog conditional patterns, not attempt to encode all TR rules. For the TR model, the important translation is: alternatives like `OU`, red italic variable text, optional blocks, and notes should become explicit choices with visible preview consequences.

## Validation Patterns

- Required-field validation runs before HTML generation using a list of preview/input IDs and associated accordion buttons; see `SalvarComoHTML` at `Ger@AGU - Editais/Edital.html:5168-5206` and checks at `Ger@AGU - Editais/Edital.html:5210-5222`.
- Conditional required validation depends on earlier selections, such as item/group object type for Simples Nacional fields; see `Ger@AGU - Editais/Edital.html:5224-5244`.
- Numeric validation restricts integer fields, maximum length, non-negative values, and displays SweetAlert warnings; see `Ger@AGU - Editais/Edital.html:5359-5375`.
- Text length checks truncate values and warn the user; see `Ger@AGU - Editais/Edital.html:5377-5386`.
- Some input sanitization exists before writing user values into HTML, but it is not a complete security model and should not be copied as-is; see `Ger@AGU - Editais/Edital.html:5452-5469`.
- For the TR generator, validation patterns to plan from Ger@AGU are missing required fields, unresolved placeholders, unresolved `OU` alternatives, incompatible choices, min/max numeric values, and length constraints where legal text becomes unwieldy.

## Output And Printing Patterns

- Ger@AGU provides a `Salvar como HTML` button with an adjacent explanatory note; see `Ger@AGU - Editais/Edital.html:1581-1591`.
- The export path validates required fields, builds HTML from the current preview, creates Blob URLs, and downloads `Modelo_...` and `Extrato_...` files; see `Ger@AGU - Editais/Edital.html:5249-5289`.
- The app also attempts to log/export metadata to backend through `CarregaDados`, which must not be reused in the local TR app; see `Ger@AGU - Editais/Edital.html:5290-5300`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489`.
- Ger@AGU communicates final-generation obligations and traceability through `mensagem_final`, including the importance of model identification and change extract; see `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:239-247`.
- Note 46 explains that generated HTML can be opened in a browser, printed to PDF, or copied to Word, and that markers disappear when printing; see `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:132-137`.
- For the TR app, Phase 1 should capture the product pattern: printable HTML output, validation before generation, suppression of notes/instructions in the final document, and model-version traceability. It should explicitly exclude server logging and original save/recovery behavior.

## Visual Affordances

- Two-column split: controls left, document right; see `Ger@AGU - Editais/Edital.html:78-98`.
- Legal document typography in preview: Times New Roman, 12pt, paragraph-style layout, legal numbering; see preview content at `Ger@AGU - Editais/Edital.html:1597-1624` and codebase notes in `.planning/codebase/CONVENTIONS.md:23-28`.
- Highlight legend: pink for changed text, green for margin of preference, blue for SRP; see `Ger@AGU - Editais/Edital.html:183-204`.
- Default changed text uses pink `mark`; see `Ger@AGU - Editais/Edital.html:31-34`.
- Warning messages use icons and styled feedback banners; see `Ger@AGU - Editais/Edital.html:733-739`, `Ger@AGU - Editais/Edital.html:1382-1386`.
- Note buttons use a repeatable circular icon control, which is a strong UX convention for the TR generator.

## Safe To Reuse As Product Patterns

- Guided legal form organized by document sections.
- Live preview with immediate visual consequences for choices and field values.
- Contextual explanatory notes opened from the exact field, clause, or decision they explain.
- Explicit controls for alternatives and optional/conditional sections instead of free editing legal text.
- Highlighting for changed, inserted, conditional, or unresolved content during authoring.
- Preview scroll-to-changed-clause behavior after edits.
- Required-field and unresolved-choice checks before final generation.
- Printable HTML as the v1 final output.
- Model identity/version traceability shown or embedded in generated output.
- Separate authoring aids from final printable content so notes and drafting instructions do not pollute the final TR.

## Do Not Reuse Directly

- Do not copy the raw downloaded JS bundles, browser-captured HTML, inline implementation code, or minified vendor files into the new local app.
- Do not reuse original same-origin CGI calls, token refresh calls, session checks, or server logging; see `common_v205.js.download:1-23`, `common_v205.js.download:39-43`, `common_v205.js.download:462-489`.
- Do not reuse `localStorage` session key `base`, login/logoff behavior, or SISCON-specific redirects; see `common_v205.js.download:3-9`, `common_v205.js.download:343-355`.
- Do not reuse BrasilAPI CNPJ lookup behavior unless a later requirement explicitly accepts external calls; v1 is local/no-backend and should avoid inherited network dependencies; see `common_v205.js.download:737-770`.
- Do not rely on captured hidden input data as model data; these are sample edital/session values embedded in the saved page; see `Ger@AGU - Editais/Edital.html:136-159`.
- Do not treat Ger@AGU legal content as the TR source of truth. The TR source is `Documentos modelo/`, with DOCX preferred for semantic extraction per `.planning/PROJECT.md:57`.
- Do not preserve save/recover partial behavior from Ger@AGU in v1 unless re-scoped; current v1 excludes backend, login, database, and persisted recovery.

## Security And Privacy Watchpoints

- Captured code reads localStorage and session/profile data, then displays profile fields and renews tokens; see `common_v205.js.download:1-23`.
- Captured code calls `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py?id=...`; see `common_v205.js.download:39-43`.
- Captured code posts dynamic parameters to `/cgi-bin/sapiens_com/relsapiens/coleta.py`; see `common_v205.js.download:462-489`.
- Captured code can call `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`; see `common_v205.js.download:737-770`.
- Captured code uses many `innerHTML` writes. The TR app should use safer rendering patterns and treat all user-filled data as untrusted, even when running locally; see `Ger@AGU - Editais/Edital.html:2435-2442`, `Ger@AGU - Editais/Edital.html:5452-5469`.
- Explanatory notes contain HTML and links. The new implementation should store trusted note content from the TR model and render it through a controlled allowlist or static templates.
- The downloaded capture includes remote fonts/favicon and captured file artifacts; the local v1 should be self-contained unless an explicit external dependency is approved.

## Research Findings For Planning

- Phase 1 should be a documentation deliverable, likely `UX-PATTERNS.md` plus a `SAFETY-INVENTORY.md` or a single combined engineering note, not source implementation.
- The planner should require an inventory table mapping each observed Ger@AGU pattern to “reuse as UX”, “adapt for TR”, or “exclude”.
- REV-01 is best satisfied by concrete examples from Ger@AGU: accordion form, note buttons, conditional object/SRP/participation rules, preview mutation, required validation, and HTML export.
- REV-02 requires a clear safety boundary separating product patterns from captured code, endpoints, session behavior, localStorage, backend logging, and public API lookups.
- REV-03 requires documenting the note experience as a first-class UX pattern: contextual trigger, modal/rich display, legal citations preserved, authoring-only visibility, and final-output suppression.
- The TR model reinforces why these patterns matter: DOCX inspection found comments/notes, red and italic variable text, placeholders, and multiple `OU` alternatives that should become guided controls and note affordances in later phases.
- Phase 1 should not solve DOCX extraction, but it should hand Phase 2 a UX expectation: extracted notes, red italics, placeholders, and `OU` blocks need metadata capable of driving the Ger@AGU-like guided UI.

## Recommended Deliverables For Phase 1

- `UX-PATTERNS.md`: concise inventory of Ger@AGU guided form, preview, note, conditional, validation, visual affordance, and output patterns relevant to the TR generator.
- `SAFETY-INVENTORY.md`: list of captured behaviors and files that must not be reused, including endpoints, localStorage/session, backend save/logging, raw bundles, browser-captured hidden data, and unsafe `innerHTML` style implementation.
- `PATTERN-TO-REQUIREMENT.md` or a section in the same note: map REV-01, REV-02, and REV-03 to concrete evidence and acceptance checks.
- A short “handoff to Phase 2” section: identify the model signals that the converter must preserve for later UI patterns, especially notes, placeholders, red italic variable text, `OU` alternatives, optional blocks, and version/origin metadata.
- Optional lightweight screenshots are not necessary if line-referenced evidence is sufficient, but the planner may include a manual observation checklist if helpful.

## Open Questions

- Should the Phase 1 deliverable be one consolidated engineering note or separate `UX-PATTERNS.md` and `SAFETY-INVENTORY.md` files?
- Should the TR note experience use modal dialogs like Ger@AGU, inline expandable panels, or support both while preserving “point of need” access?
- Should generated final HTML preserve change highlights for review, remove them for print, or offer separate authoring/final modes?
- How much traceability is required in v1: just model name/version/origin, or also an extract of user choices similar to Ger@AGU’s `Extrato_...` output?
- Should the local app allow any external links inside notes to open, or should legal citations be plain references/offline-safe?
- For Phase 1, is it enough to inventory representative Ger@AGU patterns, or should every note button/control in the captured page be counted and classified?

## Evidence

- Project scope and safety boundary: `.planning/PROJECT.md:5`, `.planning/PROJECT.md:34-37`, `.planning/PROJECT.md:57-62`, `.planning/PROJECT.md:71`.
- Phase scope and done-when: `.planning/ROADMAP.md:12-27`.
- Reverse-engineering requirements: `.planning/REQUIREMENTS.md:10-14`.
- Current state and user decisions: `.planning/STATE.md:22-43`.
- Capture architecture and runtime shape: `.planning/codebase/ARCHITECTURE.md:1-31`, `.planning/codebase/ARCHITECTURE.md:62-71`.
- Known integrations and endpoint risks: `.planning/codebase/INTEGRATIONS.md:25-31`, `.planning/codebase/CONCERNS.md:9-14`, `.planning/codebase/CONCERNS.md:29-35`.
- Ger@AGU saved source URL and script imports: `Ger@AGU - Editais/Edital.html:1-28`.
- Layout and visual legend: `Ger@AGU - Editais/Edital.html:78-98`, `Ger@AGU - Editais/Edital.html:183-204`.
- Hidden captured state values: `Ger@AGU - Editais/Edital.html:136-159`.
- Guided form controls and note buttons: `Ger@AGU - Editais/Edital.html:217-333`, `Ger@AGU - Editais/Edital.html:519-579`, `Ger@AGU - Editais/Edital.html:1101-1122`.
- Preview and highlighted document: `Ger@AGU - Editais/Edital.html:1595-1654`.
- Initialization and conditional behavior: `Ger@AGU - Editais/Edital.html:2070-2144`, `Ger@AGU - Editais/Edital.html:2447-2501`, `Ger@AGU - Editais/Edital.html:2703-2880`, `Ger@AGU - Editais/Edital.html:2974-3011`.
- Note implementation: `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5`, `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:234-236`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:205-210`.
- Export and validation: `Ger@AGU - Editais/Edital.html:5168-5206`, `Ger@AGU - Editais/Edital.html:5210-5222`, `Ger@AGU - Editais/Edital.html:5249-5289`, `Ger@AGU - Editais/Edital.html:5359-5386`.
- Unsafe runtime calls: `Ger@AGU - Editais/Edital_files/common_v205.js.download:1-23`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:39-43`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489`, `Ger@AGU - Editais/Edital_files/common_v205.js.download:737-770`.
- TR model relevance: `Documentos modelo/` contains DOCX and HTML model files. DOCX inspection found `word/comments.xml`, 28 comments, red `FF0000` runs, italic runs, bracket placeholders, and `OU` alternatives, supporting the need for guided choices and contextual notes.

## RESEARCH COMPLETE
