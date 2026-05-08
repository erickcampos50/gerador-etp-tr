---
phase: 02-build-tr-model-extraction-contract
plan: 02
subsystem: extraction
tags: [docx, conversion-contract, model-data, tr]
requires:
  - phase: 01-reverse-engineer-geragu-experience
    provides: UX pattern and safety boundary handoff
provides:
  - DOCX semantic extraction tool
  - TR conversion contract
  - Structured model seed for local UI
affects:
  - 03-implement-local-guided-authoring-ui
  - 04-printable-html-output-and-verification
tech-stack:
  added: [python-standard-library, browser-javascript]
  patterns: [docx-source-evidence, ambiguity-preserving-extraction]
key-files:
  created:
    - tools/extract_docx_model.py
    - app/model-data.js
    - docs/conversion-contract.md
  modified: []
requirements-completed: [EXT-01, EXT-02, EXT-03, EXT-04, EXT-05, EXT-06, EXT-07]
duration: not recorded
completed: 2026-05-08
---

# Phase 2: Build TR Model Extraction Contract Summary

**DOCX-first extraction tool, conversion contract, and structured TR model seed established for downstream UI work**

## Accomplishments

- Added `tools/extract_docx_model.py`, a standard-library DOCX extractor that reads document text, comments, run styles, placeholders, `OU` markers and ambiguity flags.
- Added `docs/conversion-contract.md`, defining source priority, required metadata, classification rules and ambiguity policy.
- Added `app/model-data.js`, a structured seed model with notes, fields, choices, sections and the vigencia/prorrogacao `OU` example.

## Verification

- `python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --sample 3` exited 0.
- Verified `app/model-data.js` contains `window.TR_MODEL`, `vigencia_modelo`, `alternative_ou`, `prazo_vigencia`, and `termo_inicial`.
- Verified `docs/conversion-contract.md` contains DOCX, `word/comments.xml`, `variable_red_italic`, `alternative_ou`, `ambiguity_flags`, and extractor references.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

EXT-01 through EXT-07 are covered.
