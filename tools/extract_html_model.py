#!/usr/bin/env python3
"""Extract semantic signals from an AGU TR HTML model exported from Google Docs."""

from __future__ import annotations

import argparse
import hashlib
import html as html_mod
import json
import re
import sys
import unicodedata
from pathlib import Path


PLACEHOLDER_RE = re.compile(r"\[[^\]]{1,140}\]")
INLINE_OU_RE = re.compile(r"\[[^\]]{1,140}\](?:\s+OU\s+\[[^\]]{1,140}\])+")
FILLER_RE = re.compile(r"(?<![A-Za-z0-9])x{2,}(?:[./-]x{2,})*(?![A-Za-z0-9])|\.{4,}", re.IGNORECASE)


def parse_css_classes(css_text: str) -> dict[str, dict[str, object]]:
    class_map: dict[str, dict[str, object]] = {}
    for m in re.finditer(r'\.(c\d+)\s*\{([^}]+)\}', css_text):
        cls = m.group(1)
        rules = m.group(2)
        color = "000000"
        italic = False
        bold = False
        underline = False
        bg_yellow = False
        if "color:#ff0000" in rules:
            color = "FF0000"
        elif "color:#000080" in rules:
            color = "000080"
        elif "color:#548dd4" in rules:
            color = "548dd4"
        elif "color:#595959" in rules:
            color = "595959"
        elif "color:#7f7f7f" in rules:
            color = "7f7f7f"
        elif "color:#ffffff" in rules:
            color = "FFFFFF"
        if "font-style:italic" in rules:
            italic = True
        if "font-weight:700" in rules:
            bold = True
        if "text-decoration:underline" in rules:
            underline = True
        if "background-color:#ffff00" in rules:
            bg_yellow = True
        class_map[cls] = {"color": color, "italic": italic, "bold": bold, "underline": underline, "bg_yellow": bg_yellow}
    return class_map


def span_formatting(classes_str: str, class_map: dict[str, dict[str, object]]) -> dict[str, object]:
    color = "000000"
    italic = False
    bold = False
    underline = False
    bg_yellow = False
    for cls in classes_str.strip().split():
        fmt = class_map.get(cls, {})
        if fmt.get("color") and fmt["color"] != "000000":
            color = fmt["color"]
        if fmt.get("italic"):
            italic = True
        if fmt.get("bold"):
            bold = True
        if fmt.get("underline"):
            underline = True
        if fmt.get("bg_yellow"):
            bg_yellow = True
    return {"color": color, "italic": italic, "bold": bold, "underline": underline, "bg_yellow": bg_yellow}


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def clipped(value: str, limit: int = 96) -> str:
    value = normalize_space(value)
    return value if len(value) <= limit else value[: limit - 3].rstrip() + "..."


def slugify(value: str, fallback: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", ascii_value.lower()).strip("_")
    return slug or fallback


def clean_footnotes(text: str) -> str:
    """Remove superscript footnote markers like [a], [b], etc."""
    text = re.sub(r"\[[a-z]\]", "", text)
    text = re.sub(r"\[cmnt_ref\d+\]", "", text)
    return text


def parse_html_document(html_path: Path) -> dict[str, object]:
    raw_html = html_path.read_text(encoding="utf-8")

    css_match = re.search(r"<style[^>]*>(.*?)</style>", raw_html, re.DOTALL)
    class_map = parse_css_classes(css_match.group(1)) if css_match else {}

    stripped = re.sub(r"<style[^>]*>.*?</style>", "", raw_html, re.DOTALL)
    body_match = re.search(r"<body[^>]*>(.*)</body>", stripped, re.DOTALL)
    body_text = body_match.group(1) if body_match else stripped

    # Remove the comment footnote section (divs at the bottom with gray text)
    # Comments are in <div class="c4"> after the main content
    # Find the first comment anchor and truncate
    cmnt_start = body_text.find('<a href="#cmnt_ref')
    if cmnt_start > 0:
        # Find the last <hr> before comments, or just use the cmnt_start
        hr_pos = body_text.rfind("<hr", 0, cmnt_start)
        if hr_pos > 0:
            main_body = body_text[:hr_pos]
        else:
            # Remove from first comment section
            main_body = body_text[:cmnt_start]
    else:
        main_body = body_text

    # Extract comment footnotes from the removed section
    comments: dict[str, str] = {}
    footer_section = body_text[cmnt_start:] if cmnt_start > 0 else ""
    for m in re.finditer(r'<a[^>]+href=["\']#cmnt_ref\d+["\'][^>]+id=["\']cmnt(\d+)["\']>[^<]+</a>\s*(.*?)</p>', footer_section, re.DOTALL):
        cid = m.group(1)
        content = re.sub(r"<[^>]+>", "", m.group(2))
        content = html_mod.unescape(content)
        content = normalize_space(content)
        if content:
            comments[cid] = content

    # Convert <li> to <p> so we capture all paragraph-like elements
    main_body = re.sub(r"<li\b", "<p", main_body)
    main_body = re.sub(r"</li>", "</p>", main_body)

    # Remove <script>, <style>, <sup> completely
    main_body = re.sub(r"<sup[^>]*>.*?</sup>", "", main_body)
    main_body = re.sub(r"<a\b[^>]*>.*?</a>", "", main_body)
    main_body = re.sub(r"<img[^>]*>", "", main_body)
    main_body = re.sub(r"<br\s*/?>", " ", main_body)

    # Extract all <p> elements
    paragraphs: list[dict[str, object]] = []
    for index, p_match in enumerate(re.finditer(r"<p[^>]*>(.*?)</p>", main_body, re.DOTALL), start=1):
        p_html = p_match.group(1)
        runs: list[dict[str, object]] = []

        for span_match in re.finditer(r'<span\s+class=["\']([^"\']*)["\'][^>]*>(.*?)</span>', p_html, re.DOTALL):
            classes = span_match.group(1)
            span_text_raw = span_match.group(2)
            span_text = html_mod.unescape(span_text_raw)
            fmt = span_formatting(classes, class_map)
            runs.append({**fmt, "text": span_text})

        combined = "".join(str(r["text"]) for r in runs)
        combined = normalize_space(combined)
        if not combined:
            continue

        text = combined

        placeholders = PLACEHOLDER_RE.findall(text)
        red_runs = [r for r in runs if str(r.get("color", "")).upper() == "FF0000"]
        red_italic_runs = [r for r in red_runs if r.get("italic")]
        italic_runs = [r for r in runs if r.get("italic")]
        variable_run_texts = [
            normalize_space(str(r.get("text", "")))
            for r in red_italic_runs
            if normalize_space(str(r.get("text", "")))
        ]
        stripped_text = normalize_space(text)
        is_ou_marker = stripped_text.upper() == "OU" or stripped_text == "OU"
        has_ou = is_ou_marker or bool(re.search(r"(^|\s)OU(\s|$)", stripped_text))

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

        paragraphs.append({
            "index": index,
            "text": clean_footnotes(text),
            "classification": {
                "role": role,
                "placeholders": placeholders,
                "has_ou": has_ou,
                "is_ou_marker": is_ou_marker,
                "has_red": bool(red_runs),
                "has_red_italic": bool(red_italic_runs),
                "has_italic": bool(italic_runs),
                "variable_run_texts": variable_run_texts,
                "comment_ids": [],
                "ambiguity_flags": ambiguity,
            },
            "runs": runs,
        })

    sha256 = hashlib.sha256(html_path.read_bytes()).hexdigest()
    return {
        "source": {"file": str(html_path), "sha256": sha256},
        "counts": {
            "paragraphs": len(paragraphs),
            "comments": len(comments),
            "paragraphs_with_placeholders": sum(1 for p in paragraphs if p["classification"]["placeholders"]),
            "paragraphs_with_ou": sum(1 for p in paragraphs if p["classification"]["has_ou"]),
            "paragraphs_with_red_italic": sum(1 for p in paragraphs if p["classification"]["has_red_italic"]),
        },
        "comments": comments,
        "paragraphs": paragraphs,
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
        field = {"id": candidate, "label": clipped(normalized_label), "required": True, "placeholder": clipped(normalized_label), "sourceIndex": paragraph_index}
        self.fields.append(field)
        if reusable:
            self.field_ids_by_label[normalized_label] = candidate
        return candidate

    def add_inline_choice(self, raw_group: str, paragraph_index: int) -> str:
        self.choice_counter += 1
        options_list = [part.strip()[1:-1].strip() for part in re.findall(r"\[[^\]]+\]", raw_group)]
        choice_id = f"choice_inline_{paragraph_index}_{self.choice_counter}"
        self.choices.append({
            "id": choice_id, "label": f"Alternativa no paragrafo {paragraph_index}", "required": True,
            "sourceIndex": paragraph_index,
            "options": [{"value": f"opcao_{idx + 1}", "label": clipped(option)} for idx, option in enumerate(options_list)],
        })
        return choice_id

    def is_generic_label(self, label: str) -> bool:
        stripped = label.strip(" .")
        return len(stripped) <= 3 or stripped == "..."

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
            reusable = not self.is_generic_label(label)
            if self.is_generic_label(label):
                label = f"Campo {paragraph_index}.{occurrence}: {raw}"
            field_id = self.field_id(label, paragraph_index, occurrence, reusable=reusable)
            return "{{" + field_id + "}}"
        prepared = PLACEHOLDER_RE.sub(replace_placeholder, prepared)
        def replace_filler(match: re.Match[str]) -> str:
            nonlocal occurrence
            occurrence += 1
            raw = match.group(0)
            label = f"Campo {paragraph_index}.{occurrence}: {raw}"
            field_id = self.field_id(label, paragraph_index, occurrence, reusable=False)
            return "{{" + field_id + "}}"
        prepared = FILLER_RE.sub(replace_filler, prepared)
        for token, choice_id in inline_choices.items():
            prepared = prepared.replace(token, "{{" + choice_id + "}}")
        return prepared

    def paragraph_block(self, paragraph: dict[str, object]) -> dict[str, object]:
        c = paragraph["classification"]
        return {"id": f"p{paragraph['index']}", "type": "paragraph", "role": c["role"],
                "styleFlags": {
                    "hasRed": c.get("has_red", False),
                    "hasRedItalic": c.get("has_red_italic", False),
                    "hasItalic": c.get("has_italic", False),
                    "variableRunTexts": c.get("variable_run_texts", []),
                },
                "runs": paragraph.get("runs", []),
                "text": self.template_from_text(str(paragraph["text"]), int(paragraph["index"])),
                "sourceIndex": paragraph["index"], "noteIds": [],
                "ambiguityFlags": c.get("ambiguity_flags", [])}

    def add_block_choice(self, section_title: str, alternatives: list[list[dict[str, object]]]) -> dict[str, object]:
        self.choice_counter += 1
        choice_id = f"choice_block_{self.choice_counter}"
        options = []
        note_ids: list[str] = []
        for index, blocks in enumerate(alternatives, start=1):
            output_blocks = [
                block
                for block in blocks
                if block.get("type") == "paragraph" and block.get("text")
            ]
            first_text = next((str(block["text"]) for block in output_blocks if block.get("text")), f"Opcao {index}")
            for block in blocks:
                for nid in block.get("noteIds", []):
                    if nid not in note_ids:
                        note_ids.append(nid)
            options.append({"value": f"opcao_{index}",
                            "label": clipped(re.sub(r"{{[^}]+}}", "[...]", first_text), 100),
                            "output": [str(block["text"]) for block in output_blocks],
                            "outputBlocks": output_blocks})
        self.choices.append({"id": choice_id, "label": f"Escolha de redacao - {section_title}",
                             "required": True, "noteIds": note_ids, "options": options})
        return {"id": f"{choice_id}_block", "type": "choice", "choiceId": choice_id,
                "role": "alternative_ou", "unresolvedWarning": f"Escolha uma das redacoes separadas por OU em {section_title}."}

    @staticmethod
    def is_clause_heading(text: str) -> bool:
        clean = normalize_space(text)
        if clean.upper().startswith("CLÁUSULA") or clean.upper().startswith("CLAUSULA"):
            return True
        if clean.upper().startswith("ANEXO"):
            return True
        # All-uppercase multi-word phrases used as TR section headings
        alpha_chars = [c for c in clean if c.isalpha()]
        if len(alpha_chars) < 12:
            return False
        uppercase_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
        word_count = len(clean.split())
        return uppercase_ratio > 0.85 and word_count >= 2

    @staticmethod
    def is_ou_block(block: dict[str, object]) -> bool:
        return block.get("type") == "paragraph" and normalize_space(str(block.get("text", ""))).upper() == "OU"

    @staticmethod
    def has_doc_number(block: dict[str, object]) -> bool:
        return bool(str(block.get("docNumber", "")).strip())

    @staticmethod
    def is_unnumbered_paragraph(block: dict[str, object]) -> bool:
        return block.get("type") == "paragraph" and not ModelBuilder.has_doc_number(block)

    def take_previous_alternative(self, result: list[dict[str, object]]) -> list[dict[str, object]]:
        if not result or result[-1].get("type") != "paragraph":
            return []
        if not self.has_doc_number(result[-1]):
            return [result.pop()]
        previous: list[dict[str, object]] = []
        while result and result[-1].get("type") == "paragraph" and self.has_doc_number(result[-1]):
            previous.insert(0, result.pop())
        return previous

    def take_next_alternative(
        self,
        blocks: list[dict[str, object]],
        index: int,
    ) -> tuple[list[dict[str, object]], int]:
        current: list[dict[str, object]] = []
        seen_numbered = False
        while index < len(blocks):
            block = blocks[index]
            if self.is_ou_block(block):
                break
            if current and seen_numbered and self.is_unnumbered_paragraph(block):
                break
            current.append(block)
            seen_numbered = seen_numbered or self.has_doc_number(block)
            index += 1
        return current, index

    def group_ou_blocks(self, blocks: list[dict[str, object]], section_title: str) -> list[dict[str, object]]:
        result: list[dict[str, object]] = []
        i = 0
        while i < len(blocks):
            block = blocks[i]
            if not self.is_ou_block(block):
                result.append(block)
                i += 1
                continue
            previous = self.take_previous_alternative(result)
            alt = [previous] if previous else []
            while i < len(blocks) and self.is_ou_block(blocks[i]):
                i += 1
                current, i = self.take_next_alternative(blocks, i)
                if current:
                    alt.append(current)
            if len(alt) >= 2:
                result.append(self.add_block_choice(section_title, alt))
            else:
                result.extend(previous)
                result.append(block)
        return result

    def build(self) -> dict[str, object]:
        paragraphs = list(self.extraction["paragraphs"])
        comments = dict(self.extraction["comments"])
        source = dict(self.extraction["source"])
        counts = dict(self.extraction["counts"])
        title = str(paragraphs[0]["text"]) if paragraphs else "Termo de Referencia"

        notes = [{"id": f"note-html-{cid}", "title": clipped(text, 80), "body": [text], "sourceCommentId": cid}
                 for cid, text in sorted(comments.items(), key=lambda item: int(item[0]))]

        sections: list[dict[str, object]] = []
        current = {"id": "preambulo", "title": "Preambulo", "docNumber": "", "blocks": []}
        for paragraph in paragraphs[1:]:
            text = str(paragraph["text"])
            if self.is_clause_heading(text):
                current["blocks"] = self.group_ou_blocks(current["blocks"], str(current["title"]))
                if current["blocks"]:
                    sections.append(current)
                current = {"id": f"sec_html_{paragraph['index']}", "title": text, "docNumber": "", "blocks": []}
                continue
            current["blocks"].append(self.paragraph_block(paragraph))
        current["blocks"] = self.group_ou_blocks(current["blocks"], str(current["title"]))
        if current["blocks"]:
            sections.append(current)

        return {
            "metadata": {
                "id": "tr-servico-sem-dedicacao-exclusiva-lei-14133-dez-25",
                "title": title, "sourceName": Path(str(source["file"])).name,
                "sourceType": "HTML Google Docs export", "sourceSha256": source["sha256"],
                "versionLabel": "dez/25", "outputMode": "printable-html",
                "notesSuppressedInFinal": True, "conversionSummary": counts,
            },
            "notes": notes,
            "fields": self.fields,
            "choices": self.choices,
            "sections": sections,
            "extractionContract": {
                "fixedTextRole": "black invariant text", "variableTextRole": "red italic text and placeholder/filler candidates",
                "placeholderPattern": "\\[[^\\]]+\\]", "fillerPattern": "x placeholders and dot leaders",
                "alternativeMarker": "OU", "ambiguityPolicy": "preserve source evidence and require review",
            },
        }


def encode_model_js(model: dict[str, object]) -> str:
    return "/* Auto-generated from the HTML Google Docs export by tools/extract_html_model.py. */\nwindow.TR_MODEL = " + json.dumps(model, ensure_ascii=False, indent=2) + ";\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract AGU TR HTML model as structured model-data.js")
    parser.add_argument("html", type=Path, help="Path to the HTML model exported from Google Docs")
    parser.add_argument("--model-js", type=Path, help="Write a browser-ready window.TR_MODEL JavaScript file")
    parser.add_argument("--out", type=Path, help="Write extraction JSON to path")
    args = parser.parse_args()

    if not args.html.exists():
        print(f"HTML not found: {args.html}", file=sys.stderr)
        return 2

    result = parse_html_document(args.html)

    if args.model_js:
        model = ModelBuilder(result).build()
        args.model_js.parent.mkdir(parents=True, exist_ok=True)
        args.model_js.write_text(encode_model_js(model), encoding="utf-8")
        print(json.dumps({
            "model_js": str(args.model_js),
            "counts": result["counts"],
            "generated": {"fields": len(model["fields"]), "choices": len(model["choices"]), "sections": len(model["sections"])},
        }, ensure_ascii=False, indent=2))
        return 0

    encoded = json.dumps(result, ensure_ascii=False, indent=2)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(encoded + "\n", encoding="utf-8")
    else:
        print(encoded)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
