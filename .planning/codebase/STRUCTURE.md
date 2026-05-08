# Repository Structure
## Summary
- The repository contains one captured static site directory: `Ger@AGU - Editais/`.
- There is no observed `src/`, `public/`, `dist/`, package manifest, framework configuration, test directory, or build pipeline.
- The repository looks like a browser-saved copy of a CGU/AGU edital page and its downloaded dependencies.

## Directory Tree
```text
.
|-- Ger@AGU - Editais/
|   |-- Edital.html
|   |-- Edital.html:Zone.Identifier
|   `-- Edital_files/
|       |-- Logo_CGUTEC_Horizontal_p.png
|       |-- Logo_CGUTEC_Horizontal_p.png:Zone.Identifier
|       |-- all.min.css
|       |-- all.min.css:Zone.Identifier
|       |-- base.css
|       |-- base.css:Zone.Identifier
|       |-- cabecalho.js.download
|       |-- cabecalho.js.download:Zone.Identifier
|       |-- common_v205.js.download
|       |-- common_v205.js.download:Zone.Identifier
|       |-- core-init.js.download
|       |-- core-init.js.download:Zone.Identifier
|       |-- core.min.css
|       |-- core.min.css:Zone.Identifier
|       |-- core.min.js.download
|       |-- core.min.js.download:Zone.Identifier
|       |-- css
|       |-- css:Zone.Identifier
|       |-- duvidas.png
|       |-- duvidas.png:Zone.Identifier
|       |-- estilos.js.download
|       |-- estilos.js.download:Zone.Identifier
|       |-- jquery.min.js.download
|       |-- jquery.min.js.download:Zone.Identifier
|       |-- notas_explicativas_v205.js.download
|       |-- notas_explicativas_v205.js.download:Zone.Identifier
|       |-- rawline.css
|       |-- rawline.css:Zone.Identifier
|       |-- rodape.js.download
|       |-- rodape.js.download:Zone.Identifier
|       |-- sweetalert.min.js.download
|       `-- sweetalert.min.js.download:Zone.Identifier
`-- .planning/
    `-- codebase/
        |-- ARCHITECTURE.md
        `-- STRUCTURE.md
```

## Key Files
- `Ger@AGU - Editais/Edital.html`: static HTML entry point and main captured UI/document content.
- `Ger@AGU - Editais/Edital_files/base.css`: custom legal-document typography, numbering, and table styles.
- `Ger@AGU - Editais/Edital_files/core.min.css`: GOV.BR design-system CSS.
- `Ger@AGU - Editais/Edital_files/core.min.js.download`: design-system component script loaded as `type="module"`.
- `Ger@AGU - Editais/Edital_files/core-init.js.download`: large bundled component runtime exposing `core` globally.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download`: shared utility layer for DOM, alerts, formatting, navigation, session, and API calls.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download`: explanatory note content and display logic.
- `Ger@AGU - Editais/Edital_files/cabecalho.js.download`: header HTML generator.
- `Ger@AGU - Editais/Edital_files/rodape.js.download`: footer HTML generator.
- `Ger@AGU - Editais/Edital_files/estilos.js.download`: dynamic stylesheet markup helper.
- `Ger@AGU - Editais/Edital_files/jquery.min.js.download`: jQuery dependency.
- `Ger@AGU - Editais/Edital_files/sweetalert.min.js.download`: SweetAlert dependency.
- `Ger@AGU - Editais/Edital_files/all.min.css`: Font Awesome styles.
- `Ger@AGU - Editais/Edital_files/rawline.css` and `Ger@AGU - Editais/Edital_files/css`: font stylesheets.

## Generated Or Downloaded Files
- Files ending in `.download` appear to be browser-downloaded JavaScript assets.
- Files ending in `:Zone.Identifier` are Windows alternate data stream metadata captured as ordinary files on this filesystem.
- `Ger@AGU - Editais/Edital.html` includes `<!-- saved from url=(0048)https://cgu.agu.gov.br/edital/montagem/index.php -->`, indicating a browser-save origin.
- `Ger@AGU - Editais/Edital_files/css` is a downloaded stylesheet without a `.css` extension.

## Naming Patterns
- Captured folder names preserve browser-save naming: `Ger@AGU - Editais/` and `Edital_files/`.
- Versioned custom scripts use `_v205`, matching page version `2.0.5` in the footer and inline script.
- Third-party/minified assets use common names such as `jquery.min.js.download`, `sweetalert.min.js.download`, `core.min.css`, and `all.min.css`.
- Windows metadata sidecars append `:Zone.Identifier` to the original file name.

## Ownership Boundaries
- Captured app content: `Ger@AGU - Editais/Edital.html`.
- Captured local assets and libraries: `Ger@AGU - Editais/Edital_files/`.
- Codebase mapping documentation: `.planning/codebase/`.
- No source/build ownership split is visible because original editable sources are not included.

## Files To Preserve Carefully
- `Ger@AGU - Editais/Edital.html`: only entry point and contains embedded data, markup, styles, and inline behavior.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download`: shared global behavior used by many inline handlers.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download`: large domain content for explanatory notes.
- `Ger@AGU - Editais/Edital_files/core-init.js.download` and `core.min.js.download`: required for `core.BRDateTimePicker`, `core.BRSelect`, and other GOV.BR component initialization in the HTML.
- `Ger@AGU - Editais/Edital_files/base.css`: custom document rendering styles that affect generated edital layout.
- `Ger@AGU - Editais/Edital_files/Logo_CGUTEC_Horizontal_p.png` and `duvidas.png`: local images referenced by the captured page.

## Evidence
- `Ger@AGU - Editais/Edital.html:1-3` shows a browser-saved HTML document and source URL.
- `Ger@AGU - Editais/Edital.html:8-28` shows dependency imports from `./Edital_files/`.
- `Ger@AGU - Editais/Edital.html:165` and `Ger@AGU - Editais/Edital.html:175` reference local images.
- `Ger@AGU - Editais/Edital.html:2053-2064` contains a pre-rendered footer with version `2.0.5`.
- `Ger@AGU - Editais/Edital.html:2070-2145` contains the inline runtime initializer.
- `Ger@AGU - Editais/Edital_files/css:1-80` shows downloaded font-face CSS referencing remote Google font assets.
- `Ger@AGU - Editais/Edital_files/core-init.js.download:1-12` shows a bundled UMD/webpack runtime.
- Repository glob results show no files outside `Ger@AGU - Editais/` before `.planning/codebase/` was created.

## Unknowns
- Whether `:Zone.Identifier` files are intentionally tracked as provenance or accidental download metadata.
- Whether this repository is intended to remain a static capture or become a maintained source project.
- Whether remote fonts and backend API calls are expected to work offline.
- Whether missing original server-side files are available elsewhere.
