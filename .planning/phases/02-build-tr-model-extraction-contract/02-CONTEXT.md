# Phase 2: Build TR Model Extraction Contract - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Mode:** Autonomous discuss synthesis

<domain>
## Phase Boundary

Phase 2 defines and implements the first conversion layer from the current DOCX/HTML Termo de Referencia model into structured data usable by the local app. It must prefer DOCX as canonical source, use HTML only as auxiliary evidence, and carry forward Phase 1's note/output contracts.
</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- DOCX is canonical because it preserves comments, colors, italics, Word structure and model metadata.
- HTML is auxiliary only, mainly for visual/layout cross-checking.
- The converter must preserve ambiguity rather than making silent legal choices.
- Phase 2 may create a representative structured seed for later UI phases; it does not need to fully automate every clause in the model.
- Phase 2 must not use Ger@AGU legal content as source data.

### Claude's Discretion

- File organization for the extractor and app seed data.
- Exact JSON/object shape, provided it preserves the metadata required by Phase 1 handoff.
</decisions>

<code_context>
## Existing Code Insights

- No package/build stack exists yet.
- Use standard-library tooling where possible.
- Phase 1 produced `PHASE-1-HANDOFF.md`, `UX-PATTERNS.md`, and `SAFETY-INVENTORY.md` as the main inputs.
</code_context>

<specifics>
## Specific Ideas

- Create a DOCX extraction tool that reports comments, style runs, placeholders and `OU` markers.
- Create a documented conversion contract for future LLM-assisted or scripted extraction.
- Seed the local app with a curated structured representation of the vigencia/prorrogacao `OU` example.
</specifics>

<deferred>
## Deferred Ideas

- Full automated extraction of every clause in the DOCX can be expanded after the v1 flow is proven.
- DOCX export remains v2.
</deferred>
