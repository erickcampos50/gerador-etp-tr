# Integrations

## Summary
- Integrations are client-side browser integrations from a saved static HTML capture.
- The page depends on local downloaded vendor libraries, local images, remote fonts/favicon links, same-origin CGI services, and at least one public CNPJ API.
- No server-side integration code is present in this repository snapshot.

## External Libraries
- jQuery 3.3.1 from `Edital_files/jquery.min.js.download`.
- SweetAlert2 from `Edital_files/sweetalert.min.js.download`, exposed as `Swal` and used for loading/error dialogs.
- GOV.BR Design System core JavaScript/CSS from `core.min.js.download`, `core-init.js.download`, and `core.min.css`.
- Font Awesome Free 5.11.2 from `all.min.css` for icon classes such as `fas fa-circle`.
- Google Fonts Raleway CSS saved as `Edital_files/css`, with remote font URLs under `https://fonts.gstatic.com/...`.
- Rawline font CSS in `rawline.css`, with unresolved local references to `../font/rawline-*` font files.

## Browser Or Platform APIs
- DOM APIs: `document.getElementById`, `querySelector`, `querySelectorAll`, `createElement`, `appendChild`, and class manipulation.
- Navigation APIs: `window.location.href`, `window.location.search`, protocol/host inspection, and redirects.
- Storage APIs: `localStorage.getItem('base')` and `localStorage.removeItem('base')` for session/profile data.
- Fetch API: GET and POST calls to CGI services and BrasilAPI.
- URL/form helpers: `URLSearchParams` for `application/x-www-form-urlencoded` POST bodies.
- Timer APIs: `setTimeout`, `setInterval`, and retry delays.
- Navigator/document visibility APIs appear in the GOV.BR core bundles.

## Network Or Backend Services
- Original page URL signal: `https://cgu.agu.gov.br/edital/montagem/index.php`.
- Favicon loaded from `https://cgu.agu.gov.br/images/logo_cguteg_p.png`.
- Token refresh endpoint: `https://siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py?id=...`.
- Same-origin data endpoint constructed as `${window.location.protocol}//${window.location.host}/cgi-bin/sapiens_com/relsapiens/coleta.py`.
- BrasilAPI CNPJ lookup: `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`.
- Generated/document links reference legal and government sites such as `planalto.gov.br`, `gov.br/compras`, and `in.gov.br`; these are content links, not application service calls.

## Static Assets
- Images: `Edital_files/Logo_CGUTEC_Horizontal_p.png` and `Edital_files/duvidas.png`.
- CSS: `base.css`, `rawline.css`, `core.min.css`, `all.min.css`, and downloaded `css` font stylesheet.
- JavaScript downloads: `notas_explicativas_v205.js.download`, `sweetalert.min.js.download`, `estilos.js.download`, `common_v205.js.download`, `cabecalho.js.download`, `rodape.js.download`, `jquery.min.js.download`, `core-init.js.download`, and `core.min.js.download`.
- Zone metadata artifacts are present beside HTML, CSS, JS, image, and font CSS files as `:Zone.Identifier` entries.

## Data Sources
- Hidden HTML inputs in `Edital.html` provide initial edital/entity values such as CNPJ, orgao, setor, endereco, pregao, objeto, valor, modalidade, and flags.
- `common_v205.js.download` stores/reads session-like data from `localStorage` under key `base`.
- `CarregaDados` posts dynamic parameters (`script`, `base`, `sqlpronto`, `param1...`) to the same-origin CGI data endpoint and expects JSON responses.
- `buscaCNPJ` fetches organization data from BrasilAPI by CNPJ and fills related fields.
- `notas_explicativas_v205.js.download` contains an in-file array of explanatory legal text snippets.
- `Edital.html` contains a large amount of embedded generated edital text and inline JavaScript rules.

## Authentication And Security Integrations
- Session/token behavior is inferred from localStorage key `base`, fields such as `dados.id_usr`, `dados.perfil.nome`, and token expiration checks.
- Token refresh calls `siscon-dev2.agu.gov.br/cgi-bin/sapiens_com/refresh/rtoken.py` and then posts refreshed token data through `CarregaDados`.
- `Logoff` removes `localStorage` key `base` and redirects to a login path when hosted under a SISCON domain.
- No OAuth/OpenID client library, cookie configuration, CSRF handling, or server-side auth implementation is present in this capture.
- Some HTML is assembled with template strings and assigned through `innerHTML`; sanitization is only partially visible (`sanitizeInput` usage appears in generated annex code), so source-level security guarantees cannot be established from this snapshot.

## Evidence
- `Ger@AGU - Editais/Edital.html:2`: saved-from URL for `https://cgu.agu.gov.br/edital/montagem/index.php`.
- `Ger@AGU - Editais/Edital.html:8-28`: stylesheet and script integrations loaded from `Edital_files` plus remote favicon.
- `Ger@AGU - Editais/Edital.html:136-158`: hidden input data seed values.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:3-20`: localStorage session read, profile display, token expiration check.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:39-43`: SISCON token refresh fetch.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:462-489`: same-origin CGI `CarregaDados` POST integration.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download:737-770`: retrying fetch helper and BrasilAPI CNPJ URL.
- `Ger@AGU - Editais/Edital_files/css:1-60`: downloaded Raleway font CSS with `fonts.gstatic.com` URLs.
- `Ger@AGU - Editais/Edital_files/*.download:Zone.Identifier`: Windows/browser download metadata artifacts.

## Unknowns
- Required authentication context for the CGI endpoints is unknown.
- API response schemas and database tables behind `CarregaDados` are not available.
- Whether this snapshot is meant to run offline or only as an archive is unknown.
- Missing Rawline font files and source maps may be available in the original deployed environment but are absent here.
