# Requirements: Gerador de Termo de Referencia AGU

**Defined:** 2026-05-08
**Core Value:** Permitir que o usuario preencha corretamente um Termo de Referencia juridicamente sensivel, preservando as orientacoes da AGU e explicitando as condicionantes que hoje ficam escondidas em cores, notas e alternativas textuais.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Reverse Engineering

- [x] **REV-01**: O sistema deve documentar os padroes relevantes do Ger@AGU: formulario guiado, preview, notas explicativas, regras condicionais, validacoes e saida HTML.
- [x] **REV-02**: O sistema deve identificar quais partes do Ger@AGU podem inspirar a nova implementacao sem reutilizar chamadas externas ou codigo inseguro da captura.
- [x] **REV-03**: O sistema deve preservar a experiencia de exibicao de notas explicativas em contexto equivalente ao Ger@AGU.

### Model Extraction

- [ ] **EXT-01**: A conversao deve preferir o DOCX como fonte canonica quando ele preservar estrutura, comentarios, cores e italico melhor que o HTML.
- [ ] **EXT-02**: A extracao deve reconhecer texto preto como conteudo normalmente invariavel.
- [ ] **EXT-03**: A extracao deve reconhecer texto vermelho italico como conteudo variavel a preencher, adotar, condicionar ou remover.
- [ ] **EXT-04**: A extracao deve reconhecer placeholders entre colchetes, como `[indicar o prazo]`, como campos de preenchimento.
- [ ] **EXT-05**: A extracao deve reconhecer blocos alternativos separados por `OU` como escolhas explicitas do usuario.
- [ ] **EXT-06**: A extracao deve capturar notas explicativas do modelo e vincula-las ao trecho/clausula correspondente sempre que possivel.
- [ ] **EXT-07**: A extracao deve preservar a versao/identificacao do modelo para rastreabilidade.

### Guided Authoring

- [ ] **GUI-01**: O usuario deve preencher dados por campos guiados, seletores e decisoes, evitando edicao direta do texto juridico quando houver estrutura conhecida.
- [ ] **GUI-02**: O usuario deve ver notas explicativas juridicas relevantes junto ao campo, clausula ou escolha que elas condicionam.
- [ ] **GUI-03**: O usuario deve resolver alternativas `OU` por controles explicitos, com exibicao clara das consequencias no preview.
- [ ] **GUI-04**: O usuario deve receber alertas para campos obrigatorios vazios, placeholders nao resolvidos e escolhas incompatíveis.
- [ ] **GUI-05**: O usuario deve conseguir distinguir texto invariavel, texto variavel e instrucoes/notas durante o preenchimento.

### Preview And Output

- [ ] **OUT-01**: O sistema deve exibir preview do Termo de Referencia enquanto o usuario preenche campos e escolhas.
- [ ] **OUT-02**: O sistema deve gerar HTML imprimivel do documento final.
- [ ] **OUT-03**: O HTML final deve suprimir notas explicativas e instrucoes que devem sair da versao original finalizada.
- [ ] **OUT-04**: O sistema deve sinalizar ou impedir geracao final se ainda houver placeholders entre colchetes, alternativas `OU` nao resolvidas ou campos obrigatorios vazios.
- [ ] **OUT-05**: O sistema deve manter informacao de versao/origem do modelo utilizado para facilitar juntada ou revisao no processo.

### Local App Quality

- [ ] **APP-01**: O v1 deve funcionar como aplicacao web local sem backend, login ou banco de dados.
- [ ] **APP-02**: O v1 nao deve executar chamadas aos endpoints originais da AGU/CGU herdados da captura do Ger@AGU.
- [ ] **APP-03**: O codigo deve separar dados extraidos do modelo, regras condicionais e interface para facilitar manutencao.
- [ ] **APP-04**: Deve existir um roteiro de verificacao manual cobrindo extracao, notas, alternativas, preview e HTML imprimivel.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Export And Persistence

- **V2-01**: Exportar DOCX editavel a partir do preenchimento.
- **V2-02**: Salvar e recuperar preenchimentos localmente.
- **V2-03**: Gerar extrato de alteracoes entre o modelo original e o documento final.
- **V2-04**: Suportar multiplos modelos de Termo de Referencia ou outros instrumentos.
- **V2-05**: Validar regras juridicas mais complexas com matriz de condicionantes versionada.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Backend, login ou banco de dados | V1 deve ser web local simples e evitar dependencias externas |
| DOCX exportavel no v1 | Usuario priorizou HTML imprimivel |
| Reescrever juridicamente o modelo | A ferramenta deve preservar o conteudo AGU e estruturar preenchimento, nao substituir assessoria juridica |
| Usar endpoints originais do Ger@AGU | Captura contem chamadas externas que podem ser inadequadas fora do ambiente original |
| Automatizacao total de todos os casos juridicos | V1 deve cobrir o modelo atual com rastreabilidade e revisao humana |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REV-01 | Phase 1 | Complete |
| REV-02 | Phase 1 | Complete |
| REV-03 | Phase 1 | Complete |
| EXT-01 | Phase 2 | Pending |
| EXT-02 | Phase 2 | Pending |
| EXT-03 | Phase 2 | Pending |
| EXT-04 | Phase 2 | Pending |
| EXT-05 | Phase 2 | Pending |
| EXT-06 | Phase 2 | Pending |
| EXT-07 | Phase 2 | Pending |
| GUI-01 | Phase 3 | Pending |
| GUI-02 | Phase 3 | Pending |
| GUI-03 | Phase 3 | Pending |
| GUI-04 | Phase 3 | Pending |
| GUI-05 | Phase 3 | Pending |
| OUT-01 | Phase 4 | Pending |
| OUT-02 | Phase 4 | Pending |
| OUT-03 | Phase 4 | Pending |
| OUT-04 | Phase 4 | Pending |
| OUT-05 | Phase 4 | Pending |
| APP-01 | Phase 3 | Pending |
| APP-02 | Phase 3 | Pending |
| APP-03 | Phase 3 | Pending |
| APP-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-08 after Phase 1 execution*
