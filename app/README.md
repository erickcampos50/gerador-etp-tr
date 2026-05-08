# Gerador de Termo de Referencia

Aplicacao web local, sem backend, para preencher trechos representativos do Termo de Referencia com campos guiados, notas explicativas, escolhas condicionais e preview ao vivo.

## Como Usar

1. Abra `app/index.html` no navegador.
2. Preencha os campos obrigatorios.
3. Use os botoes `Nota explicativa` para consultar orientacoes juridicas durante o preenchimento.
4. Escolha uma das alternativas de vigencia.
5. Clique em `Verificar pendencias`.
6. Quando nao houver pendencias, clique em `Gerar HTML imprimivel`.

## Limites do v1

- O v1 cobre uma semente estruturada representativa, incluindo identificacao e vigencia/prorrogacao.
- O arquivo final gerado e HTML imprimivel.
- Notas explicativas aparecem apenas no modo de autoria e nao entram no HTML final.
- Nao ha backend, login, banco de dados, chamadas AGU/CGU, `localStorage` ou integracoes externas.

## Arquivos

- `model-data.js` - dados estruturados e contrato de extracao consumidos pela UI.
- `index.html` - shell local da aplicacao.
- `styles.css` - layout, preview e responsividade.
- `app.js` - renderizacao do formulario, preview, validacao e HTML imprimivel.
