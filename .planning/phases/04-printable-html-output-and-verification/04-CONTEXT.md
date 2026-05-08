# Phase 4: Printable HTML Output And Verification - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Mode:** Autonomous discuss synthesis

<domain>
## Phase Boundary

Finalize the v1 local app by adding clean printable HTML generation, blocking unresolved fields/alternatives, preserving model version/origin metadata and documenting manual verification.
</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- Final v1 output is HTML imprimivel.
- Notes and authoring instructions must be suppressed from final output.
- Export must block when required fields or alternatives are unresolved.
- No backend or external calls are allowed.

### Claude's Discretion

- Whether export opens a new window or downloads a file. Use the simpler local browser mechanism.
</decisions>

<specifics>
## Specific Ideas

- Add an export button to the preview panel.
- Generate a self-contained HTML string from structured state.
- Add `app/README.md` and `docs/manual-verification.md`.
</specifics>

<deferred>
## Deferred Ideas

- DOCX export and persisted saves remain v2.
</deferred>
