# Gerador de Termo de Referencia AGU

## What This Is

Este projeto transforma o modelo atual de Termo de Referencia para servicos sem regime de dedicacao exclusiva de mao de obra em uma ferramenta web local de preenchimento guiado. A experiencia deve se inspirar no `Ger@AGU - Editais`: campos sistematizados, notas explicativas juridicas visiveis no momento certo, preview do documento e regras condicionais que reduzem erros de digitacao e escolhas incompatíveis.

O documento-alvo esta em `Documentos modelo/`, apesar de o nome do arquivo conter a palavra "contrato". Neste projeto, esses arquivos representam o Termo de Referencia mais atual para esse tipo de contratacao; o DOCX deve ser tratado como fonte canonica para extracao semantica quando preservar melhor cores, comentarios e estrutura, e o HTML como fonte auxiliar para leitura visual e preview.

## Core Value

Permitir que o usuario preencha corretamente um Termo de Referencia juridicamente sensivel, preservando as orientacoes da AGU e explicitando as condicionantes que hoje ficam escondidas em cores, notas e alternativas textuais.

## Requirements

### Validated

- ✓ Existe uma referencia funcional de experiencia em `Ger@AGU - Editais/Edital.html`, com formulario lateral, preview do documento e notas explicativas acionadas por botoes — existing
- ✓ O modelo de Termo de Referencia existe em DOCX e HTML em `Documentos modelo/` — existing
- ✓ O DOCX preserva sinais importantes para automacao: comentarios/notas em `word/comments.xml`, texto vermelho `FF0000`, itálico e estrutura Word — existing
- ✓ O modelo contem trechos variaveis, alternativas marcadas por `OU`, placeholders entre colchetes e notas explicativas juridicas que orientam o preenchimento — existing
- ✓ A v1 local entrega extrator DOCX, contrato de conversao, semente estruturada, UI guiada, notas contextuais, preview, validacao e HTML imprimivel — Milestone 1

### Active

(None — Milestone 1 complete. Future scope is tracked under v2 requirements.)

### Completed In Milestone 1

- [x] Fazer engenharia reversa da experiencia do Ger@AGU para identificar padroes reutilizaveis: campos guiados, notas, preview, marcacao de alteracoes, validacoes e salvamento/saida HTML.
- [x] Criar um processo de extracao/conversao do Termo de Referencia a partir do DOCX, usando o HTML apenas quando facilitar leitura visual ou preview.
- [x] Classificar trechos do modelo por semantica: texto invariavel em preto, texto variavel em vermelho italico, placeholders entre colchetes, notas explicativas, alternativas `OU`, trechos opcionais e condicionais.
- [x] Transformar notas explicativas em ajuda contextual exibida ao usuario de modo equivalente ao Ger@AGU, sem incluir as notas na versao final imprimivel.
- [x] Implementar uma ferramenta web local simples, sem backend, para preencher os campos e escolhas do Termo de Referencia.
- [x] Gerar preview e saida HTML imprimivel do Termo de Referencia final, removendo instrucoes/notas que devem ser suprimidas e preservando rastreabilidade suficiente para revisao.
- [x] Adicionar validacoes para reduzir erro de digitacao, campos obrigatorios vazios, escolhas incompatíveis e alternativas `OU` nao resolvidas.

### Out of Scope

- Exportacao DOCX no v1 — a saida prioritaria escolhida e HTML imprimivel; DOCX pode ser v2.
- Backend, login, banco de dados ou chamadas aos endpoints originais da AGU/CGU — o v1 deve funcionar localmente e evitar dependencias externas.
- Reaproveitamento cego do codigo baixado do Ger@AGU — ele e uma referencia de produto/UX, mas contem captura estatica, scripts com chamadas externas e artefatos de download.
- Alterar o conteudo juridico por criterio proprio — a ferramenta deve estruturar e operacionalizar o modelo, nao revisar juridicamente a minuta.
- Automatizar todos os casos juridicos possiveis no primeiro ciclo — o v1 deve cobrir a base do modelo atual e deixar pontos ambiguos rastreados para revisao humana.

## Context

O diretorio contem uma pagina baixada chamada `Ger@AGU - Editais`, considerada inspiradora por sistematizar o preenchimento de documentacao de licitacao, reduzir erros e ajudar o usuario a compreender impactos de cada escolha. O mapeamento em `.planning/codebase/` mostra que essa referencia e uma captura estatica de uma pagina browser-only, com HTML, CSS, JavaScript baixado, SweetAlert, jQuery, GOV.BR Design System e um arquivo de notas explicativas.

O projeto tambem contem `Documentos modelo/`, com um DOCX e uma versao HTML do modelo atual. Embora o nome do arquivo mencione "termo de contrato", o usuario confirmou que se trata do Termo de Referencia especifico para servicos sem mao de obra residente/dedicacao exclusiva. As notas explicativas contidas no modelo sao determinantes para o correto preenchimento, pois trazem informacoes juridicas fornecidas pela Advocacia-Geral da Uniao.

As instrucoes oficiais de uso das cores devem guiar a conversao:

- Texto preto e, em regra, invariavel; alteracoes sem italico devem ser justificadas nos autos e podem demandar consulta juridica.
- Texto vermelho italico e feito para variar, devendo ser preenchido, adotado ou removido conforme oportunidade, conveniencia e peculiaridades do objeto.
- Notas explicativas servem para orientar o elaborador e devem ser suprimidas da versao final do documento.
- A versao do modelo, normalmente indicada no rodape, deve ser preservada ou registrada para rastreabilidade.

Um exemplo critico e a clausula de vigencia, em que o usuario deve escolher entre duas redacoes separadas por `OU` e preencher valores como `[indicar o prazo]` e `[indicar o termo inicial da vigencia]`. Esse tipo de estrutura deve virar uma decisao explicita no formulario, nao apenas texto livre no preview.

## Constraints

- **Fonte canonica**: Preferir DOCX para extracao quando ele preservar comentarios, cores e estrutura melhor que o HTML — o DOCX contem `word/document.xml`, `word/comments.xml`, cores `FF0000` e metadados Word.
- **Saida v1**: Gerar HTML imprimivel — foi a saida prioritaria escolhida pelo usuario.
- **Execucao local**: Web local simples, sem backend — reduz risco de dependencias externas e chamadas indevidas herdadas da captura do Ger@AGU.
- **Juridico**: Notas AGU e condicionantes devem ser preservadas como orientacao contextual — nao podem ser descartadas durante conversao.
- **Documento final**: Notas explicativas devem ser exibidas ao usuario durante preenchimento, mas suprimidas da versao final original/imprimivel.
- **Rastreabilidade**: Escolhas feitas em textos variaveis, alternativas `OU` e alteracoes em trechos pretos devem ser registraveis para revisao.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| V1 sera uma web local simples | O usuario priorizou simplicidade e funcionamento local, sem app moderno ou backend | — Pending |
| Saida primaria sera HTML imprimivel | O usuario escolheu HTML imprimivel como entrega v1 | — Pending |
| DOCX e fonte canonica de conversao | O DOCX preserva comentarios, cores, italico e estrutura melhor que o HTML de uma linha | — Pending |
| Ger@AGU e referencia de experiencia, nao base a copiar integralmente | A captura contem scripts baixados, chamadas externas e artefatos de download | — Pending |
| Pesquisa externa foi pulada na inicializacao | O usuario escolheu usar os documentos locais e contexto fornecido | — Pending |
| Workflow GSD em modo YOLO, fases coarse, execucao sequencial | Preferencia escolhida pelo usuario para conduzir o projeto | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-08 after autonomous milestone completion*
