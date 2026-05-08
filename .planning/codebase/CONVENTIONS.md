# Conventions
## Summary
- Current project is a static browser capture of a Ger@AGU edital generator page.
- The codebase is mostly one large HTML file with inline styles, inline event handlers, inline scripts, and downloaded local assets.
- Authored JavaScript is plain browser JavaScript using globals and direct DOM manipulation.
- Vendor/downloaded assets are present beside authored code and should be treated separately from project conventions.

## File Organization
- Main page: `Ger@AGU - Editais/Edital.html`.
- Local assets are grouped under `Ger@AGU - Editais/Edital_files/`.
- Authored or app-specific helpers appear as `.js.download` files: `common_v205.js.download`, `estilos.js.download`, `cabecalho.js.download`, `rodape.js.download`, `notas_explicativas_v205.js.download`.
- Vendor/downloaded assets include `jquery.min.js.download`, `sweetalert.min.js.download`, `core.min.js.download`, `core-init.js.download`, `all.min.css`, `core.min.css`, `rawline.css`, and image/font-related assets.
- Browser capture metadata files with `:Zone.Identifier` suffix are present and are not authored source.

## HTML Conventions
- HTML is document-centric and generated/captured as a complete static page.
- Layout uses GOV.BR/Bootstrap-like utility classes such as `row`, `col-*`, `d-flex`, `justify-content-center`, `br-button`, `br-input`, `br-accordion`, and `br-datetimepicker`.
- The page relies heavily on IDs for data binding and DOM updates, for example hidden inputs `icnpj`, `iorgao`, `ipregao`, and visible spans such as `orgao1`, `pregao`, `data_evento`.
- Interactivity is mostly wired with inline attributes such as `onclick`, `onchange`, and `oninput`.
- Many strings and generated document fragments are embedded directly in HTML or template literals.
- Accessibility attributes exist in places (`aria-controls`, `aria-hidden`, `aria-label`, roles), but usage appears incidental and inherited from the GOV.BR components rather than enforced by a project standard.

## CSS Conventions
- CSS is split between external files, inline `<style>` blocks, and inline `style` attributes.
- `base.css` defines document typography and numbering rules using CSS counters, `Times New Roman`, `12pt`, paragraph classes, table styles, and helper alignment classes.
- Inline page styles define application layout such as `.container-edital`, `.left`, `.right`, `.gradiente`, responsive paragraph sizing, and input overrides.
- `estilos.js.download` returns a generated HTML/style header string with duplicated document styling for exported HTML.
- Vendor/minified styles are kept separately in `core.min.css`, `all.min.css`, and `rawline.css`.
- Existing formatting mixes tabs/spaces and compact one-line declarations with multi-line blocks.

## JavaScript Conventions
- JavaScript is plain browser JavaScript without modules for authored code.
- Authored code uses global functions and variables, for example `SalvarComoHTML`, `NotaExplicativa`, `preencheCampo`, `SRPChange`, `Numera`, `Modalidade`, `TestaHora`, and `validateIntegerInput`.
- DOM access is direct through `document.getElementById`, `document.querySelector`, `querySelectorAll`, and `.innerHTML`/`.innerText`/`.value` updates.
- Template literals are used extensively to build HTML fragments.
- Async browser APIs are used where needed, including `fetch`, `Blob`, `URL.createObjectURL`, and local storage/session flows in `common_v205.js.download`.
- External UI behavior depends on global `core` GOV.BR components and global `Swal` from SweetAlert.
- Code style is permissive: semicolons are inconsistent, some assignments omit `let`/`const`, and globals are common.

## Naming Conventions
- File and directory names preserve the browser capture/source naming, including spaces, `@`, accented product text, `.download`, and version suffixes like `_v205`.
- Function names are mostly Portuguese and PascalCase/camelCase mixed, for example `BuscaCabecalho`, `AvisoErro`, `LinkIdentificacao`, `preencheCampo`, and `sanitizeInput`.
- IDs and classes are domain-specific Portuguese abbreviations, for example `isrp`, `ipregao`, `participacao`, `numeraparticipacao`, `layer1numeraproposta`.
- CSS helper classes include Portuguese semantic names (`centralizado`, `direita`, `esquerda`) and GOV.BR utility/component names.

## Formatting And Style
- The captured HTML is large and not normalized by a formatter.
- Indentation is inconsistent across HTML, CSS, and JS; tabs and spaces are both used.
- Inline HTML fragments in JavaScript are often indented for visual alignment inside template literals.
- Comments are primarily Portuguese and describe immediate behavior or domain sections.
- Existing code favors direct procedural logic over extracted modules or reusable components.

## Dependency Management
- No `package.json`, lockfile, bundler config, or package scripts were found.
- Dependencies are vendored/downloaded into `Ger@AGU - Editais/Edital_files/` and loaded directly by script/link tags from `Edital.html`.
- External runtime dependencies observed include GOV.BR Design System core scripts/styles, jQuery, SweetAlert, Font Awesome, Rawline fonts, and remote GOV.BR/Planalto links.
- Because assets are local browser-capture files, dependency versions are inferred from filenames/content rather than managed metadata.

## Evidence
- `Ger@AGU - Editais/Edital.html` lines 1-28: browser-saved page, stylesheet links, and script tags for local downloaded assets.
- `Ger@AGU - Editais/Edital.html` lines 30-128: inline page styles for layout and controls.
- `Ger@AGU - Editais/Edital.html` lines 136-158: hidden input data model used by scripts.
- `Ger@AGU - Editais/Edital.html` lines 172, 210, 271, 577, 1583: inline event handlers.
- `Ger@AGU - Editais/Edital.html` lines 2070-2144: global initialization of GOV.BR components and page header/footer.
- `Ger@AGU - Editais/Edital.html` lines 2421-2634 and 5200-5459: inline authored functions and validation/export logic.
- `Ger@AGU - Editais/Edital_files/base.css` lines 1-160: authored document typography, counters, paragraph/table/list classes.
- `Ger@AGU - Editais/Edital_files/estilos.js.download` lines 1-190: generated export header/styles.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download` lines 1-220: app helper functions, session handling, SweetAlert helpers, DOM utilities.
- `Ger@AGU - Editais/Edital_files/core-init.js.download` lines 1-120 and `core.min.js.download` line 1: bundled/vendor GOV.BR core code.

## Unknowns
- Original upstream source structure before browser capture is unknown.
- Whether `.download` files are meant to remain with that extension or are capture artifacts is unknown.
- No formatting/linting configuration exists to confirm intended style rules.
- Ownership boundaries between authored CGUTEC code and copied vendor code are partly inferred from filenames and minification.
