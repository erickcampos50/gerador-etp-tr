# Concerns

## Summary

- Current repository content is a static browser capture of a Ger@AGU Editais page, not a conventional source project.
- The capture includes downloaded JavaScript/CSS/image assets, Windows `Zone.Identifier` alternate-data-stream metadata files, minified vendor files, and no visible build/test/dependency tooling.
- Several runtime dependencies still point to live remote services or missing local source maps, so local/offline behavior is likely incomplete.

## High Priority

- The saved page appears to execute captured application JavaScript that posts user-provided data to the current host under `/cgi-bin/sapiens_com/relsapiens/coleta.py`. If hosted unintentionally, this could call whatever backend is present at that path.
- `common_v205.js.download` stores and reads session-like data from `localStorage` key `base`, uses profile fields, and refreshes tokens via `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py?id=...`. Treat this as live app code until proven inert.
- The repo contains many `:Zone.Identifier` files, indicating files copied from a Windows download/browser context. These are not useful source artifacts and can confuse tooling, packaging, or cross-platform sync.

## Medium Priority

- No dependency manifest or lockfile was found for the captured third-party assets. Version, provenance, and patch status cannot be reliably managed from the repo alone.
- Minified/copied vendor files are committed without source package metadata, including jQuery `3.3.1`, SweetAlert, Font Awesome CSS, and GOV.BR/core bundles.
- Source map comments reference missing `.map` files, which may cause noisy browser/devtool failures and make debugging harder.
- The saved HTML still references external resources, including a remote favicon and Google font URLs, so the capture is not fully self-contained.
- Several scripts have `.js.download` filenames. Browsers will still execute them when referenced by `script src`, but the suffix signals raw downloaded artifacts rather than maintained source files.

## Low Priority

- Root path and file names include spaces, `@`, and Portuguese/accented content in captured code. This is workable but can expose quoting/path issues in scripts or tools.
- Inline generated CSS from SweetAlert is embedded in `Edital.html`, increasing file size and making diffs difficult.
- The main HTML file is large and generated/saved, so reviews will be noisy and semantic changes are hard to isolate.

## Security And Privacy

- Evidence-backed: `common_v205.js.download` reads `localStorage.getItem('base')`, parses user/session data, logs profile names, refreshes token data, and sends parameters to backend endpoints.
- Evidence-backed: `common_v205.js.download` queries `https://brasilapi.com.br/api/cnpj/v1/${cnpj}` with CNPJ input. This is public company identifier data, but still an external request triggered by user input.
- Evidence-backed: multiple `innerHTML` assignments receive values derived from runtime data or responses. This is not automatically exploitable in a static capture, but becomes relevant if untrusted backend/user data is rendered.
- Unknown: whether any committed data includes real session values or personal data. The inspected files show code paths and template text, not obvious embedded secrets.
- Unknown: whether the original external services expect this code to be publicly mirrored or run outside the AGU/CGU deployment context.

## Maintainability

- There is no observed `README`, package manifest, test runner, build script, or source/dependency update process.
- Most implementation appears as generated/saved HTML plus downloaded assets, not editable source modules.
- Vendor bundles and app code are mixed in `Ger@AGU - Editais/Edital_files/`, making ownership and update responsibilities unclear.
- Missing source maps and minified bundles reduce traceability for defects.

## Portability

- `Zone.Identifier` files are Windows metadata artifacts and are not portable source assets.
- Path names containing spaces and special characters require careful quoting in shell scripts and CI configuration.
- External fonts, favicon, and API endpoints mean offline or air-gapped use will not fully match the original page.
- The code assumes browser APIs and a backend path relative to the current host, limiting static-file portability.

## Data Integrity

- The HTML begins with a browser `saved from url` comment, so the capture may represent one point-in-time runtime state rather than canonical source.
- Dynamic document generation is embedded in saved HTML and JS; it is unclear whether generated clauses match current upstream legal templates.
- Missing build metadata makes it difficult to verify whether local assets are complete, current, or tampered with.
- Source map references point to absent files, so bundle integrity cannot be reconstructed from source maps.

## Recommended Next Actions

- Decide whether this repo is intended to preserve a static capture or become maintainable source.
- Remove or quarantine `:Zone.Identifier` files if they are not intentionally tracked as evidence.
- Add a short `README` documenting provenance, capture date/source, intended use, and whether external endpoints should be live.
- Inventory third-party assets and replace copied/minified files with package-managed dependencies when maintenance is expected.
- If the page will be hosted, review all live endpoints, `localStorage` usage, and `innerHTML` rendering paths before deployment.
- If offline/static use is intended, localize external fonts/favicon or document expected network calls.

## Evidence

- `Ger@AGU - Editais/Edital.html:2` contains `saved from url=(0048)https://cgu.agu.gov.br/edital/montagem/index.php`.
- `Ger@AGU - Editais/Edital.html:9` references remote favicon `https://cgu.agu.gov.br/images/logo_cguteg_p.png`.
- `Ger@AGU - Editais/Edital.html:20-28` loads local downloaded scripts such as `core.min.js.download`, `jquery.min.js.download`, and `common_v205.js.download`.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:3-9` reads `localStorage` key `base` and uses profile data in the page.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:39` calls `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py?id=${id}`.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-488` builds a same-host `/cgi-bin/sapiens_com/relsapiens/coleta.py` POST endpoint.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:770` calls `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`.
- `Ger@AGU - Editais/Edital_files/jquery.min.js.download:2` identifies jQuery version `3.3.1` in a downloaded minified file.
- `Ger@AGU - Editais/Edital_files/core-init.js.download:14111`, `core.min.js.download:2`, and `core.min.css:2` reference missing `.map` files.
- `Ger@AGU - Editais/Edital_files/css:7` and following `@font-face` rules load fonts from `https://fonts.gstatic.com/...`.
- `Ger@AGU - Editais/Edital.html:Zone.Identifier` and many files under `Ger@AGU - Editais/Edital_files/*:Zone.Identifier` are present.
- Repository root contains `.planning/` and `Ger@AGU - Editais/`; no package/build/test manifest files were found by glob search.

## Unknowns

- Whether this repository is an archival snapshot, a seed for a new implementation, or intended for deployment.
- Whether the captured assets are current with the upstream AGU/CGU application.
- Whether any source repository exists elsewhere for the generated HTML and downloaded bundles.
- Whether external endpoints require authentication, are reachable from intended environments, or should be disabled in this copy.
- Whether browser execution was tested after capture.
