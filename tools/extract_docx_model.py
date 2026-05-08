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
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
}

PLACEHOLDER_RE = re.compile(r"\[[^\]]{1,140}\]")


def qname(local: str) -> str:
    return f"{{{NS['w']}}}{local}"


def text_from_element(element: ET.Element) -> str:
    parts: list[str] = []
    for text in element.iter(qname("t")):
        parts.append(text.text or "")
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


def parse_document(docx_path: Path) -> dict[str, object]:
    with zipfile.ZipFile(docx_path) as zf:
        document_xml = zf.read("word/document.xml")
        comments = load_comments(zf)
        root = ET.fromstring(document_xml)

    paragraphs: list[dict[str, object]] = []
    for index, paragraph in enumerate(root.iter(qname("p")), start=1):
        runs: list[dict[str, object]] = []
        for run in paragraph.findall(".//w:r", NS):
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
            for el in paragraph.iter(qname("commentRangeStart"))
            if qname("id") in el.attrib
        ]
        classification = classify_paragraph(text, runs, comment_ids)
        paragraphs.append(
            {
                "index": index,
                "text": text,
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
            "comments": len(comments),
            "paragraphs_with_placeholders": sum(1 for p in paragraphs if p["classification"]["placeholders"]),
            "paragraphs_with_ou": sum(1 for p in paragraphs if p["classification"]["has_ou"]),
            "paragraphs_with_red_italic": sum(1 for p in paragraphs if p["classification"]["has_red_italic"]),
        },
        "comments": comments,
        "paragraphs": paragraphs,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract AGU TR DOCX semantic signals as JSON.")
    parser.add_argument("docx", type=Path, help="Path to the DOCX model")
    parser.add_argument("--out", type=Path, help="Output JSON path. Defaults to stdout.")
    parser.add_argument("--sample", type=int, default=0, help="Keep only the first N paragraphs in output")
    args = parser.parse_args()

    if not args.docx.exists():
        print(f"DOCX not found: {args.docx}", file=sys.stderr)
        return 2

    result = parse_document(args.docx)
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
