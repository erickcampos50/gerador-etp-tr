# Manual Verification

## Scope

Verification checklist for the local TR generator v1.

## Smoke Tests

- [ ] Open `app/index.html` directly in a browser.
- [ ] Confirm controls appear on the left and document preview appears on the right on desktop.
- [ ] Resize to mobile width and confirm the layout stacks vertically.
- [ ] Click a `Nota explicativa` button and confirm a note opens without navigating away.
- [ ] Leave required fields empty and click `Verificar pendencias`; required-field errors must appear.
- [ ] Confirm `Gerar HTML imprimivel` is disabled while required fields or choices are unresolved.
- [ ] Confirm the form contains many generated fields from the DOCX, including placeholders and `xxxx`/dotted fill areas.
- [ ] Confirm inline alternatives like `[União] OU [Autarquia] OU [Fundação]` appear as radio choices instead of raw unresolved text.
- [ ] Choose one option in each block `OU` group, including vigencia, preco, garantia and extincao contratual.
- [ ] Switch a block `OU` choice and confirm the previous alternative is replaced in preview.
- [ ] Confirm preview highlights filled values and marks unresolved values before completion.
- [ ] Generate HTML and open/download `termo-referencia.html`.
- [ ] Confirm generated HTML contains the selected clause and filled values.
- [ ] Confirm generated HTML does not contain `Nota explicativa`, note button text, validation UI, controls, or unresolved `{{...}}` template markers.
- [ ] Confirm generated HTML includes model source/version metadata in the footer.

## Static Checks

Run from repository root:

```bash
node --check app/app.js
node --check app/model-data.js
python3 -m py_compile tools/extract_docx_model.py
python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --sample 3
python3 tools/extract_docx_model.py "Documentos modelo/DOCX modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx" --model-js /tmp/tr-model-data.js
```

Expected result: both commands exit with status 0.
