# Phase 1 Pattern Map

## Summary

Ger@AGU should be treated as UX/product evidence for a guided legal-document authoring experience, not as implementation source. The useful pattern is a sectioned authoring surface beside a live document preview, with contextual explanatory notes, explicit legal alternatives, conditional text insertion/removal, visual highlights, automatic numbering, pre-export validation, and browser-native HTML output.

The planner should preserve a hard boundary: copy no captured JS/HTML implementation, no original API/session/localStorage behavior, no server logging, and no external lookup behavior. Phase 1 output should document reusable product patterns and excluded artifacts so later TR phases can build local, maintainable equivalents from `Documentos modelo/`.

## Files To Inspect During Execution

- `.planning/phases/01-reverse-engineer-geragu-experience/01-RESEARCH.md` - prior research summary, evidence, safety boundary, and recommended deliverables.
- `Ger@AGU - Editais/Edital.html` - captured UX, accordion form, preview DOM, inline authoring logic, validation, numbering, and export behavior.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download` - explanatory-note data shape and modal invocation through `NotaExplicativa(id)`.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download` - shared modal helpers and unsafe session/API/external integration behaviors to exclude.
- `Documentos modelo/` - TR source of truth for later phases; use it to translate notes, placeholders, red/italic text, and `OU` alternatives into guided controls.

## Pattern Inventory

- **Two-pane guided authoring**: Reuse as product pattern. Evidence: `.container-edital`, `.left`, `.right` split with fixed left controls and scrollable preview in `Ger@AGU - Editais/Edital.html:78-98`; instantiated at `Ger@AGU - Editais/Edital.html:181-183`. Planner note: TR app should keep controls and preview visible together, but implement with app state instead of direct captured DOM mutation.
- **Accordion/section navigation**: Reuse as product pattern. Evidence: `br-accordion` starts at `Ger@AGU - Editais/Edital.html:217`; section headers include `DATA E HORA`, `1. OBJETO`, `PARTICIPAÇÃO`, `PROPOSTA`, `JULGAMENTO`, etc. at `Ger@AGU - Editais/Edital.html:217-260`, `Ger@AGU - Editais/Edital.html:313-320`, `Ger@AGU - Editais/Edital.html:494-500`, `Ger@AGU - Editais/Edital.html:891-897`; initialized by `core.BRAccordion` at `Ger@AGU - Editais/Edital.html:5415-5419`. Planner note: TR sections should follow document/legal structure, not generic form categories.
- **Point-of-need note button**: Reuse as product pattern. Evidence: circular chalkboard-teacher buttons call `NotaExplicativa(id)` beside decisions and fields, e.g. object note at `Ger@AGU - Editais/Edital.html:267-273`, participation at `Ger@AGU - Editais/Edital.html:330-333`, proposal deadline note at `Ger@AGU - Editais/Edital.html:699-702`. Planner note: preserve nearby note triggers for TR comments/instructions.
- **Modal rich explanatory notes**: Reuse as product pattern; do not copy data wholesale. Evidence: `NotaExplicativa(id)` defines `arrNotas` with HTML-rich text in `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5`, examples with links/lists at `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:6-18`, `77-88`, `110-122`; display call at `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:234-236`; modal helper `AvisoErro` uses SweetAlert `html` at `Ger@AGU - Editais/Edital_files/common_v205.js.download:205-210`. Planner note: TR notes can be static trusted content rendered in controlled templates and excluded from final output.
- **Live preview mutation**: Reuse product behavior, not implementation. Evidence: form changes call `preencheCampo(...)` and update preview spans, e.g. date input at `Ger@AGU - Editais/Edital.html:232`; `preencheCampo(id, dado)` writes `innerHTML` at `Ger@AGU - Editais/Edital.html:2435-2442`; preview spans begin around `Ger@AGU - Editais/Edital.html:1595-1624`. Planner note: implement preview from structured state/data, avoiding arbitrary `innerHTML` for user content.
- **Scroll-to-updated-clause**: Reuse as product pattern. Evidence: many inputs call `ColocaNoTopo`, e.g. `Ger@AGU - Editais/Edital.html:232`, `695`, `1480`, `1526`; function `ColocaNoTopo(id)` scrolls `#right` to the changed element at `Ger@AGU - Editais/Edital.html:4233-4243`. Planner note: after a choice, bring the affected TR clause into view.
- **Conditional clause insertion/removal**: Reuse as product pattern. Evidence: `SRPChange(op)` injects/removes SRP clauses and UI at `Ger@AGU - Editais/Edital.html:2451-2517`; `Objeto12(valor)` progressively changes object-choice controls at `Ger@AGU - Editais/Edital.html:2703-2837`; `ParticipacaoChange(estado, ind, lista)` inserts/removes participation clauses and dependent inputs at `Ger@AGU - Editais/Edital.html:2974-3057`; table add/remove flow is `TabelaObjeto` at `Ger@AGU - Editais/Edital.html:3290-3328`. Planner note: TR alternatives such as comments, optional blocks, placeholders, and `OU` text should become explicit choices with visible preview consequences.
- **Numbering recalculation**: Reuse as product requirement. Evidence: `Numera()` recalculates section and subitem classes at `Ger@AGU - Editais/Edital.html:2633-2662`; `iteraArrayNumeros` handles subitem resets and `.last` markers at `Ger@AGU - Editais/Edital.html:2664-2685`; `Referencias()` updates cross-references at `Ger@AGU - Editais/Edital.html:2687-2697`. Planner note: any TR conditional insertion/removal must preserve legal numbering and references.
- **Validation before export**: Reuse as product requirement. Evidence: `SalvarComoHTML()` builds the required-field matrix at `Ger@AGU - Editais/Edital.html:5168-5206`; required loop alerts and stops export at `Ger@AGU - Editais/Edital.html:5210-5222`; conditional `ckpropSN` validation depends on `tpobj` at `Ger@AGU - Editais/Edital.html:5224-5244`; numeric and length guards are `validateIntegerInput` and `TestaTamanhoString` at `Ger@AGU - Editais/Edital.html:5359-5386`. Planner note: TR app should block final generation while required fields, placeholders, alternatives, or incompatible choices remain unresolved.
- **HTML export/print flow**: Reuse as product pattern; exclude backend logging. Evidence: `Salvar como HTML` button at `Ger@AGU - Editais/Edital.html:1581-1591`; `SalvarComoHTML()` creates `Blob` URLs and downloads `Modelo_` and `Extrato_` files at `Ger@AGU - Editais/Edital.html:5249-5289`; note 46 explains browser print/PDF and copy-to-Word flow at `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:132-137`; final traceability message is `mensagem_final` at `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:239-247`. Planner note: v1 TR can output printable HTML locally, with notes/instructions suppressed and model/version traceability preserved.
- **Visual highlights/legend**: Reuse as product pattern. Evidence: default `mark` styling at `Ger@AGU - Editais/Edital.html:31-34`; legend shows pink changed text, green margin preference, blue SRP at `Ger@AGU - Editais/Edital.html:183-204`; preview uses highlighted spans and blocks around `Ger@AGU - Editais/Edital.html:1599-1654`, green examples at `Ger@AGU - Editais/Edital.html:1684`, blue SRP clauses generated in `SRPChange` at `Ger@AGU - Editais/Edital.html:2454-2466`. Planner note: TR authoring mode should visually distinguish fixed text, inserted/changed text, unresolved fields/alternatives, and notes; final print mode should be clean unless review mode is requested.
- **Unsafe backend/session/API behavior to exclude**: Exclude entirely. Evidence: session/localStorage/token check in `TestaTempoSessao` at `Ger@AGU - Editais/Edital_files/common_v205.js.download:1-23`; token refresh calls `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py` in `renovaTS` at `Ger@AGU - Editais/Edital_files/common_v205.js.download:37-58`; same-origin CGI POST in `CarregaDados` at `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489`; export path logs and posts extrato via `logsys`/`CarregaDados` at `Ger@AGU - Editais/Edital.html:5281-5299`; BrasilAPI CNPJ lookup at `Ger@AGU - Editais/Edital_files/common_v205.js.download:737-843`; hidden captured state values in `Ger@AGU - Editais/Edital.html:136-159`. Planner note: local TR v1 must not inherit login, tokens, server persistence, telemetry, CGI endpoints, public API lookups, or captured hidden sample data.

## Existing Analog Evidence

- Ger@AGU already demonstrates the authoring model Phase 1 needs to document: sectioned controls mutate a legal-document preview, highlight consequences, keep notes contextual, and export a browser-readable HTML document.
- The captured page maps legal structure to form navigation rather than presenting a generic questionnaire. This is visible in accordion sections and functions named by legal area: `Objeto12`, `ParticipacaoChange`, `PropostaChange`, `HabilitacaoChange`, `SalvarComoHTML`, and `Numera`.
- The explanatory-note experience is first-class: note buttons are repeated near decisions, note bodies contain rich legal guidance and citations, and the final export explanation is itself a note.
- The downloaded TR model evidence from research supports translating DOCX comments, red/italic runs, placeholders, optional text, and `OU` alternatives into the same kind of explicit controls and authoring-only aids.

## Product Pattern vs Implementation Artifact

- Product pattern: two-pane guided legal authoring. Implementation artifact to avoid: captured `Edital.html` layout/CSS/inline scripts copied into the TR app.
- Product pattern: contextual rich notes. Implementation artifact to avoid: copying `arrNotas` or rendering arbitrary HTML through the same SweetAlert/`innerHTML` path without controls.
- Product pattern: live preview with clause focus. Implementation artifact to avoid: direct `preencheCampo(...).innerHTML` writes for user-entered content.
- Product pattern: conditional legal clauses and renumbering. Implementation artifact to avoid: large imperative string concatenation blocks as the source of truth.
- Product pattern: validation before final generation. Implementation artifact to avoid: hard-coded DOM ID lists as the only validation model.
- Product pattern: local printable HTML output and traceability. Implementation artifact to avoid: `logsys`, `CarregaDados`, token/session checks, original CGI endpoints, hidden captured values, and remote lookup side effects.

## Recommended Phase 1 Output Files

- `UX-PATTERNS.md` - inventory of reusable Ger@AGU product patterns for the TR generator, including two-pane authoring, accordion sections, note buttons, rich notes, live preview, scrolling, conditional rules, numbering, validation, export, and highlights.
- `SAFETY-INVENTORY.md` - explicit exclusion list for raw captures, downloaded bundles, session/token/localStorage, same-origin CGI calls, server logging, BrasilAPI lookup, hidden sample data, and unsafe rendering patterns.
- `PATTERN-TO-REQUIREMENT.md` - compact map from REV-01, REV-02, and REV-03 to evidence and acceptance checks.
- Optional consolidated alternative: one `PHASE-1-FINDINGS.md` containing the three sections above if the planner prefers fewer files.

## Planning Notes

- Phase 1 should remain documentation-only; do not implement TR extraction or UI behavior yet.
- Treat `Documentos modelo/` as the legal/content source of truth for TR, while Ger@AGU remains UX inspiration only.
- Plan later data structures to preserve note metadata, variable text, alternatives, optional blocks, unresolved placeholders, section hierarchy, numbering dependencies, and model/version origin.
- Require final-output separation: authoring notes, visual guidance, and drafting warnings should not pollute printable TR HTML.
- Prefer local/offline behavior for v1 unless a later requirement explicitly approves network calls.
- Security model should assume user-entered data is untrusted even in a local app; avoid arbitrary HTML insertion for field values.

## PATTERN MAPPING COMPLETE

Pattern map complete for Phase 1: Ger@AGU patterns are documented as product inspiration with concrete evidence, and unsafe implementation/runtime artifacts are explicitly excluded.
