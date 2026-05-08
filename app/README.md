# Gerador de Termo de Referencia

Aplicacao web local, sem backend, para preencher o modelo DOCX convertido do Termo de Referencia com campos guiados, notas explicativas, escolhas condicionais e preview ao vivo.

## Como Usar

1. Abra `app/index.html` no navegador.
2. Preencha os campos obrigatorios.
3. Use os botoes `Nota explicativa` para consultar orientacoes juridicas durante o preenchimento.
4. Resolva as alternativas `OU` exibidas como escolhas obrigatorias.
5. Clique em `Verificar pendencias`.
6. Quando nao houver pendencias, clique em `Gerar HTML imprimivel`.

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

- `model-data.js` - dados estruturados e contrato de extracao consumidos pela UI.
- `index.html` - shell local da aplicacao.
- `styles.css` - layout, preview e responsividade.
- `app.js` - renderizacao do formulario, preview, validacao e HTML imprimivel.
