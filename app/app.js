(function () {
  "use strict";

  const model = window.TR_MODEL;
  const state = {
    fields: {},
    choices: {},
    excluded: {},
    tableData: {},
    previewEdits: {},
    sectionTitleEdits: {},
    previewEditing: false
  };
  let suppressPreviewFocusSync = false;

  const formRoot = document.getElementById("form-root");
  const previewRoot = document.getElementById("preview-root");
  const validationList = document.getElementById("validation-list");
  const modelMeta = document.getElementById("model-meta");
  const exportButton = document.getElementById("export-button");
  const editPreviewButton = document.getElementById("edit-preview-button");
  const noteDialog = document.getElementById("note-dialog");
  const noteBody = document.getElementById("note-body");

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function findField(id) {
    return model.fields.find((field) => field.id === id);
  }

  function findChoice(id) {
    return model.choices.find((choice) => choice.id === id);
  }

  function findNote(id) {
    return model.notes.find((note) => note.id === id);
  }

  function fieldDocumentLabel(field, fallback) {
    if (!field) return fallback;
    return String(field.label).replace(/^Campo \d+\.\d+:\s*/, "");
  }

  function templateToHtml(template, resolvePlaceholder) {
    let html = "";
    let lastIndex = 0;
    template.replace(/{{([^}]+)}}/g, (match, rawId, offset) => {
      html += escapeHtml(template.slice(lastIndex, offset));
      html += resolvePlaceholder(rawId.trim());
      lastIndex = offset + match.length;
      return match;
    });
    html += escapeHtml(template.slice(lastIndex));
    return html;
  }

  function renderTemplate(template, opts) {
    opts = opts || {};
    return templateToHtml(template, (id) => {
      if (state.excluded[id]) return opts.final ? "" : `<span class="excluded-placeholder"></span>`;

      const choice = findChoice(id);
      if (choice) {
        const selected = choice.options.find((option) => option.value === state.choices[id]);
        return selected ? `<mark data-field-id="${escapeHtml(id)}">${escapeHtml(selected.label)}</mark>` : `<span class="unresolved" data-field-id="${escapeHtml(id)}">${escapeHtml(choice.label)}</span>`;
      }

      const value = state.fields[id];
      if (value) {
        return `<mark data-field-id="${escapeHtml(id)}">${escapeHtml(value)}</mark>`;
      }
      const field = findField(id);
      return `<span class="unresolved" data-field-id="${escapeHtml(id)}">${escapeHtml(fieldDocumentLabel(field, id))}</span>`;
    });
  }

  function validationMessages() {
    const messages = [];
    model.fields.forEach((field) => {
      if (!state.excluded[field.id] && field.required && !state.fields[field.id]) {
        messages.push({ type: "error", text: `Campo obrigatorio pendente: ${field.label}` });
      }
    });
    model.choices.forEach((choice) => {
      if (!state.excluded[choice.id] && choice.required && !state.choices[choice.id]) {
        messages.push({ type: "error", text: `Escolha obrigatoria pendente: ${choice.label}` });
      }
    });
    if (!messages.length) {
      messages.push({ type: "ok", text: "Sem pendencias obrigatorias para os campos representativos." });
    }
    return messages;
  }

  function renderValidation() {
    validationList.innerHTML = "";
    const messages = validationMessages();
    messages.forEach((message) => {
      const item = document.createElement("li");
      item.className = message.type;
      item.textContent = message.text;
      validationList.appendChild(item);
    });
    exportButton.disabled = false;
  }

  function noteButton(noteId) {
    const button = document.createElement("button");
    button.className = "note-button";
    button.type = "button";
    button.textContent = "i";
    button.title = "Nota explicativa";
    button.addEventListener("click", (e) => { e.stopPropagation(); showNote(noteId); });
    return button;
  }

  function documentHeaderHtml() {
    return `
      <header class="document-header">
        <div class="document-seal" aria-hidden="true">AGU</div>
        <div class="document-heading-text">
          <strong>Advocacia-Geral da União</strong>
          <span>Modelo referencial de contratação pública</span>
          <small>${escapeHtml(model.metadata.versionLabel || "versao nao informada")}</small>
        </div>
      </header>
      <div class="document-annex">Anexo - modelo referencial</div>
      <h1>Termo de Referência</h1>
      <p class="document-model-title">${escapeHtml(model.metadata.title)}</p>
    `;
  }

  function documentFooterHtml() {
    const notePolicy = model.metadata.notesSuppressedInFinal ? "notas explicativas suprimidas da versão final" : "política de notas não definida";
    return `<footer class="document-footer">Modelo utilizado: ${escapeHtml(model.metadata.sourceName || "fonte não informada")} (${escapeHtml(model.metadata.versionLabel || "versão não informada")}) - ${escapeHtml(notePolicy)}</footer>`;
  }

  function appendDocumentChrome(target) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = documentHeaderHtml();
    while (wrapper.firstChild) target.appendChild(wrapper.firstChild);
  }

  function blockClassName(block, extra) {
    const classes = [];
    if (extra) classes.push(extra);
    if (block.role === "variable_red_italic") classes.push("variable-output");
    if (block.role === "mixed_semantic") classes.push("semantic-review");
    return classes.join(" ");
  }

  function classAttribute(value) {
    return value ? ` class="${escapeHtml(value)}"` : "";
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function sanitizeEditableHtml(html) {
    const allowedSpanClasses = new Set(["conditional-output", "variable-output", "semantic-review"]);
    const template = document.createElement("template");
    template.innerHTML = String(html || "");

    function sanitizeNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return escapeHtml(node.textContent || "");
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }

      const tag = node.tagName.toLowerCase();
      if (tag === "br") return "<br>";
      const children = Array.from(node.childNodes).map(sanitizeNode).join("");
      if (["mark", "strong", "b", "em", "i", "u"].includes(tag)) {
        return `<${tag}>${children}</${tag}>`;
      }
      if (tag === "span") {
        const classes = Array.from(node.classList).filter((cls) => allowedSpanClasses.has(cls));
        const classHtml = classes.length ? ` class="${classes.map(escapeHtml).join(" ")}"` : "";
        return classHtml ? `<span${classHtml}>${children}</span>` : children;
      }
      if (tag === "div" || tag === "p") {
        return children ? `${children}<br>` : "";
      }
      return children;
    }

    return Array.from(template.content.childNodes).map(sanitizeNode).join("");
  }

  function insertPlainText(text) {
    if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
      document.execCommand("insertText", false, text);
      return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
  }

  function handleEditablePaste(event) {
    event.preventDefault();
    const text = event.clipboardData ? event.clipboardData.getData("text/plain") : "";
    insertPlainText(text);
  }

  function handleEditableKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (document.queryCommandSupported && document.queryCommandSupported("insertLineBreak")) {
      document.execCommand("insertLineBreak");
      return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createElement("br"));
    selection.collapseToEnd();
  }

  function editKey(kind, id) {
    return `${kind}:${id}`;
  }

  function editedHtml(key, fallbackHtml) {
    if (!hasOwn(state.previewEdits, key)) return fallbackHtml;
    return sanitizeEditableHtml(state.previewEdits[key]);
  }

  function bindEditableHtml(element, key) {
    element.contentEditable = state.previewEditing ? "true" : "false";
    element.spellcheck = true;
    element.dataset.editKey = key;
    if (hasOwn(state.previewEdits, key)) element.classList.add("manual-edit");
    if (!state.previewEditing) return;
    element.addEventListener("paste", handleEditablePaste);
    element.addEventListener("keydown", handleEditableKeydown);
    element.addEventListener("input", () => {
      state.previewEdits[key] = element.innerHTML;
      element.classList.add("manual-edit");
    });
    element.addEventListener("blur", () => {
      state.previewEdits[key] = sanitizeEditableHtml(element.innerHTML);
      element.innerHTML = state.previewEdits[key];
    });
  }

  function displaySectionTitle(section) {
    return hasOwn(state.sectionTitleEdits, section.id) ? state.sectionTitleEdits[section.id] : sectionTitle(section);
  }

  function bindEditableTitle(element, section) {
    element.contentEditable = state.previewEditing ? "true" : "false";
    element.spellcheck = true;
    if (hasOwn(state.sectionTitleEdits, section.id)) element.classList.add("manual-edit");
    if (!state.previewEditing) return;
    element.addEventListener("paste", handleEditablePaste);
    element.addEventListener("keydown", handleEditableKeydown);
    element.addEventListener("input", () => {
      state.sectionTitleEdits[section.id] = element.textContent.replace(/\s+/g, " ").trim();
      element.classList.add("manual-edit");
    });
  }

  function tableDataFor(tableBlock) {
    if (!state.tableData[tableBlock.id]) {
      state.tableData[tableBlock.id] = tableBlock.rows.map((row) => [...row]);
    }
    return state.tableData[tableBlock.id];
  }

  function updateEditButton() {
    editPreviewButton.textContent = state.previewEditing ? "Concluir edição" : "Editar resultado";
    editPreviewButton.setAttribute("aria-pressed", String(state.previewEditing));
    previewRoot.classList.toggle("preview-editing", state.previewEditing);
  }

  function templateToDisplayText(template) {
    return String(template).replace(/\{\{([^}]+)\}\}/g, (match, rawId) => {
      const id = rawId.trim();
      const field = findField(id);
      if (field) return fieldDocumentLabel(field, `[${id}]`);
      const choice = findChoice(id);
      if (choice) return `[${choice.label}]`;
      return `[${id}]`;
    });
  }

  function optionOutputBlocks(option) {
    if (Array.isArray(option.outputBlocks) && option.outputBlocks.length) {
      return option.outputBlocks;
    }
    return (option.output || []).map((text, index) => ({
      id: `${option.value}_fallback_${index}`,
      type: "paragraph",
      role: "fixed_candidate",
      text,
      docNumber: ""
    }));
  }

  function optionOutputTexts(option) {
    return optionOutputBlocks(option).map((outputBlock) => String(outputBlock.text || ""));
  }

  function sectionTitle(section) {
    const title = String(section.title || "");
    const docNumber = String(section.docNumber || "").trim();
    if (!docNumber || title.startsWith(docNumber)) return title;
    return `${docNumber} ${title}`;
  }

  function appendPreviewParagraph(target, block, extraClass, keyOverride) {
    const key = keyOverride || editKey("block", block.id);
    const p = document.createElement("p");
    p.className = blockClassName(block, extraClass);
    if (block.docNumber) {
      const idx = document.createElement("span");
      idx.className = "p-index";
      idx.textContent = `${block.docNumber} `;
      p.appendChild(idx);
    }
    const textSpan = document.createElement("span");
    textSpan.className = "editable-content";
    textSpan.innerHTML = editedHtml(key, renderTemplate(block.text));
    bindEditableHtml(textSpan, key);
    p.appendChild(textSpan);
    target.appendChild(p);
    return p;
  }

  function finalParagraphHtml(block, extraClass, keyOverride) {
    const key = keyOverride || editKey("block", block.id);
    const indexHtml = block.docNumber ? `<span class="p-index">${escapeHtml(block.docNumber)} </span>` : "";
    const bodyHtml = editedHtml(key, cleanTemplate(block.text));
    return `<p${classAttribute(blockClassName(block, extraClass))}>${indexHtml}${bodyHtml}</p>`;
  }

  function scrollToPreviewBlock(blockId) {
    const el = document.getElementById(`preview-${blockId}`);
    if (!el) return;
    const panel = document.querySelector(".panel.preview");
    if (!panel) return;
    const re = el.getBoundingClientRect();
    const rc = panel.getBoundingClientRect();
    panel.scrollTop += re.top - rc.top - rc.height / 2 + re.height / 2;
  }

  function scrollControlsToTarget(target, alignTo) {
    const controls = document.querySelector(".controls");
    if (!controls || !target) return false;
    const targetRect = target.getBoundingClientRect();
    if (alignTo) {
      const sourceRect = alignTo.getBoundingClientRect();
      controls.scrollTo({ top: controls.scrollTop + targetRect.top - sourceRect.top, behavior: "smooth" });
      return true;
    }
    const controlsRect = controls.getBoundingClientRect();
    controls.scrollTop += targetRect.top - controlsRect.top - controlsRect.height / 2 + targetRect.height / 2;
    return true;
  }

  function highlightFormTarget(target) {
    target.style.boxShadow = "0 0 0 2px var(--accent)";
    setTimeout(() => { target.style.boxShadow = ""; }, 1500);
  }

  function focusWithoutPreviewSync(input) {
    suppressPreviewFocusSync = true;
    try {
      input.focus({ preventScroll: true });
    } catch (err) {
      input.focus();
    }
    input.select();
    requestAnimationFrame(() => { suppressPreviewFocusSync = false; });
  }

  function toggleExcluded(id) {
    state.excluded[id] = !state.excluded[id];
    renderPreview();
    renderValidation();
    const group = document.querySelector(`[data-field-id="${id}"]`);
    if (group) group.classList.toggle("excluded", state.excluded[id]);
  }

  function makeFieldGroup(field, block) {
    const group = document.createElement("div");
    group.className = "field-group";
    group.dataset.fieldId = field.id;
    group.dataset.blockId = block.id;
    if (state.excluded[field.id]) group.classList.add("excluded");

    const label = document.createElement("label");
    label.className = "field-label";

    const labelText = document.createElement("span");
    labelText.textContent = field.label;
    label.appendChild(labelText);

    const toggle = document.createElement("button");
    toggle.className = "exclude-toggle";
    toggle.type = "button";
    toggle.textContent = state.excluded[field.id] ? "+" : "\u2212";
    toggle.title = state.excluded[field.id] ? "Incluir no TR" : "Excluir do TR";
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleExcluded(field.id);
      toggle.textContent = state.excluded[field.id] ? "+" : "\u2212";
      toggle.title = state.excluded[field.id] ? "Incluir no TR" : "Excluir do TR";
    });
    label.appendChild(toggle);

    group.appendChild(label);

    const inputId = `field-${field.id}`;
    const input = document.createElement("input");
    input.id = inputId;
    input.type = "text";
    input.placeholder = field.placeholder || "";
    input.value = state.fields[field.id] || "";
    function syncPreview() {
      if (!suppressPreviewFocusSync) scrollToPreviewBlock(block.id);
    }
    input.addEventListener("focus", syncPreview);
    input.addEventListener("input", (e) => {
      state.fields[field.id] = e.target.value.trim();
      renderPreview();
      renderValidation();
    });
    group.appendChild(input);

    const noteRow = document.createElement("div");
    noteRow.className = "field-note-row";
    (block.noteIds || []).forEach((nid) => noteRow.appendChild(noteButton(nid)));
    if (noteRow.children.length) group.appendChild(noteRow);

    return group;
  }

  function makeChoiceGroup(choice, block) {
    const group = document.createElement("fieldset");
    group.className = "choice-group";
    group.dataset.fieldId = choice.id;
    group.dataset.blockId = block.id;
    if (state.excluded[choice.id]) group.classList.add("excluded");

    const legend = document.createElement("legend");
    legend.className = "field-label";

    const labelText = document.createElement("span");
    labelText.textContent = choice.label;
    legend.appendChild(labelText);

    const toggle = document.createElement("button");
    toggle.className = "exclude-toggle";
    toggle.type = "button";
    toggle.textContent = state.excluded[choice.id] ? "+" : "\u2212";
    toggle.title = state.excluded[choice.id] ? "Incluir no TR" : "Excluir do TR";
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleExcluded(choice.id);
      toggle.textContent = state.excluded[choice.id] ? "+" : "\u2212";
      toggle.title = state.excluded[choice.id] ? "Incluir no TR" : "Excluir do TR";
    });
    legend.appendChild(toggle);

    group.appendChild(legend);

    function syncPreview() {
      if (!suppressPreviewFocusSync) scrollToPreviewBlock(block.id);
    }

    choice.options.forEach((option) => {
      const optionId = `choice-${choice.id}-${option.value}`;
      const wrapper = document.createElement("label");
      wrapper.className = "choice-option";
      const radio = document.createElement("input");
      radio.id = optionId;
      radio.type = "radio";
      radio.name = choice.id;
      radio.value = option.value;
      if (state.choices[choice.id] === option.value) radio.checked = true;
      radio.addEventListener("focus", syncPreview);
      radio.addEventListener("change", () => {
        state.choices[choice.id] = option.value;
        renderPreview();
        renderValidation();
      });
      wrapper.appendChild(radio);
      const content = document.createElement("span");
      content.className = "choice-option-content";
      const label = document.createElement("span");
      label.className = "choice-option-label";
      label.textContent = option.label;
      content.appendChild(label);

      const outputBlocks = optionOutputBlocks(option);
      if (outputBlocks.length) {
        const details = document.createElement("details");
        details.className = "choice-output-preview";
        if (outputBlocks.length <= 8) details.open = true;
        const summary = document.createElement("summary");
        summary.textContent = "Redacao desta opcao";
        details.appendChild(summary);
        outputBlocks.forEach((outputBlock) => {
          const line = document.createElement("p");
          line.className = blockClassName(outputBlock, "choice-output-line");
          line.textContent = `${outputBlock.docNumber ? `${outputBlock.docNumber} ` : ""}${templateToDisplayText(outputBlock.text || "")}`;
          details.appendChild(line);
        });
        content.appendChild(details);
      }

      wrapper.appendChild(content);
      group.appendChild(wrapper);
    });

    const noteRow = document.createElement("div");
    noteRow.className = "field-note-row";
    (choice.noteIds || []).concat(block.noteIds || []).forEach((nid) => noteRow.appendChild(noteButton(nid)));
    if (noteRow.children.length) group.appendChild(noteRow);

    return group;
  }

  function makeTableEditor(tableBlock) {
    const container = document.createElement("div");
    container.className = "table-editor";
    container.dataset.blockId = tableBlock.id;
    if (state.excluded[tableBlock.id]) container.classList.add("excluded");
    const data = state.tableData[tableBlock.id] || tableBlock.rows.map((r) => [...r]);

    const labelRow = document.createElement("div");
    labelRow.className = "field-label-row";

    const label = document.createElement("span");
    label.className = "table-label";
    label.textContent = `Tabela (${data.length} linhas)`;
    labelRow.appendChild(label);

    const toggle = document.createElement("button");
    toggle.className = "exclude-toggle";
    toggle.type = "button";
    toggle.textContent = state.excluded[tableBlock.id] ? "+" : "\u2212";
    toggle.title = state.excluded[tableBlock.id] ? "Incluir no TR" : "Excluir do TR";
    toggle.addEventListener("click", () => {
      state.excluded[tableBlock.id] = !state.excluded[tableBlock.id];
      container.classList.toggle("excluded", state.excluded[tableBlock.id]);
      toggle.textContent = state.excluded[tableBlock.id] ? "+" : "\u2212";
      toggle.title = state.excluded[tableBlock.id] ? "Incluir no TR" : "Excluir do TR";
      renderPreview();
    });
    labelRow.appendChild(toggle);
    container.appendChild(labelRow);

    const miniTable = document.createElement("table");
    miniTable.className = "mini-table";

    function renderMiniTable() {
      miniTable.innerHTML = "";
      data.forEach((row, ri) => {
        const tr = document.createElement("tr");
        row.forEach((cell, ci) => {
          const cellEl = document.createElement(ri === 0 ? "th" : "td");
          if (ri === 0) {
            cellEl.textContent = cell || "";
          } else {
            const inp = document.createElement("input");
            inp.className = "table-cell-input";
            inp.value = cell || "";
            inp.placeholder = "...";
            inp.addEventListener("input", () => {
              data[ri][ci] = inp.value;
              state.tableData[tableBlock.id] = data;
              renderPreview();
            });
            cellEl.appendChild(inp);
          }
          tr.appendChild(cellEl);
        });
        miniTable.appendChild(tr);
      });
    }

    renderMiniTable();
    container.appendChild(miniTable);

    const addRowBtn = document.createElement("button");
    addRowBtn.className = "secondary table-add-row";
    addRowBtn.type = "button";
    addRowBtn.textContent = "+ linha";
    addRowBtn.addEventListener("click", () => {
      const cols = Math.max(1, ...data.map((row) => (row || []).length));
      data.push(new Array(cols).fill(""));
      state.tableData[tableBlock.id] = data;
      label.textContent = `Tabela (${data.length} linhas)`;
      renderMiniTable();
      renderPreview();
    });
    container.appendChild(addRowBtn);

    return container;
  }

  function renderForm() {
    modelMeta.textContent = `${model.metadata.title} | ${model.metadata.versionLabel} | ${model.metadata.sourceType}`;
    formRoot.innerHTML = "";

    const renderedFields = new Set();
    const renderedChoices = new Set();

    model.sections.forEach((section) => {
      const card = document.createElement("section");
      card.className = "section-card";
      card.dataset.sectionId = section.id;

      const header = document.createElement("div");
      header.className = "section-header";
      header.innerHTML = `<h3>${escapeHtml(sectionTitle(section))}</h3>`;
      card.appendChild(header);

      const body = document.createElement("div");
      body.className = "section-body";
      let hasContent = false;

      section.blocks.forEach((block) => {
        if (block.type === "paragraph") {
          const refs = [...block.text.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1].trim());
          refs.forEach((refId) => {
            const field = findField(refId);
            if (field && !renderedFields.has(field.id)) {
              renderedFields.add(field.id);
              hasContent = true;
              body.appendChild(makeFieldGroup(field, block));
              return;
            }
            const choice = findChoice(refId);
            if (choice && !renderedChoices.has(choice.id)) {
              renderedChoices.add(choice.id);
              hasContent = true;
              body.appendChild(makeChoiceGroup(choice, block));
            }
          });
        }

        if (block.type === "choice") {
          if (renderedChoices.has(block.choiceId)) return;
          renderedChoices.add(block.choiceId);
          hasContent = true;
          const choice = findChoice(block.choiceId);
          if (!choice) return;
          body.appendChild(makeChoiceGroup(choice, block));
          choice.options.forEach((option) => {
            optionOutputTexts(option).forEach((text) => {
              const refs = [...text.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1].trim());
              refs.forEach((refId) => {
                const field = findField(refId);
                if (field && !renderedFields.has(field.id)) {
                  renderedFields.add(field.id);
                  hasContent = true;
                  body.appendChild(makeFieldGroup(field, block));
                }
              });
            });
          });
        }

        if (block.type === "table") {
          hasContent = true;
          body.appendChild(makeTableEditor(block));
        }
      });

      if (hasContent) {
        card.appendChild(body);
        formRoot.appendChild(card);
      }
    });
  }

  function renderPreview(focusBlockId) {
    previewRoot.innerHTML = "";
    updateEditButton();
    appendDocumentChrome(previewRoot);

    model.sections.forEach((section) => {
      const heading = document.createElement("h2");
      heading.textContent = displaySectionTitle(section);
      bindEditableTitle(heading, section);
      previewRoot.appendChild(heading);

      (section.blocks || []).forEach((block) => {
        const wrapper = document.createElement("div");
        wrapper.id = `preview-${block.id}`;
        wrapper.dataset.previewBlockId = block.id;
        wrapper.dataset.sectionId = section.id;

        if (block.type === "paragraph") {
          if (state.excluded[block.id]) return;
          appendPreviewParagraph(wrapper, block);
          (block.noteIds || []).forEach((nid) => wrapper.appendChild(noteButton(nid)));
        }

        if (block.type === "table") {
          if (state.excluded[block.id]) return;
          const data = tableDataFor(block);
          const table = document.createElement("table");
          table.className = "preview-table";
          data.forEach((row, ri) => {
            const tr = document.createElement("tr");
            (row || []).forEach((cellText, ci) => {
              const cell = document.createElement(ri === 0 ? "th" : "td");
              cell.textContent = cellText || "";
              cell.contentEditable = state.previewEditing ? "true" : "false";
              cell.spellcheck = true;
              if (state.previewEditing) {
                cell.addEventListener("paste", handleEditablePaste);
                cell.addEventListener("keydown", handleEditableKeydown);
                cell.addEventListener("input", () => {
                  data[ri][ci] = cell.textContent;
                  state.tableData[block.id] = data;
                  cell.classList.add("manual-edit");
                });
              }
              tr.appendChild(cell);
            });
            table.appendChild(tr);
          });
          wrapper.appendChild(table);
        }

        if (block.type === "choice") {
          const choice = findChoice(block.choiceId);
          const selected = choice.options.find((option) => option.value === state.choices[choice.id]);
          if (!selected) {
            const warning = document.createElement("p");
            warning.className = "unresolved";
            warning.textContent = block.unresolvedWarning;
            wrapper.appendChild(warning);
          } else {
            optionOutputBlocks(selected).forEach((outputBlock) => {
              appendPreviewParagraph(wrapper, outputBlock, "conditional-output", editKey("choice", `${choice.id}:${outputBlock.id}`));
            });
          }
        }

        previewRoot.appendChild(wrapper);
      });
    });

    const footer = document.createElement("div");
    footer.innerHTML = documentFooterHtml();
    previewRoot.appendChild(footer.firstChild);

    if (focusBlockId) scrollToPreviewBlock(focusBlockId);
  }

  function focusFormField(fieldId, alignTo) {
    const el = formRoot.querySelector(`[data-field-id="${fieldId}"]`);
    if (!el) return;
    scrollControlsToTarget(el, alignTo);
    const input = el.querySelector("input");
    if (input) focusWithoutPreviewSync(input);
    highlightFormTarget(el);
  }

  function findFormSectionForPreviewBlock(previewBlock) {
    const blockId = previewBlock.dataset.previewBlockId;
    const blockTarget = formRoot.querySelector(`[data-block-id="${blockId}"]`);
    if (blockTarget) return blockTarget.closest(".section-card") || blockTarget;
    return formRoot.querySelector(`.section-card[data-section-id="${previewBlock.dataset.sectionId}"]`);
  }

  function alignFormSectionToPreview(previewBlock, alignTo) {
    const target = findFormSectionForPreviewBlock(previewBlock);
    if (!target) return;
    scrollControlsToTarget(target, alignTo || previewBlock);
    highlightFormTarget(target);
  }

  function showNote(noteId) {
    const note = findNote(noteId);
    if (!note) return;
    noteBody.innerHTML = "";
    note.body.forEach((paragraph) => {
      const item = document.createElement("p");
      item.textContent = paragraph;
      noteBody.appendChild(item);
    });
    if (typeof noteDialog.showModal === "function") {
      noteDialog.showModal();
    } else {
      alert(note.body.join("\n\n"));
    }
  }

  function cleanTemplate(template) {
    return templateToHtml(template, (id) => {
      if (state.excluded[id]) return "";

      const choice = findChoice(id);
      if (choice) {
        const selected = choice.options.find((option) => option.value === state.choices[id]);
        const label = escapeHtml(selected ? selected.label : `[${choice.label}]`);
        return selected ? `<span class="conditional-output">${label}</span>` : label;
      }
      const value = state.fields[id];
      const field = findField(id);
      return escapeHtml(value || fieldDocumentLabel(field, `[${id}]`));
    });
  }

  function finalDocumentBody() {
    const parts = [];
    parts.push(`<main class="print-document">`);
    parts.push(documentHeaderHtml());
    model.sections.forEach((section) => {
      parts.push(`<h2>${escapeHtml(displaySectionTitle(section))}</h2>`);
      (section.blocks || []).forEach((block) => {
        if (block.type === "paragraph") {
          parts.push(finalParagraphHtml(block));
        }
        if (block.type === "table") {
          if (state.excluded[block.id]) return;
          const data = state.tableData[block.id] || block.rows;
          parts.push(`<table>`);
          data.forEach((row, ri) => {
            parts.push(`<tr>`);
            (row || []).forEach((cell) => {
              const tag = ri === 0 ? "th" : "td";
              parts.push(`<${tag}>${escapeHtml(cell || "")}</${tag}>`);
            });
            parts.push(`</tr>`);
          });
          parts.push(`</table>`);
        }
        if (block.type === "choice") {
          const choice = findChoice(block.choiceId);
          const selected = choice.options.find((option) => option.value === state.choices[choice.id]);
          if (selected) {
            optionOutputBlocks(selected).forEach((outputBlock) => {
              parts.push(finalParagraphHtml(outputBlock, "conditional-output", editKey("choice", `${choice.id}:${outputBlock.id}`)));
            });
          }
        }
      });
    });
    parts.push(documentFooterHtml());
    parts.push(`</main>`);
    return parts.join("\n");
  }

  function generateFinalHtml() {
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(model.metadata.title)}</title>
  <style>
    @page { size: A4; margin: 1.35cm 1.45cm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f2f2f2; color: #111; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.28; }
    .print-document { max-width: 19cm; min-height: 27.7cm; margin: 0 auto; padding: 1.25cm 1.45cm 1cm; background: #fff; }
    .document-header { align-items: center; border-bottom: 2px solid #1f1f1f; display: flex; gap: 0.9rem; justify-content: center; margin-bottom: 0.45rem; padding-bottom: 0.55rem; text-align: center; text-transform: uppercase; }
    .document-seal { align-items: center; border: 1px solid #333; border-radius: 50%; display: inline-flex; flex: 0 0 2.45rem; font-size: 0.7rem; font-weight: 700; height: 2.45rem; justify-content: center; width: 2.45rem; }
    .document-heading-text { display: grid; gap: 0.08rem; }
    .document-heading-text strong { font-size: 10pt; }
    .document-heading-text span, .document-heading-text small, .document-model-title, .document-footer { font-size: 7.5pt; }
    .document-annex { background: #e6e6e6; border: 1px solid #222; font-size: 7.5pt; font-weight: 700; margin: 0.4rem 0 0.6rem; padding: 0.1rem 0.25rem; text-align: center; text-transform: uppercase; }
    h1 { font-size: 10.5pt; margin: 0.55rem 0 0.35rem; text-align: center; text-transform: uppercase; }
    .document-model-title { margin: 0 0 0.55rem; text-align: center; text-transform: uppercase; }
    h2 { background: #e6e6e6; border: 1px solid #222; font-size: 8.5pt; margin: 0.65rem 0 0.35rem; padding: 0.12rem 0.25rem; text-transform: uppercase; }
    p { margin: 0.32em 0; text-align: justify; }
    .p-index { font-weight: 700; margin-right: 0.2rem; }
    table { border-collapse: collapse; margin: 0.45rem 0; width: 100%; }
    th, td { border: 1px solid #333; font-size: 8pt; padding: 0.18rem 0.28rem; vertical-align: top; }
    th { background: #ededed; font-weight: 700; }
    mark, .conditional-output, .variable-output { background: #ffd6d6; color: #990000; font-style: italic; padding: 0 0.15rem; }
    .semantic-review { color: #111; }
    .document-footer { border-top: 1px solid #333; margin-top: 0.9rem; padding-top: 0.28rem; text-align: center; }
    @media print { body { background: #fff; } .print-document { max-width: none; min-height: 0; padding: 0; } }
  </style>
</head>
<body>
${finalDocumentBody()}
</body>
</html>`;
    return { ok: true, html };
  }

  function downloadPrintableHtml() {
    const result = generateFinalHtml();
    const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "termo-referencia.html";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  }

  document.getElementById("validate-button").addEventListener("click", renderValidation);
  editPreviewButton.addEventListener("click", () => {
    state.previewEditing = !state.previewEditing;
    renderPreview();
  });
  exportButton.addEventListener("click", downloadPrintableHtml);

  window.TR_APP = { validationMessages, generateFinalHtml };

  renderForm();
  renderPreview();
  renderValidation();

  previewRoot.addEventListener("click", (e) => {
    if (e.target.closest("[contenteditable='true']")) return;
    const fieldEl = e.target.closest("[data-field-id]");
    const sourceEl = e.target.closest("p, table") || e.target;
    if (fieldEl) {
      e.stopPropagation();
      focusFormField(fieldEl.dataset.fieldId, sourceEl);
      return;
    }

    const previewBlock = e.target.closest("[data-preview-block-id]");
    if (previewBlock) {
      e.stopPropagation();
      alignFormSectionToPreview(previewBlock, sourceEl);
    }
  });
}());
