# Architecture
## Summary
- This repository is a captured static web page, not a conventional application source repository.
- The runnable entry point is `Ger@AGU - Editais/Edital.html`.
- Runtime behavior is browser-only HTML, CSS, and JavaScript loaded from `Ger@AGU - Editais/Edital_files/`.
- There are no observed package manifests, source directories, tests, or build configuration files.

## Application Shape
- Single saved HTML document with a large inline body and inline runtime script.
- Supporting assets are colocated in a browser capture folder named `Edital_files`.
- The page represents an edital generator/editor UI using GOV.BR design-system classes, Font Awesome classes, SweetAlert, jQuery, and local helper scripts.
- Most behavior is implemented through global browser functions and DOM mutation rather than modules or framework components.

## Entry Points
- `Ger@AGU - Editais/Edital.html` is the only observed HTML entry point.
- The original captured source URL is recorded in the HTML comment: `https://cgu.agu.gov.br/edital/montagem/index.php`.
- The document includes local CSS and JS from `./Edital_files/` and one remote favicon at `https://cgu.agu.gov.br/images/logo_cguteg_p.png`.

## Runtime Flow
- Browser loads `Edital.html`.
- The `<head>` loads styles in this order: `base.css`, `rawline.css`, `css`, `core.min.css`, `all.min.css`.
- The `<head>` loads scripts in this order: `core.min.js.download`, `core-init.js.download`, `jquery.min.js.download`, `rodape.js.download`, `cabecalho.js.download`, `common_v205.js.download`, `estilos.js.download`, `sweetalert.min.js.download`, `notas_explicativas_v205.js.download`.
- The page body contains hidden inputs for edital metadata and a pre-rendered header, left navigation/form area, right document area, and footer.
- The inline script at the bottom initializes GOV.BR components with the global `core` object, renders header/footer through `cabecalho()` and `rodape()`, reads hidden field values, and wires page-specific edital behavior.

## State And Data Flow
- Initial state is embedded directly in hidden inputs in `Edital.html`, including organization, procurement, modality, value, and feature flags.
- Runtime state is held in global variables declared in the inline script, for example `versao`, `romanos`, `seqanexos`, `elementIDs`, and arrays for select/table data.
- DOM is the primary state carrier: helper functions read and write elements by id, update `innerHTML`, and react to inline `onclick`/`onchange` handlers.
- `common_v205.js.download` includes session/token helpers using `localStorage`, `fetch`, and `window.location`, although this static capture may not have the original backend context required for all paths.
- `notas_explicativas_v205.js.download` stores explanatory note content in JavaScript arrays and displays it through global functions.

## Module Boundaries
- `Edital.html`: entry point, saved markup, embedded CSS, hidden input data, and page-specific inline script.
- `Edital_files/base.css`: document typography, numbering, tables, and printable/legal text styling.
- `Edital_files/rawline.css`: Rawline font/style asset.
- `Edital_files/css`: downloaded Raleway font-face stylesheet referencing Google font URLs.
- `Edital_files/core.min.css` and `core-init.js.download`: GOV.BR design-system styling and component initialization bundle.
- `Edital_files/core.min.js.download`: module script for design-system components.
- `Edital_files/all.min.css`: Font Awesome icon styles.
- `Edital_files/jquery.min.js.download`: jQuery runtime.
- `Edital_files/sweetalert.min.js.download`: SweetAlert runtime.
- `Edital_files/cabecalho.js.download`: global `cabecalho()` renderer.
- `Edital_files/rodape.js.download`: global `rodape()` renderer.
- `Edital_files/common_v205.js.download`: shared global utility functions for alerts, navigation, formatting, API calls, session checks, and DOM helpers.
- `Edital_files/estilos.js.download`: global `BuscaCabecalho()` helper returning stylesheet markup.
- `Edital_files/notas_explicativas_v205.js.download`: explanatory-note data and display behavior.

## Asset Loading
- Local relative assets are loaded from `Ger@AGU - Editais/Edital_files/`.
- Images used by the captured page are `Logo_CGUTEC_Horizontal_p.png` and `duvidas.png`.
- Download artifacts use `.download` suffixes for JavaScript files and `:Zone.Identifier` sidecar files, indicating the repository contains files saved from a browser or Windows environment.
- Some downloaded CSS still references remote font URLs under `https://fonts.gstatic.com/`.
- `cabecalho.js.download` references image paths under `../../../images/`, but the captured HTML also contains local rewritten image paths under `./Edital_files/`.

## Error Handling
- `common_v205.js.download` centralizes user-facing notifications with SweetAlert wrappers such as `AvisoErro`, `sucesso`, and toast helpers.
- API helpers catch `fetch` failures and log to `console.error` in some paths.
- Session helpers redirect on missing or expired local storage state.
- Because this is a static capture, backend API calls and redirects may fail outside the original hosted path.

## Evidence
- `Ger@AGU - Editais/Edital.html:2` records the saved source URL.
- `Ger@AGU - Editais/Edital.html:8-28` lists stylesheet and script imports.
- `Ger@AGU - Editais/Edital.html:136-159` embeds initial hidden input values.
- `Ger@AGU - Editais/Edital.html:2070-2145` begins the page-specific inline initialization and calls `rodape()` and `cabecalho()`.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:1-23` shows local storage session checks.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-483` builds a same-origin API URL and performs `fetch`.
- `Ger@AGU - Editais/Edital_files/cabecalho.js.download:1-29` defines the header renderer.
- `Ger@AGU - Editais/Edital_files/rodape.js.download:2-18` defines the footer renderer.
- `Ger@AGU - Editais/Edital_files/notas_explicativas_v205.js.download:3-5` defines explanatory note behavior and data.

## Unknowns
- The original backend API contract is not present in this repository.
- The original source files before browser capture are not present.
- It is unclear whether every downloaded asset is needed for offline use.
- It is unclear whether the `:Zone.Identifier` files should be preserved for provenance or removed as environment metadata.
