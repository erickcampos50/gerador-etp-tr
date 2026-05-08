#!/usr/bin/env python3
"""Regression checks for the generated browser model."""

from __future__ import annotations

import json
from pathlib import Path


MODEL_JS = Path("app/model-data.js")


def load_model() -> dict:
    raw = MODEL_JS.read_text(encoding="utf-8")
    prefix = "window.TR_MODEL = "
    start = raw.index(prefix) + len(prefix)
    payload = raw[start:].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def main() -> int:
    model = load_model()

    pca_choice = None
    pca_option = None
    for choice in model["choices"]:
        for option in choice["options"]:
            if any("ID PCA no PNCP" in text for text in option.get("output", [])):
                pca_choice = choice
                pca_option = option
                break
        if pca_choice:
            break

    assert pca_choice is not None, "choice containing ID PCA no PNCP was not generated"
    assert pca_option is not None, "PCA option was not generated"

    output_blocks = pca_option.get("outputBlocks", [])
    assert output_blocks, "PCA option does not preserve outputBlocks"

    expected = [
        ("I)", "ID PCA no PNCP: {{field_campo_30_1}};"),
        ("II)", "Data de publicação no PNCP: {{field_campo_31_1}};"),
        ("III)", "Id do item no PCA: {{field_campo_32_1}};"),
        ("IV)", "Classe/Grupo: {{field_campo_33_1}};"),
        ("V)", "Identificador da Futura Contratação: {{field_campo_34_1}};"),
    ]
    actual = [(block.get("docNumber"), block.get("text")) for block in output_blocks if "PCA" in block.get("text", "") or "PNCP" in block.get("text", "") or "Classe/Grupo" in block.get("text", "") or "Identificador" in block.get("text", "")]
    assert actual[:5] == expected, f"PCA output blocks changed: {actual[:5]!r}"

    description_section = next(
        section
        for section in model["sections"]
        if "DESCRIÇÃO DA SOLUÇÃO" in section["title"]
    )
    assert description_section.get("docNumber") == "3.", "section 3 heading number was not preserved"
    description_block = next(
        block
        for block in description_section["blocks"]
        if block.get("sourceIndex") == 38
    )
    assert description_block.get("docNumber") == "3.1.", "paragraph 3.1 number was not preserved"

    requirements_section = next(
        section
        for section in model["sections"]
        if "REQUISITOS DA CONTRATAÇÃO" in section["title"]
    )
    assert requirements_section.get("docNumber") == "4.", "section 4 heading number was not preserved"
    expected_requirements = {
        40: ("", "Sustentabilidade"),
        41: ("4.1.", "Além dos critérios de sustentabilidade"),
        42: ("4.1.1", "{{field_campo_42_1}};"),
        43: ("4.1.2", "{{field_campo_43_1}}; e"),
        44: ("4.1.3", "{{field_campo_44_1}}."),
    }
    fixed_blocks = {
        block.get("sourceIndex"): block
        for block in requirements_section["blocks"]
        if block.get("type") == "paragraph"
    }
    for source_index, (doc_number, text_start) in expected_requirements.items():
        block = fixed_blocks.get(source_index)
        assert block is not None, f"paragraph {source_index} should be fixed in section 4, not hidden inside an OU choice"
        assert block.get("docNumber") == doc_number, f"paragraph {source_index} number changed"
        assert str(block.get("text", "")).startswith(text_start), f"paragraph {source_index} text changed"

    assert any(
        block.get("runs")
        for section in model["sections"]
        for block in section.get("blocks", [])
        if block.get("type") == "paragraph"
    ), "paragraph run evidence is missing from generated blocks"

    print("model validation ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
