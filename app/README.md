# Aplicacao Publica

Esta pasta e o site estatico publicado no GitHub Pages. Ela contem tudo que precisa ser servido: `index.html`, `styles.css`, `app.js`, `model-data.js` e `.nojekyll`.

## Como Usar

1. Abra `index.html` no navegador, ou use o workflow de GitHub Pages da raiz do repositorio.
2. Preencha os campos disponiveis.
3. Use os botoes `Nota explicativa` para consultar orientacoes juridicas durante o preenchimento.
4. Resolva as alternativas `OU` exibidas como escolhas.
5. Clique em `Verificar pendencias` para revisar campos pendentes.
6. Clique em `Gerar HTML imprimivel` para exportar o resultado.

## Conversao

- `model-data.js` e gerado a partir do DOCX canonico por `tools/extract_docx_model.py --model-js app/model-data.js`.
- A conversao inclui as clausulas do documento, comentarios como notas explicativas, placeholders entre colchetes, preenchimentos `xxxx`/pontilhados e alternativas `OU` de bloco.
- Alternativas inline como `[A] OU [B]` tambem viram seletores no formulario.

## Limites do v1

- A conversao preserva evidencia e automatiza os casos estruturais principais, mas ainda exige revisao juridica de ambiguidades do modelo original.
- O arquivo final gerado e HTML imprimivel.
- Notas explicativas aparecem apenas no modo de autoria e nao entram no HTML final.
- Nao ha backend, login, banco de dados, chamadas AGU/CGU, `localStorage` ou integracoes externas.

## Arquivos

- `index.html` - shell local da aplicacao.
- `styles.css` - layout, preview e responsividade.
- `app.js` - renderizacao do formulario, preview, validacao e HTML imprimivel.
- `model-data.js` - dados estruturados e contrato de extracao consumidos pela UI.
- `.nojekyll` - impede processamento Jekyll quando publicado no GitHub Pages.
