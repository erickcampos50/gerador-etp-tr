# Testing
## Summary
- No automated test suite, package scripts, CI config, or test framework configuration was found in the repository snapshot.
- Quality verification appears to be manual browser-based validation of a static captured HTML page.
- The main test surface is whether `Ger@AGU - Editais/Edital.html` opens locally, initializes downloaded scripts, allows form interactions, updates the generated edital preview, shows explanatory modals, validates required fields, and downloads generated HTML files.

## Existing Test Coverage
- No test files were found.
- No `package.json` or `npm test` script was found.
- No visible Jest, Vitest, Cypress, Playwright, Mocha, Selenium, pytest, or unittest setup was found.
- Some runtime validation exists in application JavaScript, for example required-field checks before saving and numeric/time input validation, but these are production logic rather than automated tests.

## Test Frameworks
- None detected.
- Runtime libraries used by the page include GOV.BR Design System core, jQuery, and SweetAlert, but they are not configured as test tools.
- There is no visible local browser automation harness.

## Manual Verification
- Open `Ger@AGU - Editais/Edital.html` directly in a modern browser.
- Confirm the header, two-column layout, accordion/sidebar, and edital preview render without blank sections.
- Confirm GOV.BR widgets initialize, including accordions, date/time picker controls, selects, tooltips, and buttons.
- Click several explanatory-note buttons and confirm SweetAlert modals open with note content.
- Change representative inputs and options, then confirm corresponding marked text in the right-side edital preview updates.
- Use the required-field flow by clicking `Salvar como HTML` with missing/invalid fields and confirm warnings appear instead of failed downloads.
- Complete the required fields enough to click `Salvar como HTML` and confirm generated `Modelo_...` and `Extrato_...` downloads are triggered.
- Check the browser console for JavaScript errors during load, interactions, validation, and download.

## Gaps
- No automated regression coverage for the large inline script in `Edital.html`.
- No automated coverage for exported HTML contents or generated document numbering.
- No automated validation that all local asset paths resolve after moving/copying the capture.
- No linting/static analysis to catch accidental globals, assignment-in-condition bugs, malformed HTML fragments, or missing dependencies.
- No accessibility, responsive, or cross-browser test baseline.
- No dependency integrity or version tracking for vendored/minified downloaded assets.

## Suggested Smoke Tests
- Static load smoke test: serve or open `Ger@AGU - Editais/Edital.html` and assert no console errors on initial load.
- Asset smoke test: verify all relative `./Edital_files/...` CSS, JS, and image resources referenced by `Edital.html` return/load successfully.
- UI initialization smoke test: verify `.br-accordion`, `.br-datetimepicker`, `.br-select`, and `.br-tooltip` elements initialize without throwing.
- Modal smoke test: click one `NotaExplicativa(...)` button and assert a SweetAlert dialog appears and can be dismissed.
- Data-binding smoke test: change a representative text/number/radio input and assert the matching preview span/div text changes.
- Validation smoke test: clear a required field, click `Salvar como HTML`, and assert an `AvisoErro` warning appears and no download starts.
- Export smoke test: fill required fields in a known happy path, click `Salvar como HTML`, and assert two HTML downloads are requested.
- Responsive smoke test: view at desktop width and mobile/narrow width and confirm both left controls and right preview remain usable or scrollable.

## Evidence
- Repository glob found no `package.json` under `/home/erick/gerador-etp-tr`.
- Content search found no test framework declarations or test files; matches were only incidental words like `split` and runtime vendor code.
- `Ger@AGU - Editais/Edital.html` lines 20-28: runtime dependencies loaded directly from local files.
- `Ger@AGU - Editais/Edital.html` lines 2070-2144: browser runtime initializes date/time picker, select, header, and footer.
- `Ger@AGU - Editais/Edital.html` lines 5200-5305: `SalvarComoHTML` required-field validation, Blob download flow, and server logging attempt.
- `Ger@AGU - Editais/Edital.html` lines 5359-5413: numeric/string validation helpers.
- `Ger@AGU - Editais/Edital_files/common_v205.js.download` lines 151-210: SweetAlert success/toast/error helpers used for manual feedback.

## Unknowns
- Whether upstream source has tests outside this browser-captured repository is unknown.
- Whether a specific browser/version is required for GOV.BR core components is unknown.
- Whether remote service calls such as `CarregaDados`, logging, or token refresh are expected to work from the static capture is unknown.
- Whether downloads should be verified manually only or eventually automated with browser tests is unknown.
