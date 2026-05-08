---
phase: 4
plan: Printable HTML Output And Verification
type: execute
wave: 1
depends_on:
  - 03-implement-local-guided-authoring-ui
files_modified:
  - app/index.html
  - app/styles.css
  - app/app.js
  - app/README.md
  - docs/manual-verification.md
autonomous: true
requirements:
  - OUT-01
  - OUT-02
  - OUT-03
  - OUT-04
  - OUT-05
  - APP-04
---

# Phase 4 Plan: Printable HTML Output And Verification

<objective>
Add clean printable HTML generation and verification documentation for the local TR generator v1.
</objective>

<tasks>

## Task 1: Add printable HTML output

<read_first>
- `app/index.html`
- `app/app.js`
- `app/model-data.js`
</read_first>

<action>
Add an export button and implement `generateFinalHtml` plus `downloadPrintableHtml` in `app/app.js`. The export must block validation errors, generate clean HTML without authoring notes/controls, and include model source/version metadata.
</action>

<acceptance_criteria>
- `app/index.html` contains `export-button`.
- `app/app.js` contains `generateFinalHtml`, `downloadPrintableHtml`, `termo-referencia.html`, `notesSuppressedInFinal`, and `validationMessages`.
- `app/app.js` contains no `fetch(`, `XMLHttpRequest`, `localStorage`, `sessionStorage`, `CarregaDados`, `logsys`, or `brasilapi.com.br`.
</acceptance_criteria>

## Task 2: Add verification docs

<read_first>
- `.planning/REQUIREMENTS.md`
- `app/index.html`
- `app/app.js`
</read_first>

<action>
Create `app/README.md` and `docs/manual-verification.md` with local usage instructions, smoke tests, required static checks and final HTML assertions.
</action>

<acceptance_criteria>
- `app/README.md` exists and mentions `Gerar HTML imprimivel`, no backend and no `localStorage`.
- `docs/manual-verification.md` exists and mentions `node --check app/app.js`, extractor sample command, note suppression, unresolved markers and model source/version metadata.
</acceptance_criteria>

</tasks>

<verification>
- Run `node --check app/app.js`.
- Run the extractor sample command.
- Search app/docs for export and verification strings.
</verification>

<success_criteria>
- OUT-01 through OUT-05 are covered by preview, clean export, note suppression, validation blocking and metadata footer.
- APP-04 is covered by manual verification documentation.
</success_criteria>
