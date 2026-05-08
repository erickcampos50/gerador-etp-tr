#!/usr/bin/env python3
"""Extract semantic signals from an AGU TR DOCX model.

The extractor is intentionally conservative: it preserves source evidence and
flags ambiguity instead of deciding legal meaning silently. It uses only the
Python standard library so it can run in this repository without a build step.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}

PLACEHOLDER_RE = re.compile(r"\[[^\]]{1,140}\]")
INLINE_OU_RE = re.compile(r"\[[^\]]{1,140}\](?:\s+OU\s+\[[^\]]{1,140}\])+")
FILLER_RE = re.compile(r"(?<![A-Za-z0-9])x{2,}(?:[./-]x{2,})*(?![A-Za-z0-9])|\.{4,}", re.IGNORECASE)


def qname(local: str) -> str:
    return f"{{{NS['w']}}}{local}"


def text_from_element(element: ET.Element) -> str:
    parts: list[str] = []
    for node in element.iter():
        if node.tag == qname("t"):
            parts.append(node.text or "")
        elif node.tag == qname("tab"):
            parts.append("\t")
        elif node.tag == qname("br"):
            parts.append("\n")
    return "".join(parts)


def run_style(run: ET.Element) -> dict[str, object]:
    props = run.find("w:rPr", NS)
    color = None
    italic = False
    bold = False
    if props is not None:
        color_el = props.find("w:color", NS)
        if color_el is not None:
            color = color_el.attrib.get(qname("val"))
        italic = props.find("w:i", NS) is not None
        bold = props.find("w:b", NS) is not None
    return {"color": color, "italic": italic, "bold": bold}


def load_comments(zf: zipfile.ZipFile) -> dict[str, str]:
    try:
        raw = zf.read("word/comments.xml")
    except KeyError:
        return {}
    root = ET.fromstring(raw)
    comments: dict[str, str] = {}
    for comment in root.findall("w:comment", NS):
        cid = comment.attrib.get(qname("id"))
        if cid is None:
            continue
        comments[cid] = normalize_space(text_from_element(comment))
    return comments


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str, fallback: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", ascii_value.lower()).strip("_")
    return slug or fallback


def clipped(value: str, limit: int = 96) -> str:
    value = normalize_space(value)
    return value if len(value) <= limit else value[: limit - 3].rstrip() + "..."


def classify_paragraph(text: str, runs: list[dict[str, object]], comment_ids: list[str]) -> dict[str, object]:
    placeholders = PLACEHOLDER_RE.findall(text)
    red_runs = [r for r in runs if str(r.get("color", "")).upper() == "FF0000"]
    red_italic_runs = [r for r in red_runs if r.get("italic")]
    italic_runs = [r for r in runs if r.get("italic")]
    stripped = normalize_space(text)
    is_ou_marker = stripped == "OU"
    has_ou = is_ou_marker or bool(re.search(r"(^|\s)OU(\s|$)", stripped))

    if red_italic_runs and len(red_italic_runs) == len([r for r in runs if r.get("text")]):
        role = "variable_red_italic"
    elif red_runs or red_italic_runs or placeholders or has_ou:
        role = "mixed_semantic"
    else:
        role = "fixed_candidate"

    ambiguity: list[str] = []
    if red_runs and len(red_italic_runs) != len(red_runs):
        ambiguity.append("red_text_not_all_italic")
    if has_ou and not is_ou_marker:
        ambiguity.append("inline_ou_requires_grouping_review")
    if comment_ids:
        ambiguity.append("comment_attachment_requires_review")

    return {
        "role": role,
        "placeholders": placeholders,
        "has_ou": has_ou,
        "is_ou_marker": is_ou_marker,
        "has_red": bool(red_runs),
        "has_red_italic": bool(red_italic_runs),
        "has_italic": bool(italic_runs),
        "comment_ids": comment_ids,
        "ambiguity_flags": ambiguity,
    }


def text_from_cell(cell: ET.Element) -> str:
    parts: list[str] = []
    for p in cell.iter(qname("p")):
        text = "".join(t.text or "" for t in p.iter(qname("t")))
        if text.strip():
            parts.append(normalize_space(text))
    return " ".join(parts)


def format_number(count: int, fmt: str) -> str:
    if fmt == "decimal":
        return str(count)
    if fmt == "lowerLetter":
        return chr(96 + count) if 1 <= count <= 26 else str(count)
    if fmt == "upperLetter":
        return chr(64 + count) if 1 <= count <= 26 else str(count)
    if fmt in ("lowerRoman", "upperRoman"):
        val_map = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"),
                   (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
        result = ""
        n = count
        for val, sym in val_map:
            while n >= val:
                result += sym
                n -= val
        if fmt == "lowerRoman":
            result = result.lower()
        return result if result else str(count)
    return str(count)


class NumberingTracker:
    def __init__(self) -> None:
        self.counters: dict[tuple[str, str], int] = {}

    def next_number(self, num_id: str, ilvl: str, numbering: dict, num_map: dict) -> str:
        an_id = num_map.get(num_id)
        if an_id is None:
            return ""
        levels = numbering.get(an_id, {})
        lvl_info = levels.get(ilvl, {})
        fmt = lvl_info.get("fmt", "decimal")
        if fmt in ("bullet", "none"):
            return ""

        # Reset all deeper levels
        for l in range(int(ilvl) + 1, 9):
            self.counters.pop((num_id, str(l)), None)

        # Increment this level
        key = (num_id, ilvl)
        self.counters[key] = self.counters.get(key, 0) + 1
        count = self.counters[key]

        # Also ensure parent levels have at least 1 (for formatting)
        for l in range(int(ilvl)):
            pk = (num_id, str(l))
            if pk not in self.counters:
                self.counters[pk] = 1

        # Format using template
        template = lvl_info.get("text", "%1.")
        for l in range(9):
            placeholder = f"%{l + 1}"
            ck = (num_id, str(l))
            val = format_number(self.counters.get(ck, 0), lvl_info.get("fmt", "decimal"))
            template = template.replace(placeholder, val)
        return template


def parse_document(docx_path: Path) -> dict[str, object]:
    with zipfile.ZipFile(docx_path) as zf:
        document_xml = zf.read("word/document.xml")
        comments = load_comments(zf)
        root = ET.fromstring(document_xml)
        try:
            num_xml = zf.read("word/numbering.xml")
            num_root = ET.fromstring(num_xml)
        except KeyError:
            num_root = None

    body = root.find(qname("body"))
    if body is None:
        body = root

    # Parse numbering definitions
    numbering: dict[str, dict[str, dict[str, str]]] = {}
    num_map: dict[str, str] = {}
    if num_root is not None:
        for an in num_root.findall(qname("abstractNum")):
            an_id = an.attrib.get(qname("abstractNumId"))
            if an_id is None:
                continue
            levels: dict[str, dict[str, str]] = {}
            for lvl in an.findall(qname("lvl")):
                ilvl = lvl.attrib.get(qname("ilvl"))
                if ilvl is None:
                    continue
                nf = lvl.find(qname("numFmt"))
                lt = lvl.find(qname("lvlText"))
                st = lvl.find(qname("start"))
                levels[ilvl] = {
                    "fmt": nf.attrib.get(qname("val")) if nf is not None else "",
                    "text": lt.attrib.get(qname("val")) if lt is not None else "%1.",
                    "start": st.attrib.get(qname("val")) if st is not None else "1",
                }
            numbering[an_id] = levels
        for n in num_root.findall(qname("num")):
            nid = n.attrib.get(qname("numId"))
            an_ref = n.find(qname("abstractNumId"))
            if an_ref is not None:
                num_map[nid] = an_ref.attrib.get(qname("val"))

    paragraphs: list[dict[str, object]] = []
    tables: list[dict[str, object]] = []
    pindex = 0
    tracker = NumberingTracker()

    # Walk body children in order to preserve table+paragraph sequence
    children = list(body)
    # Also handle tables nested inside other elements
    for child in body.iter():
        # Check for tbl as direct child of body or inside a container
        pass

    for child in children:
        tag = child.tag.split("}")[-1] if "}" in child.tag else child.tag

        if tag == "tbl":
            rows_list: list[list[str]] = []
            for tr in child.iter(qname("tr")):
                cells: list[str] = []
                for tc in tr.findall(qname("tc")):
                    cells.append(text_from_cell(tc))
                if cells:
                    rows_list.append(cells)
            if rows_list:
                tables.append({"rows": rows_list, "bodyIndex": len(paragraphs)})
            continue

        if tag != "p":
            continue

        pindex += 1
        runs: list[dict[str, object]] = []
        for run in child.findall(".//w:r", NS):
            text = text_from_element(run)
            if not text:
                continue
            style = run_style(run)
            runs.append({"text": text, **style})

        text = normalize_space("".join(str(r["text"]) for r in runs))
        if not text:
            continue

        comment_ids = [
            el.attrib[qname("id")]
            for el in child.iter(qname("commentRangeStart"))
            if qname("id") in el.attrib
        ]
        classification = classify_paragraph(text, runs, comment_ids)

        # Extract numbering info with tracker
        pPr = child.find(qname("pPr"))
        doc_number = ""
        if pPr is not None:
            numPr = pPr.find(qname("numPr"))
            if numPr is not None:
                nid = numPr.find(qname("numId"))
                ilvl = numPr.find(qname("ilvl"))
                nid_val = nid.attrib.get(qname("val")) if nid is not None else None
                ilvl_val = ilvl.attrib.get(qname("val")) if ilvl is not None else None
                if nid_val is not None and ilvl_val is not None:
                    doc_number = tracker.next_number(nid_val, ilvl_val, numbering, num_map)

        paragraphs.append(
            {
                "index": pindex,
                "text": text,
                "docNumber": doc_number,
                "classification": classification,
                "runs": runs,
            }
        )

    sha256 = hashlib.sha256(docx_path.read_bytes()).hexdigest()
    return {
        "source": {
            "file": str(docx_path),
            "sha256": sha256,
        },
        "counts": {
            "paragraphs": len(paragraphs),
            "tables": len(tables),
            "comments": len(comments),
            "paragraphs_with_placeholders": sum(1 for p in paragraphs if p["classification"]["placeholders"]),
            "paragraphs_with_ou": sum(1 for p in paragraphs if p["classification"]["has_ou"]),
            "paragraphs_with_red_italic": sum(1 for p in paragraphs if p["classification"]["has_red_italic"]),
        },
        "comments": comments,
        "paragraphs": paragraphs,
        "tables": tables,
    }


class ModelBuilder:
    def __init__(self, extraction: dict[str, object]) -> None:
        self.extraction = extraction
        self.fields: list[dict[str, object]] = []
        self.field_ids_by_label: dict[str, str] = {}
        self.choices: list[dict[str, object]] = []
        self.choice_counter = 0

    def field_id(self, label: str, paragraph_index: int, occurrence: int, reusable: bool) -> str:
        normalized_label = normalize_space(label)
        if reusable and normalized_label in self.field_ids_by_label:
            return self.field_ids_by_label[normalized_label]

        base = slugify(normalized_label, f"campo_{paragraph_index}_{occurrence}")[:48]
        candidate = f"field_{base}"
        existing = {field["id"] for field in self.fields}
        if candidate in existing:
            candidate = f"{candidate}_{paragraph_index}_{occurrence}"

        field = {
            "id": candidate,
            "label": clipped(normalized_label),
            "required": True,
            "placeholder": clipped(normalized_label),
            "sourceIndex": paragraph_index,
        }
        self.fields.append(field)
        if reusable:
            self.field_ids_by_label[normalized_label] = candidate
        return candidate

    def add_inline_choice(self, raw_group: str, paragraph_index: int) -> str:
        self.choice_counter += 1
        options = [part.strip()[1:-1].strip() for part in re.findall(r"\[[^\]]+\]", raw_group)]
        choice_id = f"choice_inline_{paragraph_index}_{self.choice_counter}"
        self.choices.append(
            {
                "id": choice_id,
                "label": f"Alternativa no paragrafo {paragraph_index}",
                "required": True,
                "sourceIndex": paragraph_index,
                "options": [
                    {
                        "value": f"opcao_{index + 1}",
                        "label": clipped(option),
                    }
                    for index, option in enumerate(options)
                ],
            }
        )
        return choice_id

    def template_from_text(self, text: str, paragraph_index: int) -> str:
        inline_choices: dict[str, str] = {}

        def replace_inline(match: re.Match[str]) -> str:
            token = f"@@CHOICE_{len(inline_choices)}@@"
            inline_choices[token] = self.add_inline_choice(match.group(0), paragraph_index)
            return token

        prepared = INLINE_OU_RE.sub(replace_inline, text)
        occurrence = 0

        def replace_placeholder(match: re.Match[str]) -> str:
            nonlocal occurrence
            occurrence += 1
            raw = match.group(0)
            label = raw[1:-1].strip()
            field_id = self.field_id(label, paragraph_index, occurrence, reusable=True)
            return "{{" + field_id + "}}"

        prepared = PLACEHOLDER_RE.sub(replace_placeholder, prepared)

        def replace_filler(match: re.Match[str]) -> str:
            nonlocal occurrence
            occurrence += 1
            raw = match.group(0)
            label = f"Preenchimento do paragrafo {paragraph_index}: {raw}"
            field_id = self.field_id(label, paragraph_index, occurrence, reusable=False)
            return "{{" + field_id + "}}"

        prepared = FILLER_RE.sub(replace_filler, prepared)
        for token, choice_id in inline_choices.items():
            prepared = prepared.replace(token, "{{" + choice_id + "}}")
        return prepared

    def paragraph_block(self, paragraph: dict[str, object]) -> dict[str, object]:
        classification = paragraph["classification"]
        comment_ids = classification.get("comment_ids", [])
        return {
            "id": f"p{paragraph['index']}",
            "type": "paragraph",
            "role": classification["role"],
            "text": self.template_from_text(str(paragraph["text"]), int(paragraph["index"])),
            "sourceIndex": paragraph["index"],
            "docNumber": str(paragraph.get("docNumber", "")),
            "noteIds": [f"comment-{comment_id}" for comment_id in comment_ids],
            "ambiguityFlags": classification.get("ambiguity_flags", []),
        }

    def table_block(self, table: dict[str, object], pindex: int) -> dict[str, object]:
        return {
            "id": f"tbl_{pindex}",
            "type": "table",
            "rows": table["rows"],
            "sourceIndex": pindex,
            "noteIds": [],
        }

    def add_block_choice(self, section_title: str, alternatives: list[list[dict[str, object]]]) -> dict[str, object]:
        self.choice_counter += 1
        choice_id = f"choice_block_{self.choice_counter}"
        options = []
        note_ids: list[str] = []
        for index, blocks in enumerate(alternatives, start=1):
            first_text = next((str(block["text"]) for block in blocks if block.get("text")), f"Opcao {index}")
            for block in blocks:
                for note_id in block.get("noteIds", []):
                    if note_id not in note_ids:
                        note_ids.append(note_id)
            options.append(
                {
                    "value": f"opcao_{index}",
                    "label": clipped(re.sub(r"{{[^}]+}}", "[...]", first_text), 100),
                    "output": [str(block["text"]) for block in blocks],
                }
            )
        self.choices.append(
            {
                "id": choice_id,
                "label": f"Escolha de redacao - {section_title}",
                "required": True,
                "noteIds": note_ids,
                "options": options,
            }
        )
        return {
            "id": f"{choice_id}_block",
            "type": "choice",
            "choiceId": choice_id,
            "role": "alternative_ou",
            "unresolvedWarning": f"Escolha uma das redacoes separadas por OU em {section_title}.",
        }

    @staticmethod
    def is_clause_heading(text: str) -> bool:
        clean = normalize_space(text)
        if clean.upper().startswith("CLÁUSULA") or clean.upper().startswith("CLAUSULA"):
            return True
        if clean.upper().startswith("ANEXO") and len(clean) > 5:
            return True
        alpha_chars = [c for c in clean if c.isalpha()]
        if len(alpha_chars) < 12:
            return False
        uppercase_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
        word_count = len(clean.split())
        return uppercase_ratio > 0.85 and word_count >= 2

    @staticmethod
    def is_ou_block(block: dict[str, object]) -> bool:
        return block.get("type") == "paragraph" and normalize_space(str(block.get("text", ""))).upper() == "OU"

    def group_ou_blocks(self, blocks: list[dict[str, object]], section_title: str) -> list[dict[str, object]]:
        result: list[dict[str, object]] = []
        index = 0
        while index < len(blocks):
            block = blocks[index]
            if not self.is_ou_block(block):
                result.append(block)
                index += 1
                continue

            previous: list[dict[str, object]] = []
            while result and result[-1].get("type") == "paragraph":
                previous.insert(0, result.pop())
            alternatives = [previous] if previous else []

            while index < len(blocks) and self.is_ou_block(blocks[index]):
                index += 1
                current: list[dict[str, object]] = []
                while index < len(blocks) and not self.is_ou_block(blocks[index]):
                    current.append(blocks[index])
                    index += 1
                if current:
                    alternatives.append(current)

            if len(alternatives) >= 2:
                result.append(self.add_block_choice(section_title, alternatives))
            else:
                result.extend(previous)
                result.append(block)
        return result

    def add_block_choice(self, section_title: str, alternatives: list[list[dict[str, object]]]) -> dict[str, object]:
        self.choice_counter += 1
        choice_id = f"choice_block_{self.choice_counter}"
        options = []
        note_ids: list[str] = []
        for index, blocks in enumerate(alternatives, start=1):
            texts = [str(b.get("text", "")) for b in blocks if b.get("type") == "paragraph" and b.get("text")]
            first_text = texts[0] if texts else f"Opcao {index}"
            for block in blocks:
                for note_id in block.get("noteIds", []):
                    if note_id not in note_ids:
                        note_ids.append(note_id)
            options.append({
                "value": f"opcao_{index}",
                "label": clipped(re.sub(r"{{[^}]+}}", "[...]", first_text), 100),
                "output": texts,
            })
        self.choices.append({
            "id": choice_id,
            "label": f"Escolha de redacao - {section_title}",
            "required": True,
            "noteIds": note_ids,
            "options": options,
        })
        return {
            "id": f"{choice_id}_block",
            "type": "choice",
            "choiceId": choice_id,
            "role": "alternative_ou",
            "unresolvedWarning": f"Escolha uma das redacoes separadas por OU em {section_title}.",
        }

    def build(self) -> dict[str, object]:
        paragraphs = list(self.extraction["paragraphs"])
        tables = list(self.extraction.get("tables", []))
        comments = dict(self.extraction["comments"])
        source = dict(self.extraction["source"])
        counts = dict(self.extraction["counts"])
        title = str(paragraphs[0]["text"]) if paragraphs else "Termo de Referencia"

        notes = [
            {
                "id": f"comment-{comment_id}",
                "title": clipped(text, 80),
                "body": [text],
                "sourceCommentId": comment_id,
            }
            for comment_id, text in sorted(comments.items(), key=lambda item: int(item[0]))
        ]

        # Build all items (paragraphs + tables) in document order
        all_items: list[dict[str, object]] = []
        table_idx = 0
        pindex = 0
        remaining_paras = list(paragraphs)

        for para in remaining_paras:
            # Insert any tables that belong before this paragraph
            while table_idx < len(tables):
                tbl = tables[table_idx]
                if tbl["bodyIndex"] <= pindex:
                    all_items.append(self.table_block(tbl, len(all_items)))
                    table_idx += 1
                else:
                    break
            all_items.append(self.paragraph_block(para))
            pindex += 1

        # Append remaining tables
        while table_idx < len(tables):
            all_items.append(self.table_block(tables[table_idx], len(all_items)))
            table_idx += 1

        sections: list[dict[str, object]] = []
        current = {"id": "preambulo", "title": "Preambulo", "blocks": []}
        for item in all_items[1:]:
            if item["type"] == "paragraph":
                text = str(item.get("text", ""))
                if self.is_clause_heading(text):
                    current["blocks"] = self.group_ou_blocks(current["blocks"], str(current["title"]))
                    if current["blocks"]:
                        sections.append(current)
                    current = {"id": f"sec_{item['id']}", "title": text, "blocks": []}
                    continue
            current["blocks"].append(item)

        current["blocks"] = self.group_ou_blocks(current["blocks"], str(current["title"]))
        if current["blocks"]:
            sections.append(current)

        return {
            "metadata": {
                "id": "tr-servicos-obras-lei-14133-dez-25",
                "title": title,
                "sourceName": Path(str(source["file"])).name,
                "sourceType": "DOCX canonical",
                "sourceSha256": source["sha256"],
                "versionLabel": "dez/25",
                "outputMode": "printable-html",
                "notesSuppressedInFinal": True,
                "conversionSummary": counts,
            },
            "notes": notes,
            "fields": self.fields,
            "choices": self.choices,
            "sections": sections,
            "extractionContract": {
                "fixedTextRole": "black invariant text",
                "variableTextRole": "red italic text and placeholder/filler candidates",
                "placeholderPattern": "\\[[^\\]]+\\]",
                "fillerPattern": "x placeholders and dot leaders",
                "alternativeMarker": "OU",
                "ambiguityPolicy": "preserve source evidence and require review",
            },
        }


def encode_model_js(model: dict[str, object]) -> str:
    encoded = json.dumps(model, ensure_ascii=False, indent=2)
    return "/* Auto-generated from the canonical DOCX by tools/extract_docx_model.py. */\nwindow.TR_MODEL = " + encoded + ";\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract AGU TR DOCX semantic signals as JSON.")
    parser.add_argument("docx", type=Path, help="Path to the DOCX model")
    parser.add_argument("--out", type=Path, help="Output JSON path. Defaults to stdout.")
    parser.add_argument("--model-js", type=Path, help="Write a browser-ready window.TR_MODEL JavaScript file")
    parser.add_argument("--sample", type=int, default=0, help="Keep only the first N paragraphs in output")
    args = parser.parse_args()

    if not args.docx.exists():
        print(f"DOCX not found: {args.docx}", file=sys.stderr)
        return 2

    result = parse_document(args.docx)
    if args.model_js:
        model = ModelBuilder(result).build()
        args.model_js.parent.mkdir(parents=True, exist_ok=True)
        args.model_js.write_text(encode_model_js(model), encoding="utf-8")
        if not args.out and not args.sample:
            print(
                json.dumps(
                    {
                        "model_js": str(args.model_js),
                        "counts": result["counts"],
                        "generated": {
                            "fields": len(model["fields"]),
                            "choices": len(model["choices"]),
                            "sections": len(model["sections"]),
                        },
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )
            return 0

    if args.sample:
        result["paragraphs"] = result["paragraphs"][: args.sample]
        result["sampled"] = args.sample

    encoded = json.dumps(result, ensure_ascii=False, indent=2)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(encoded + "\n", encoding="utf-8")
    else:
        print(encoded)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
