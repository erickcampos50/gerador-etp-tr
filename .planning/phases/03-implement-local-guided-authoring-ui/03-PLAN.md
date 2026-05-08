---
phase: 3
plan: Implement Local Guided Authoring UI
type: execute
wave: 1
depends_on:
  - 02-build-tr-model-extraction-contract
files_modified:
  - app/index.html
  - app/styles.css
  - app/app.js
autonomous: true
requirements:
  - GUI-01
  - GUI-02
  - GUI-03
  - GUI-04
  - GUI-05
  - APP-01
  - APP-02
  - APP-03
---

# Phase 3 Plan: Implement Local Guided Authoring UI

<objective>
Create the local browser UI for guided TR authoring using the structured model seed from Phase 2.
</objective>

<tasks>

## Task 1: Create local static shell

<read_first>
- `app/model-data.js`
- `.planning/phases/01-reverse-engineer-geragu-experience/UX-PATTERNS.md`
</read_first>

<action>
Create `app/index.html` and `app/styles.css` with a responsive two-pane layout, guided controls panel, validation area, preview area and note dialog.
</action>

<acceptance_criteria>
- `app/index.html` contains `form-root`, `preview-root`, `validation-list`, `note-dialog`, `model-data.js`, and `app.js`.
- `app/styles.css` contains `.workspace`, `.controls`, `.preview`, `.document-preview`, `.note-dialog`, and `@media`.
</acceptance_criteria>

## Task 2: Create guided authoring behavior

<read_first>
- `app/model-data.js`
- `app/index.html`
</read_first>

<action>
Create `app/app.js` to render fields, choices, contextual note buttons, live preview, unresolved markers and validation messages from `window.TR_MODEL`.
</action>

<acceptance_criteria>
- `app/app.js` contains `renderForm`, `renderPreview`, `renderValidation`, `showNote`, `escapeHtml`, and `window.TR_MODEL`.
- `app/app.js` does not contain `fetch(`, `XMLHttpRequest`, `localStorage`, `sessionStorage`, `CarregaDados`, `logsys`, or `brasilapi.com.br`.
</acceptance_criteria>

</tasks>

<verification>
- Search app files for required DOM IDs and functions.
- Confirm no forbidden network/session strings are present in `app/app.js`.
</verification>

<success_criteria>
- GUI-01 through GUI-05 are represented by guided fields, notes, choices, validation and preview.
- APP-01 and APP-02 are satisfied by static local files with no backend calls.
- APP-03 is satisfied by separated `model-data.js`, `app.js` and `styles.css`.
</success_criteria>
