# TR Conversion Contract

## Summary

The DOCX model in `Documentos modelo/` is the canonical source for extraction. The HTML export is auxiliary evidence for visual/layout checks only. The converter must preserve legal drafting signals instead of flattening them into plain text.

## Source Priority

- Primary: DOCX package entries such as `word/document.xml`, `word/comments.xml`, headers, footers and styles.
- Secondary: HTML model for visual cross-checking when DOCX structure is ambiguous.
- Excluded: `Ger@AGU - Editais` legal text; it is UX evidence only.

## Required Metadata

- `section_hierarchy`: title, section, clause, subclause and ordering.
- `clause_id`: stable identifier for preview, validation, note attachment and output selection.
- `runs`: text spans with color, italic, bold and source location.
- `role`: one of `fixed_candidate`, `variable_red_italic`, `mixed_semantic`, `alternative_ou`, `note`, `unknown`.
- `placeholders`: bracketed fields such as `[indicar o prazo]`.
- `alternatives`: grouped `OU` blocks with unresolved default state.
- `notes`: explanatory comments or extracted notes with anchor and attachment confidence.
- `validation_hints`: required fields, unresolved alternatives, incompatible choices and ambiguity warnings.
- `model_origin`: source file, extraction date, checksum and version/footer evidence.

## Classification Rules

- Black text is normally fixed legal text. If later edited, the app must treat that as a review-worthy change.
- Red italic text is variable/adoptable text. It may become a field, choice, optional block or warning depending on surrounding context.
- Bracketed text becomes a field candidate and should remain unresolved until the user fills it.
- `OU` markers become explicit choices. The app must not emit both alternatives in clean final output.
- Notes explain drafting decisions and must remain authoring-only.

## Ambiguity Policy

When classification is uncertain, the converter must preserve evidence and mark the item with `ambiguity_flags`. It must not silently choose legal meaning. Examples include red text without italics, inline `OU` markers, unclear note anchors and optional text spanning multiple paragraphs.

## Generated Structured Model

`app/model-data.js` is generated from the canonical DOCX. It contains the converted clause sections, explanatory comments, generated field candidates, inline alternatives and block alternatives.

## Extraction Tool

`tools/extract_docx_model.py` extracts paragraph text, Word line breaks, run styles, comments, placeholders, `OU` markers, role candidates and ambiguity flags from the DOCX using the Python standard library. With `--model-js`, it also writes the browser model consumed by the local UI.

Example:

```bash
python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --sample 25
python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --model-js app/model-data.js
```

## Current Conversion Coverage

- Converts 200 non-empty DOCX paragraphs into 19 clause/preamble sections.
- Generates required fields for bracketed placeholders and common filler patterns such as `xxxx` and dotted blanks.
- Converts standalone `OU` groups into required block choices so final output emits only the selected alternative.
- Converts inline bracket alternatives into required radio choices embedded back into the paragraph template.
- Converts DOCX comments into authoring-only notes attached to the closest extracted paragraph when Word comment anchors are available.
- Preserves paragraph `runs` and `styleFlags` in generated blocks so red/italic drafting signals remain auditable by the app and by future export formats.
- Preserves `docNumber` inside normal paragraphs and inside `outputBlocks` for `OU` alternatives so selected legal text keeps the original index structure in preview and export.
