---
phase: 2
plan: Build TR Model Extraction Contract
type: execute
wave: 1
depends_on:
  - 01-reverse-engineer-geragu-experience
files_modified:
  - tools/extract_docx_model.py
  - app/model-data.js
  - docs/conversion-contract.md
autonomous: true
requirements:
  - EXT-01
  - EXT-02
  - EXT-03
  - EXT-04
  - EXT-05
  - EXT-06
  - EXT-07
---

# Phase 2 Plan: Build TR Model Extraction Contract

<objective>
Create a maintainable extraction contract and first structured model seed for the local TR generator. Preserve DOCX source evidence, semantic signals, notes, placeholders, `OU` alternatives and model origin metadata.
</objective>

<tasks>

## Task 1: Create DOCX extractor

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`
- `.planning/REQUIREMENTS.md`
</read_first>

<action>
Create `tools/extract_docx_model.py` using Python standard library modules `zipfile`, `xml.etree.ElementTree`, `json`, `re` and `hashlib`. The tool must parse `word/document.xml` and `word/comments.xml`, emit JSON with `source`, `counts`, `comments` and `paragraphs`, and classify placeholders, red italic runs, `OU` markers and ambiguity flags.
</action>

<acceptance_criteria>
- `tools/extract_docx_model.py` exists.
- Running `python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --sample 3` exits 0.
- Output contains `paragraphs_with_placeholders`, `paragraphs_with_ou`, `comments`, and `ambiguity_flags`.
</acceptance_criteria>

## Task 2: Create structured model seed

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`
- `docs/conversion-contract.md`
</read_first>

<action>
Create `app/model-data.js` containing `window.TR_MODEL` with metadata, notes, fields, choices, sections and extraction contract hints. Include the vigencia/prorrogacao `OU` example with placeholders `prazo_vigencia` and `termo_inicial`.
</action>

<acceptance_criteria>
- `app/model-data.js` exists.
- File contains `window.TR_MODEL`, `vigencia_modelo`, `official-color-rules`, `vigencia-prorrogacao`, `prazo_vigencia`, `termo_inicial`, and `alternative_ou`.
</acceptance_criteria>

## Task 3: Document conversion contract

<read_first>
- `.planning/phases/01-reverse-engineer-geragu-experience/PHASE-1-HANDOFF.md`
- `.planning/PROJECT.md`
</read_first>

<action>
Create `docs/conversion-contract.md` with sections `Summary`, `Source Priority`, `Required Metadata`, `Classification Rules`, `Ambiguity Policy`, `Representative Structured Seed`, and `Extraction Tool`.
</action>

<acceptance_criteria>
- `docs/conversion-contract.md` exists.
- File contains `DOCX`, `word/comments.xml`, `variable_red_italic`, `alternative_ou`, `ambiguity_flags`, and `tools/extract_docx_model.py`.
</acceptance_criteria>

</tasks>

<verification>
- Run the extractor sample command and confirm exit 0.
- Search `app/model-data.js` for `window.TR_MODEL`, `vigencia_modelo`, and `alternative_ou`.
- Search `docs/conversion-contract.md` for required metadata and ambiguity policy strings.
</verification>

<success_criteria>
- EXT-01 is satisfied by DOCX-first source priority and extractor input.
- EXT-02 and EXT-03 are satisfied by fixed and red italic classification rules.
- EXT-04 and EXT-05 are satisfied by placeholder and `OU` detection/seed data.
- EXT-06 is satisfied by comment extraction and note metadata.
- EXT-07 is satisfied by source file and SHA-256 origin metadata.
</success_criteria>
