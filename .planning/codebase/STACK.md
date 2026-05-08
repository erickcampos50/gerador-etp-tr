# Technology Stack

## Summary
- Static browser page capture for a Ger@AGU edital generator screen.
- Runtime is the browser only: one saved HTML document, local CSS, downloaded JavaScript assets, and image assets.
- No package manager, application framework source tree, build pipeline, server source, or test setup is present in the repository snapshot.
- Several assets are saved with `.download` suffixes and Windows `:Zone.Identifier` alternate-data-stream artifacts.

## Runtime And Languages
- HTML5 document loaded directly in a browser.
- CSS for document styling, GOV.BR design-system styling, Font Awesome, Rawline, and downloaded Google Fonts CSS.
- JavaScript loaded through `<script>` tags, including one module script for `core.min.js.download` and several classic scripts.
- No TypeScript, Node.js runtime, Python backend, or compiled language code was found.

## Frontend
- Main page: `Ger@AGU - Editais/Edital.html`.
- Local stylesheets: `base.css`, `rawline.css`, `core.min.css`, `all.min.css`, and a downloaded font CSS file named `css`.
- Inline CSS is embedded in the HTML, including SweetAlert2 styles and page-specific layout rules.
- JavaScript drives DOM updates, form behavior, generated edital text, modal alerts, API calls, and data filling.
- UI libraries/signals include GOV.BR Design System classes (`br-button`, `br-list`, `br-accordion`), Font Awesome icons, SweetAlert2, jQuery, Popper/focus-visible/flatpickr code bundled in GOV.BR core assets.

## Backend
- No backend source code is present in this repository snapshot.
- Frontend code calls external/current-host CGI endpoints such as `/cgi-bin/sapiens_com/relsapiens/coleta.py` and `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py`.
- The saved HTML appears to originate from `https://cgu.agu.gov.br/edital/montagem/index.php`, but PHP source is not included.

## Build And Tooling
- No `package.json`, lockfile, bundler config, test config, or build scripts found.
- Assets look like browser-downloaded output rather than original source, especially `.js.download` files and minified CSS/JS bundles.
- Source maps are referenced by minified files (`core.min.css.map`, `core.min.js.map`) but the map files were not found in the captured tree.
- The working directory itself is not a git repository in this environment.

## Dependencies
- jQuery 3.3.1 in `Edital_files/jquery.min.js.download`.
- SweetAlert2 in `Edital_files/sweetalert.min.js.download` and inline generated styles in `Edital.html`.
- Font Awesome Free 5.11.2 in `Edital_files/all.min.css`.
- GOV.BR Design System core CSS/JS in `Edital_files/core.min.css`, `core.min.js.download`, and `core-init.js.download`.
- Bundled/transitive browser libraries visible in GOV.BR core files include Popper, flatpickr, focus-visible behavior, and related component code.
- Rawline font CSS is present, but referenced `../font/*` font files are not present in the repository snapshot.
- Downloaded Google Fonts Raleway CSS file named `Edital_files/css` references remote `fonts.gstatic.com` `.woff2` files.

## Local Development
- Likely opened directly from `Ger@AGU - Editais/Edital.html` in a browser for static inspection.
- Full behavior likely requires network access and/or hosting under an expected domain because `CarregaDados` builds API URLs from `window.location.protocol` and `window.location.host`.
- Some relative asset references in generated scripts point outside the captured folder (`../../../images/...`, `../font/...`) and may not resolve locally.
- No documented local setup, dependency install, or dev server was found.

## Deployment And Hosting Signals
- HTML comment records original URL: `https://cgu.agu.gov.br/edital/montagem/index.php`.
- Code references CGU/AGU/SISCON paths, including `siscon-dev2.agu.gov.br` and same-origin `/cgi-bin/sapiens_com/...` endpoints.
- Header/footer scripts identify CGUTEC branding and a login path under `../cgutech/login`.
- Current repository snapshot is a static capture, not deployment-ready source.

## Evidence
- `Ger@AGU - Editais/Edital.html`: saved HTML page with linked CSS, downloaded JS, inline CSS, inline JS, hidden initial data fields, and original URL comment.
- `Ger@AGU - Editais/Edital_files/jquery.min.js.download`: jQuery 3.3.1 vendor file.
- `Ger@AGU - Editais/Edital_files/sweetalert.min.js.download`: SweetAlert2 vendor file.
- `Ger@AGU - Editais/Edital_files/core-init.js.download`: webpack-style GOV.BR core bundle with Popper and component code.
- `Ger@AGU - Editais/Edital_files/core.min.css`: minified GOV.BR/flatpickr-style CSS with source map reference.
- `Ger@AGU - Editais/Edital_files/all.min.css`: Font Awesome Free 5.11.2 header.
- `Ger@AGU - Editais/Edital_files/base.css`: local document typography and numbering styles.
- `Ger@AGU - Editais/Edital_files/css`: downloaded Google Fonts Raleway CSS referencing `fonts.gstatic.com`.
- `Ger@AGU - Editais/Edital_files/*.download:Zone.Identifier` and related `*:Zone.Identifier`: browser/Windows download metadata artifacts.

## Unknowns
- Original application source, server-side PHP/CGI/Python code, deployment process, and database schema are not present.
- Exact GOV.BR Design System version is not stated in captured files.
- Whether `.download` suffixes are intentional runtime names or a browser capture artifact is not proven, though the HTML references those names directly.
- Whether remote API endpoints are reachable or require authentication was not verified.
