# Phase 1 Handoff

## Summary

Phase 1 documents reusable Ger@AGU UX patterns and safety exclusions for REV-01, REV-02, and REV-03. The deliverables define what later phases may emulate as product behavior and what they must exclude as captured implementation/runtime behavior.

Phase 1 does not implement the app, converter, extraction code, UI components, tests, build configuration, or runtime behavior. Phase 2 should use this handoff to design converter metadata that can support guided TR authoring later.

## Decisions For Phase 2

- Prefer DOCX as the canonical TR source because it preserves comments, colors, italics, Word structure, and model metadata better than the HTML export.
- Use HTML only as auxiliary visual/layout evidence for reading, preview styling, and cross-checking ambiguous document structure.
- Preserve source evidence for ambiguous cases, including source file, location, run/style/comment origin, and why a classification could not be resolved automatically.
- Treat Ger@AGU as UX evidence only, not as TR legal content, converter input, or source code.
- Keep original backend/session/API behavior out of converter assumptions and downstream UI design.

## Required Converter Metadata

Phase 2 should produce structured metadata sufficient for later UI/output phases, without implementing the UI during Phase 2. Required metadata includes:

- Section hierarchy: document title, top-level sections, clauses, subclauses, and ordering.
- Clause IDs: stable identifiers for preview anchoring, validation, note attachment, and output selection.
- Fixed text: black/invariant legal text that should normally pass through unchanged.
- Red italic variable text: spans that may need fill, adoption, conditional inclusion, or removal.
- Placeholders: bracketed fields such as `[indicar o prazo]`, including label, required status, and source location.
- `OU` alternatives: grouped alternatives with option boundaries, labels, default unresolved state, and chosen-clause output rules.
- Optional blocks: clauses or paragraphs that may be included/excluded based on user decisions.
- Explanatory notes/comments: note content, source comment ID when available, legal citation text, and attachment confidence.
- Note anchors: nearest field, clause, paragraph, run, or choice where the note trigger should appear.
- Validation hints: required fields, unresolved placeholders, unresolved alternatives, incompatible choices, length/numeric hints when derivable.
- Numbering dependencies: legal numbering, cross-reference dependencies, and renumbering risk when optional content is removed.
- Model version/origin: source file name, extraction date, document version/footer evidence, and checksum or equivalent traceability marker.
- Ambiguity flags: extraction uncertainties, low-confidence note attachment, unclear `OU` grouping, red text whose role is ambiguous, and black-text modification warnings.

## Note Experience Contract

Downstream phases must preserve the Ger@AGU-like note experience for REV-03 while avoiding unsafe captured implementation patterns.

- A note trigger should appear near the relevant field, clause, placeholder, or choice.
- Rich guidance should be retained where extracted from trusted TR model content, including legal citations, lists, links, and multi-paragraph explanation.
- Notes are authoring-only; they guide the user but do not become part of the clean final printable document.
- Notes must be easy to open, dismiss, and reopen without losing form context.
- Final printable HTML must not silently include notes, drafting instructions, or authoring guidance.
- Rendering must be controlled after trusted extraction; do not reuse arbitrary `innerHTML` paths or copied Ger@AGU note code as the implementation model.

## Output Contract Inputs

Later printable HTML generation needs these inputs from the structured model and user state:

- Chosen clauses and included optional blocks.
- Filled field values for placeholders and variable text.
- Unresolved placeholders that should block or warn before final output.
- Unresolved alternatives, especially `OU` groups that still require a user decision.
- Required-field status and validation severity.
- Model version/origin metadata for traceability.
- Suppressed notes/instructions list or markers proving authoring-only guidance was excluded.
- Optional review/highlight mode indicator if later phases decide to preserve highlights for review while keeping clean print mode separate.

These inputs support REV-01 output/validation patterns and REV-02 safety boundaries without requiring Phase 1 or Phase 2 to implement final generation.

## Open Questions

- Should the TR note experience use modal dialogs like Ger@AGU, inline expandable panels, or both while preserving point-of-need access?
- Should final HTML preserve review highlights, remove them for clean print, or offer separate authoring/review/final modes?
- How deep should traceability be: model name/version/origin only, or also an extract of choices similar to Ger@AGU's separate change extract?
- Should external links inside notes open normally, be rendered as plain offline references, or require explicit user action?
- How exhaustive must the Ger@AGU inventory be beyond the representative evidence already captured for Phase 1?
- How should the converter classify red italic text when it could mean fillable text, optional text, or text requiring legal judgment?

## Verification Checklist

- [ ] `UX-PATTERNS.md` exists and contains REV-01, REV-02, and REV-03 where required.
- [ ] `SAFETY-INVENTORY.md` exists and contains REV-02 and the required safety exclusions.
- [ ] `PHASE-1-HANDOFF.md` exists and contains REV-01, REV-02, and REV-03.
- [ ] `UX-PATTERNS.md` states that Phase 1 does not implement the app or converter.
- [ ] `SAFETY-INVENTORY.md` excludes original backend/session/API behavior and captured hidden data as source of truth.
- [ ] `PHASE-1-HANDOFF.md` gives concrete converter metadata requirements without requiring Phase 2 implementation during Phase 1.
- [ ] Note behavior is defined as authoring-only and suppressed from final printable HTML.
- [ ] Output contract inputs include chosen clauses, filled values, unresolved placeholders, unresolved alternatives, required-field status, model version/origin, suppressed notes/instructions, and review/highlight mode indicator.
