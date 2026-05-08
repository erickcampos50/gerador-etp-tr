(function () {
  "use strict";

  const model = window.TR_MODEL;
  const state = {
    fields: {},
    choices: {},
    excluded: {},
    tableData: {}
  };
  let suppressPreviewFocusSync = false;

  const formRoot = document.getElementById("form-root");
  const previewRoot = document.getElementById("preview-root");
  const validationList = document.getElementById("validation-list");
  const modelMeta = document.getElementById("model-meta");
  const exportButton = document.getElementById("export-button");
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
      return `<span class="unresolved" data-field-id="${escapeHtml(id)}">${escapeHtml(field ? field.label : id)}</span>`;
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
      const span = document.createElement("span");
      span.textContent = option.label;
      wrapper.appendChild(span);
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
      header.innerHTML = `<h3>${escapeHtml(section.title)}</h3>`;
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
            (option.output || []).forEach((text) => {
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
    const title = document.createElement("h1");
    title.textContent = model.metadata.title;
    previewRoot.appendChild(title);

    model.sections.forEach((section) => {
      const heading = document.createElement("h2");
      heading.textContent = section.title;
      previewRoot.appendChild(heading);

      (section.blocks || []).forEach((block) => {
        const wrapper = document.createElement("div");
        wrapper.id = `preview-${block.id}`;
        wrapper.dataset.previewBlockId = block.id;
        wrapper.dataset.sectionId = section.id;

        if (block.type === "paragraph") {
          if (state.excluded[block.id]) return;
          const p = document.createElement("p");
          if (block.docNumber) {
            const idx = document.createElement("span");
            idx.className = "p-index";
            idx.textContent = block.docNumber + " ";
            p.appendChild(idx);
          }
          const textSpan = document.createElement("span");
          textSpan.innerHTML = renderTemplate(block.text);
          p.appendChild(textSpan);
          wrapper.appendChild(p);
          (block.noteIds || []).forEach((nid) => wrapper.appendChild(noteButton(nid)));
        }

        if (block.type === "table") {
          if (state.excluded[block.id]) return;
          const data = state.tableData[block.id] || block.rows;
          const table = document.createElement("table");
          table.className = "preview-table";
          data.forEach((row, ri) => {
            const tr = document.createElement("tr");
            (row || []).forEach((cellText) => {
              const cell = document.createElement(ri === 0 ? "th" : "td");
              cell.textContent = cellText || "";
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
            selected.output.forEach((text) => {
              const p = document.createElement("p");
              p.className = "conditional-output";
              p.innerHTML = renderTemplate(text);
              wrapper.appendChild(p);
            });
          }
        }

        previewRoot.appendChild(wrapper);
      });
    });

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
      return escapeHtml(value || `[${field ? field.label : id}]`);
    });
  }

  function finalDocumentBody() {
    const parts = [];
    parts.push(`<h1>${escapeHtml(model.metadata.title)}</h1>`);
    model.sections.forEach((section) => {
      parts.push(`<h2>${escapeHtml(section.title)}</h2>`);
      (section.blocks || []).forEach((block) => {
        if (block.type === "paragraph") {
          parts.push(`<p>${cleanTemplate(block.text)}</p>`);
        }
        if (block.type === "table") {
          if (state.excluded[block.id]) return;
          const data = state.tableData[block.id] || block.rows;
          parts.push(`<table style="border-collapse:collapse;width:100%;margin:1em 0;border:1px solid #888;">`);
          data.forEach((row, ri) => {
            parts.push(`<tr>`);
            (row || []).forEach((cell) => {
              const tag = ri === 0 ? "th" : "td";
              const bg = ri === 0 ? "background:#eef3f7;" : "";
              parts.push(`<${tag} style="border:1px solid #bbb;padding:5px 8px;${bg}vertical-align:top;">${escapeHtml(cell || "")}</${tag}>`);
            });
            parts.push(`</tr>`);
          });
          parts.push(`</table>`);
        }
        if (block.type === "choice") {
          const choice = findChoice(block.choiceId);
          const selected = choice.options.find((option) => option.value === state.choices[choice.id]);
          if (selected) {
            selected.output.forEach((text) => parts.push(`<p class="conditional-output">${cleanTemplate(text)}</p>`));
          }
        }
      });
    });
    const notePolicy = model.metadata.notesSuppressedInFinal ? "conteudo de apoio suprimido da versao final" : "politica de apoio nao definida";
    parts.push(`<footer>Modelo utilizado: ${escapeHtml(model.metadata.sourceName)} (${escapeHtml(model.metadata.versionLabel)}) - ${escapeHtml(notePolicy)}</footer>`);
    return parts.join("\n");
  }

  function generateFinalHtml() {
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(model.metadata.title)}</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; margin: 2.5cm 3cm; color: #111; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; margin-bottom: 1.5em; }
    h2 { font-size: 12pt; margin-top: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase; }
    p { margin: 0.4em 0; text-align: justify; }
    .conditional-output { background: #ffd6d6; color: #990000; font-style: italic; padding: 0 0.15rem; }
    footer { border-top: 1px solid #999; margin-top: 2rem; padding-top: 0.5rem; font-size: 9pt; color: #555; }
    @media print { body { margin: 1.5cm; } }
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
  exportButton.addEventListener("click", downloadPrintableHtml);

  window.TR_APP = { validationMessages, generateFinalHtml };

  renderForm();
  renderPreview();
  renderValidation();

  previewRoot.addEventListener("click", (e) => {
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
