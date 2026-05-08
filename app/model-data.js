/* Structured TR model seed derived from the current AGU model and Phase 1 handoff. */
window.TR_MODEL = {
  metadata: {
    id: "tr-servico-sem-dedicacao-exclusiva-lei-14133-dez-25",
    title: "Termo de Referencia - Servico sem dedicacao exclusiva de mao de obra",
    sourceName: "modelo-de-termo-de-contrato-servico-sem-mao-de-obra-exclusiva-lei-no-14-133-dez-25.docx",
    sourceType: "DOCX canonical, HTML auxiliary",
    versionLabel: "dez/25",
    outputMode: "printable-html",
    notesSuppressedInFinal: true
  },
  notes: [
    {
      id: "official-color-rules",
      title: "Como interpretar cores e notas",
      body: [
        "Texto preto e normalmente invariavel; alteracoes devem ser justificadas nos autos.",
        "Texto vermelho italico foi feito para variar, ser preenchido, adotado ou removido conforme o caso concreto.",
        "Notas explicativas orientam o preenchimento e devem ser suprimidas da versao final."
      ]
    },
    {
      id: "vigencia-prorrogacao",
      title: "Escolha da vigencia e prorrogacao",
      body: [
        "Escolha apenas uma das redacoes separadas por OU.",
        "Use a primeira quando a vigencia estiver vinculada ao art. 105 da Lei 14.133/2021.",
        "Use a segunda quando houver prorrogacao sucessiva por ate 10 anos, na forma dos arts. 106 e 107 da Lei 14.133/2021."
      ]
    }
  ],
  fields: [
    { id: "ente_nome", label: "Nome do orgao ou entidade", required: true, placeholder: "Ex.: Ministerio ..." },
    { id: "processo_numero", label: "Processo administrativo", required: true, placeholder: "xxxxx.xxxxxx/xxxx-xx" },
    { id: "prazo_vigencia", label: "Prazo de vigencia", required: true, placeholder: "Ex.: 12 meses" },
    { id: "termo_inicial", label: "Termo inicial da vigencia", required: true, placeholder: "Ex.: assinatura do contrato" }
  ],
  choices: [
    {
      id: "ente_tipo",
      label: "Tipo de ente contratante",
      required: true,
      noteIds: ["official-color-rules"],
      options: [
        { value: "uniao", label: "Uniao" },
        { value: "autarquia", label: "Autarquia" },
        { value: "fundacao", label: "Fundacao" }
      ]
    },
    {
      id: "vigencia_modelo",
      label: "Modelo de vigencia",
      required: true,
      noteIds: ["vigencia-prorrogacao"],
      options: [
        {
          value: "art105",
          label: "Vigencia comum - art. 105",
          output: [
            "O prazo de vigencia da contratacao e de {{prazo_vigencia}} contados do(a) {{termo_inicial}}, na forma do artigo 105 da Lei n. 14.133, de 2021.",
            "O prazo de vigencia sera automaticamente prorrogado, independentemente de termo aditivo, quando o objeto nao for concluido no periodo firmado acima, ressalvadas as providencias cabiveis no caso de culpa do CONTRATADO, previstas neste instrumento."
          ]
        },
        {
          value: "arts106107",
          label: "Prorrogavel sucessivamente - arts. 106 e 107",
          output: [
            "O prazo de vigencia da contratacao e de {{prazo_vigencia}} contados do(a) {{termo_inicial}}, prorrogavel sucessivamente por ate 10 anos, na forma dos artigos 106 e 107 da Lei n. 14.133, de 2021.",
            "A prorrogacao de que trata este item e condicionada ao ateste, pela autoridade competente, de que as condicoes e os precos permanecem vantajosos para a Administracao, permitida a negociacao com o CONTRATADO."
          ]
        }
      ]
    }
  ],
  sections: [
    {
      id: "identificacao",
      title: "Identificacao da contratacao",
      noteIds: ["official-color-rules"],
      blocks: [
        {
          id: "identificacao-ente",
          type: "paragraph",
          role: "mixed_semantic",
          text: "A {{ente_tipo}} {{ente_nome}}, conforme dados do processo administrativo n. {{processo_numero}}, conduz a elaboracao deste Termo de Referencia."
        }
      ]
    },
    {
      id: "vigencia-prorrogacao",
      title: "Clausula segunda - Vigencia e prorrogacao",
      noteIds: ["vigencia-prorrogacao"],
      blocks: [
        {
          id: "vigencia-choice",
          type: "choice",
          choiceId: "vigencia_modelo",
          role: "alternative_ou",
          unresolvedWarning: "Escolha uma das redacoes de vigencia separadas por OU."
        }
      ]
    }
  ],
  extractionContract: {
    fixedTextRole: "black invariant text",
    variableTextRole: "red italic text",
    placeholderPattern: "\\[[^\\]]+\\]",
    alternativeMarker: "OU",
    ambiguityPolicy: "preserve source evidence and require review"
  }
};
