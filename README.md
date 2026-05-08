# Gerador de Termo de Referencia AGU

Aplicacao web estatica para preenchimento guiado de Termo de Referencia, com preview, notas explicativas e exportacao HTML imprimivel.

## Estrutura

- `app/` - site estatico publicado no GitHub Pages.
- `app/index.html` - entrada da aplicacao.
- `app/styles.css` - layout da interface e do documento.
- `app/app.js` - renderizacao, validacao, preview e exportacao.
- `app/model-data.js` - modelo estruturado gerado a partir do DOCX canonico.
- `tools/` - extratores usados para regenerar `app/model-data.js`.
- `docs/` - documentacao tecnica do processo de conversao.
- `Documentos modelo/` - fontes e imagens de referencia locais.

## GitHub Pages

O workflow em `.github/workflows/pages.yml` publica a pasta `app/` automaticamente.

Para habilitar:

1. Envie este repositorio para o GitHub.
2. Abra `Settings` -> `Pages`.
3. Em `Build and deployment`, escolha `Source: GitHub Actions`.
4. Faca push na branch `master` ou `main`.

O site publicado usara `app/index.html` como pagina inicial. A aplicacao nao precisa de backend ou etapa de build.

## Desenvolvimento Local

Abra `app/index.html` diretamente no navegador ou rode um servidor local:

```bash
python3 -m http.server 4173 --directory app
```

Depois acesse `http://127.0.0.1:4173/`.

## Regenerar Modelo

```bash
python3 tools/extract_docx_model.py "Documentos modelo/modelo-de-termo-de-referencia-servicos-e-obras-lei-no-14-133-dez-25.docx" --model-js app/model-data.js
```
