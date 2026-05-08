# Project State

**Initialized:** 2026-05-08
**Current workflow:** Ready for phase planning
**Current focus:** Phase 1 - Reverse Engineer Ger@AGU Experience

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-08)

**Core value:** Permitir que o usuario preencha corretamente um Termo de Referencia juridicamente sensivel, preservando as orientacoes da AGU e explicitando as condicionantes que hoje ficam escondidas em cores, notas e alternativas textuais.
**Current focus:** Phase 1 - Reverse Engineer Ger@AGU Experience

## Planning Artifacts

- `.planning/config.json` - workflow preferences
- `.planning/PROJECT.md` - project context
- `.planning/REQUIREMENTS.md` - scoped v1 requirements
- `.planning/ROADMAP.md` - phase structure
- `.planning/codebase/` - existing codebase map

## User Decisions

- Target document: Termo de Referencia in `Documentos modelo/`, despite filename containing "contrato".
- Implementation format: web local simples.
- Required v1 conveniences: campos guiados, notas explicativas, preview, regras condicionais, prevencao de erros.
- Primary output: HTML imprimivel.
- Color semantics: black text normally invariant; red italic text variable/adoptable; notes guide drafting and must be suppressed in final document.
- Research at initialization: skipped.
- Workflow mode: YOLO.
- Phase granularity: coarse.
- Execution: sequential.
- Git tracking: yes.
- Future workflow agents: research, plan check and verifier enabled.
- Model profile: quality.

## Codebase Notes

- `Ger@AGU - Editais/` is a static captured browser page used as UX inspiration.
- `Documentos modelo/` contains the current TR model in DOCX and HTML.
- Initial inspection found DOCX package entries including `word/document.xml` and `word/comments.xml`.
- DOCX inspection found 28 comments, many red `FF0000` runs and italic runs, making it better than the one-line HTML for semantic extraction.
- Existing `.planning/codebase/` map was produced before `Documentos modelo/` was introduced into the working context, so phase 1 should account for both source folders.

## Next Step

Run `/gsd-plan-phase 1` to plan reverse engineering of the Ger@AGU experience.
