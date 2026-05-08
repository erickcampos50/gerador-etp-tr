# Safety Inventory

## Summary

This deliverable satisfies REV-02 by defining the boundary between safe UX inspiration and unsafe captured behavior from Ger@AGU. The safe reuse target is product experience only: guided legal form, contextual notes, live preview, conditional choices, validation before export, printable local HTML, and traceability.

Original backend/session/API behavior is explicitly excluded. Captured hidden data, browser-saved state, downloaded runtime artifacts, and Ger@AGU legal content are not source of truth for the TR generator.

## Do Not Reuse Directly

Do not reuse these captured artifacts as implementation or model source:

- Raw captured HTML/JS from `Ger@AGU - Editais`.
- Downloaded bundles, minified vendor files, and inline imperative implementation.
- Hidden captured values and sample edital/session fields; captured hidden data is not source of truth.
- Server save/recover behavior, server logging, telemetry, export metadata posts, and same-origin CGI assumptions.
- Ger@AGU legal content as TR source-of-truth text; `Documentos modelo/` remains canonical for TR.
- Original backend/session/API behavior, including login, token renewal, profile state, endpoint calls, and public lookup calls.

## Network And Backend Calls

The original network and backend behavior must not be copied or executed in the local TR v1.

- `CarregaDados`: prohibit reuse of same-origin CGI POST helpers and dynamic parameter posting.
- `logsys`: prohibit export logging or telemetry inherited from the captured export path.
- `refresh/rtoken.py`: prohibit token refresh endpoints and SISCON/AGU session renewal behavior.
- `coleta.py`: prohibit calls to original `/cgi-bin/sapiens_com/relsapiens/coleta.py` collection endpoint.
- `brasilapi.com.br`: prohibit inherited BrasilAPI CNPJ lookup unless a later explicit requirement approves an external dependency.

The local app requirement is no backend, no login, no original AGU/CGU endpoints, and no accidental network dependency inherited from the capture.

## Session And localStorage Behavior

Do not copy Ger@AGU session behavior into the TR generator.

- `localStorage` key behavior from the captured app is excluded.
- `TestaTempoSessao` is excluded, including profile reads, redirect behavior, and session-time assumptions.
- `renovaTS` is excluded, including token renewal, timeout prompts, and session refresh calls.
- Login/logoff, SISCON redirects, profile display, token renewal, and saved session state are not v1 features.

The TR generator should be a local browser tool without original session, account, profile, or token semantics.

## Unsafe Rendering Patterns

Direct `innerHTML` writes for user-entered content are not approved as a reuse pattern. Future implementation should treat user-filled data as untrusted, even when the app runs locally.

Ger@AGU note bodies demonstrate rich HTML guidance, but future TR note rendering must use trusted extracted TR model content and controlled rendering decisions. Acceptable future approaches may include static templates, a constrained allowlist, or structured note content, but Phase 1 does not implement them.

Do not copy arbitrary HTML mutation paths, imperative string concatenation blocks, or SweetAlert HTML rendering as the security model.

## Downloaded Artifact Risks

Browser-saved Ger@AGU artifacts carry risks that make them unsuitable as source code or model data:

- Remote fonts, favicon, CSS, images, and saved browser assets may be stale or incomplete.
- Minified vendor files and downloaded bundles obscure ownership, versioning, and security posture.
- Hidden state may contain sample edital, session, or runtime values unrelated to TR source data.
- Stale runtime code may include dependencies on unavailable environments or endpoints.
- Non-canonical Ger@AGU legal content is not the TR model and must not override `Documentos modelo/`.
- Downloaded files can suggest behavior such as backend recovery/export that is out of scope for local v1.

## Approved Reuse Boundary

Approved reuse is limited to product/UX patterns:

- Guided legal form organized by document sections.
- Contextual notes near the field, clause, or choice they explain.
- Live preview with visible consequences of choices and field values.
- Conditional choices for alternatives, optional blocks, placeholders, and variable text.
- Visible highlights for changed, conditional, unresolved, or review-needed content during authoring.
- Validation before export for required fields, unresolved placeholders, unresolved alternatives, and incompatible choices.
- Printable local HTML as the v1 output path.
- Model/version/origin traceability for review.

Anything outside this boundary, especially original backend/session/API behavior and captured hidden data, is excluded.

## Evidence

- Session and `localStorage` risk: `Ger@AGU - Editais/Edital_files/common_v205.js.download:1-23` documents session/profile/localStorage behavior summarized in `01-RESEARCH.md:123` and `01-PATTERNS.md:30`.
- Token refresh risk: `Ger@AGU - Editais/Edital_files/common_v205.js.download:39-43` includes the `refresh/rtoken.py` call path summarized in `01-RESEARCH.md:124`.
- Backend post/logging risk: `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489` contains `CarregaDados`; `Ger@AGU - Editais/Edital.html:5281-5299` includes `logsys`/`CarregaDados` export logging summarized in `01-PATTERNS.md:30`.
- BrasilAPI risk: `Ger@AGU - Editais/Edital_files/common_v205.js.download:737-770` includes `brasilapi.com.br` lookup behavior summarized in `01-RESEARCH.md:126`.
- Hidden captured values: `Ger@AGU - Editais/Edital.html:136-159` is hidden state evidence summarized in `01-RESEARCH.md:117` and `01-PATTERNS.md:30`; it is not source of truth.
- Preview mutation and unsafe rendering: `Ger@AGU - Editais/Edital.html:2435-2442` shows preview field mutation summarized in `01-PATTERNS.md:23`; `innerHTML` use is a watchpoint in `01-RESEARCH.md:127`.
- Reuse boundary: `01-RESEARCH.md:98-109` lists safe product patterns; `01-RESEARCH.md:111-120` lists do-not-reuse artifacts; `01-PATTERNS.md:39-46` separates product patterns from implementation artifacts.
