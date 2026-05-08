(function () {
  "use strict";

  const model = window.TR_MODEL;
  const state = {
    fields: {},
    choices: {}
  };

  const formRoot = document.getElementById("form-root");
  const previewRoot = document.getElementById("preview-root");
  const validationList = document.getElementById("validation-list");
  const modelMeta = document.getElementById("model-meta");
  const exportButton = document.getElementById("export-button");
  const noteDialog = document.getElementById("note-dialog");
  const noteTitle = document.getElementById("note-title");
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

  function renderTemplate(template) {
    return templateToHtml(template, (id) => {
      if (id === "ente_tipo") {
        const choice = findChoice("ente_tipo");
        const selected = choice.options.find((option) => option.value === state.choices.ente_tipo);
        return selected ? `<mark>${escapeHtml(selected.label)}</mark>` : `<span class="unresolved">${escapeHtml(choice.label)}</span>`;
      }

      const value = state.fields[id];
      if (value) {
        return `<mark>${escapeHtml(value)}</mark>`;
      }
      const field = findField(id);
      return `<span class="unresolved">${escapeHtml(field ? field.label : id)}</span>`;
    });
  }

  function validationMessages() {
    const messages = [];
    model.fields.forEach((field) => {
      if (field.required && !state.fields[field.id]) {
        messages.push({ type: "error", text: `Campo obrigatorio pendente: ${field.label}` });
      }
    });
    model.choices.forEach((choice) => {
      if (choice.required && !state.choices[choice.id]) {
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
    exportButton.disabled = messages.some((message) => message.type === "error");
  }

  function noteButton(noteId) {
    const button = document.createElement("button");
    button.className = "note-button";
    button.type = "button";
    button.textContent = "Nota explicativa";
    button.addEventListener("click", () => showNote(noteId));
    return button;
  }

  function renderForm() {
    modelMeta.textContent = `${model.metadata.title} | ${model.metadata.versionLabel} | ${model.metadata.sourceType}`;
    formRoot.innerHTML = "";

    const globalCard = document.createElement("section");
    globalCard.className = "section-card";
    globalCard.innerHTML = "<h3>Dados e escolhas globais</h3>";

    model.fields.forEach((field) => {
      const group = document.createElement("div");
      group.className = "field-group";
      const inputId = `field-${field.id}`;
      group.innerHTML = `
        <label for="${inputId}">${escapeHtml(field.label)}</label>
        <input id="${inputId}" type="text" placeholder="${escapeHtml(field.placeholder || "")}" value="${escapeHtml(state.fields[field.id] || "")}">
      `;
      group.querySelector("input").addEventListener("input", (event) => {
        state.fields[field.id] = event.target.value.trim();
        renderPreview();
        renderValidation();
      });
      globalCard.appendChild(group);
    });

    model.choices.forEach((choice) => {
      const group = document.createElement("fieldset");
      group.className = "choice-group";
      const legend = document.createElement("legend");
      legend.textContent = choice.label;
      group.appendChild(legend);
      choice.options.forEach((option) => {
        const optionId = `choice-${choice.id}-${option.value}`;
        const wrapper = document.createElement("label");
        wrapper.className = "choice-option";
        wrapper.innerHTML = `
          <input id="${optionId}" type="radio" name="${choice.id}" value="${escapeHtml(option.value)}" ${state.choices[choice.id] === option.value ? "checked" : ""}>
          <span>${escapeHtml(option.label)}</span>
        `;
        wrapper.querySelector("input").addEventListener("change", () => {
          state.choices[choice.id] = option.value;
          renderPreview(choice.id);
          renderValidation();
        });
        group.appendChild(wrapper);
      });
      (choice.noteIds || []).forEach((noteId) => group.appendChild(noteButton(noteId)));
      globalCard.appendChild(group);
    });

    formRoot.appendChild(globalCard);
  }

  function renderPreview(focusChoiceId) {
    previewRoot.innerHTML = "";
    const title = document.createElement("h1");
    title.textContent = model.metadata.title;
    previewRoot.appendChild(title);

    model.sections.forEach((section) => {
      const heading = document.createElement("h2");
      heading.textContent = section.title;
      previewRoot.appendChild(heading);

      (section.blocks || []).forEach((block) => {
        if (block.type === "paragraph") {
          const paragraph = document.createElement("p");
          paragraph.innerHTML = renderTemplate(block.text);
          previewRoot.appendChild(paragraph);
        }
        if (block.type === "choice") {
          const choice = findChoice(block.choiceId);
          const selected = choice.options.find((option) => option.value === state.choices[choice.id]);
          if (!selected) {
            const warning = document.createElement("p");
            warning.className = "unresolved";
            warning.textContent = block.unresolvedWarning;
            previewRoot.appendChild(warning);
          } else {
            selected.output.forEach((text) => {
              const paragraph = document.createElement("p");
              paragraph.innerHTML = renderTemplate(text);
              previewRoot.appendChild(paragraph);
            });
          }
        }
      });
    });

    if (focusChoiceId) {
      previewRoot.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showNote(noteId) {
    const note = findNote(noteId);
    if (!note) {
      return;
    }
    noteTitle.textContent = note.title;
    noteBody.innerHTML = "";
    note.body.forEach((paragraph) => {
      const item = document.createElement("p");
      item.textContent = paragraph;
      noteBody.appendChild(item);
    });
    if (typeof noteDialog.showModal === "function") {
      noteDialog.showModal();
    } else {
      alert(`${note.title}\n\n${note.body.join("\n\n")}`);
    }
  }

  function cleanTemplate(template) {
    return templateToHtml(template, (id) => {
      if (id === "ente_tipo") {
        const choice = findChoice("ente_tipo");
        const selected = choice.options.find((option) => option.value === state.choices.ente_tipo);
        return escapeHtml(selected ? selected.label : `[${choice.label}]`);
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
        if (block.type === "choice") {
          const choice = findChoice(block.choiceId);
          const selected = choice.options.find((option) => option.value === state.choices[choice.id]);
          if (selected) {
            selected.output.forEach((text) => parts.push(`<p>${cleanTemplate(text)}</p>`));
          }
        }
      });
    });
    const notePolicy = model.metadata.notesSuppressedInFinal ? "conteudo de apoio suprimido da versao final" : "politica de apoio nao definida";
    parts.push(`<footer>Modelo utilizado: ${escapeHtml(model.metadata.sourceName)} (${escapeHtml(model.metadata.versionLabel)}) - ${escapeHtml(notePolicy)}</footer>`);
    return parts.join("\n");
  }

  function generateFinalHtml() {
    const errors = validationMessages().filter((message) => message.type === "error");
    if (errors.length) {
      return { ok: false, errors };
    }
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(model.metadata.title)}</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.45; margin: 2cm; color: #111; }
    h1 { font-size: 14pt; text-align: center; text-transform: uppercase; }
    h2 { font-size: 12pt; margin-top: 1.2rem; text-transform: uppercase; }
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
    if (!result.ok) {
      renderValidation();
      alert(`Resolva as pendencias antes de gerar o HTML:\n\n${result.errors.map((error) => error.text).join("\n")}`);
      return;
    }
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

  window.TR_APP = {
    validationMessages,
    generateFinalHtml
  };

  renderForm();
  renderPreview();
  renderValidation();
}());
