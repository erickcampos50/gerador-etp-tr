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
