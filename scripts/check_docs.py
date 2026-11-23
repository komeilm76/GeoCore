#!/usr/bin/env python3
"""Dependency-free structural checks for GeoCore's Markdown documentation."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
GLOBAL_BILINGUAL_STEMS = (
    "ADRS",
    "ARCHITECTURE",
    "DATA-GOVERNANCE",
    "DEVELOPMENT-STACK",
    "GLOSSARY",
    "GOVERNANCE",
    "I18N",
    "IMPLEMENTATION-READINESS",
    "LEGAL-AND-LICENSE-REVIEW",
    "OPEN-DECISIONS",
    "QUALITY-AND-RELEASE",
    "REQUIREMENTS-TRACEABILITY",
    "ROADMAP",
    "SCOPE-REVISION-PLAN",
    "SECURITY",
    "SERVICE-DOCUMENTATION-TEMPLATE",
)
SERVICE_SLUGS = (
    "map-tiles",
    "geocoding",
    "map-search",
    "routing",
    "route-matrix",
    "map-matching",
    "elevation",
    "spatial-analysis",
    "location-tracking",
    "data-management",
    "proximity",
    "traffic",
    "map-customization",
)
LINK_RE = re.compile(r"!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)(?:\s+[^)]*)?\)")
FENCE_OPEN_RE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
FENCE_CLOSE_RE = re.compile(r"^ {0,3}(`+|~+)[ \t]*$")
REQUIREMENT_RE = re.compile(
    r"\b(?:[A-Z][A-Z0-9]*-[A-Z0-9]+-\d+[A-Z]?|"
    r"(?:TILE|GEO|SEARCH|MODE|TRIP|MATRIX|OPT|MATCH|TERRAIN|SPATIAL|HIST|"
    r"SHARE|DEVICE|NEAR|TRAFFIC|CUSTOM|ROUTE|MANAGE|TRACK|MOVE|DATA|REQ|"
    r"SEC|OPS|I18N|QA)-\d+[A-Z]?)\b"
)


def markdown_files(root: Path) -> list[Path]:
    generated_or_vendor = {".git", "node_modules", "dist", "coverage", ".venv", "__pycache__"}
    return sorted(
        path
        for path in root.rglob("*.md")
        if not any(part in generated_or_vendor for part in path.parts)
    )


def has_unclosed_fence(text: str) -> bool:
    """Validate matching fence character and minimum closing run length."""
    marker: str | None = None
    marker_length = 0
    for line in text.splitlines():
        if marker is None:
            opening = FENCE_OPEN_RE.match(line)
            if not opening:
                continue
            run, info = opening.groups()
            # CommonMark forbids backticks in the info string of a backtick fence.
            if run[0] == "`" and "`" in info:
                continue
            marker = run[0]
            marker_length = len(run)
            continue

        closing = FENCE_CLOSE_RE.match(line)
        if closing:
            run = closing.group(1)
            if run[0] == marker and len(run) >= marker_length:
                marker = None
                marker_length = 0
    return marker is not None


def check_repository(root: Path = ROOT) -> list[str]:
    """Return structural documentation problems; an empty list means checks pass."""
    root = root.resolve()
    errors: list[str] = []
    required = (
        root / "GeoCore-Product-Scope-en-v1.12.md",
        root / "GeoCore-Product-Scope-fa-v1.12.md",
        root / "README.md",
        root / "docs/README.md",
        root / "docs/global/REQUIREMENTS-TRACEABILITY.md",
        root / "docs/global/OPEN-DECISIONS-SIMPLE.fa.md",
        root / "docs/global/PRODUCT-DECISIONS-AND-AGREEMENTS.fa.md",
        root / "docs/global/SCOPE-REVISION-PLAN.md",
    )
    for path in required:
        if not path.is_file():
            errors.append(f"required file missing: {path.relative_to(root)}")

    services_root = root / "docs/services"
    expected_slugs = set(SERVICE_SLUGS)
    actual_slugs = {path.name for path in services_root.iterdir() if path.is_dir()} if services_root.is_dir() else set()
    for slug in sorted(actual_slugs - expected_slugs):
        errors.append(f"unregistered service documentation directory: docs/services/{slug}")
    for stem in GLOBAL_BILINGUAL_STEMS:
        for suffix in (".md", ".fa.md"):
            path = root / "docs/global" / f"{stem}{suffix}"
            if not path.is_file():
                errors.append(f"global document language version missing: {path.relative_to(root)}")

    for slug in SERVICE_SLUGS:
        for language in ("en", "fa"):
            path = root / "docs" / "services" / slug / f"user-guide.{language}.md"
            if not path.is_file():
                errors.append(f"service guide missing: {path.relative_to(root)}")

    spikes_root = root / "spikes"
    if spikes_root.is_dir():
        for spike_dir in spikes_root.iterdir():
            if spike_dir.is_dir() and (spike_dir / "README.md").is_file():
                if not (spike_dir / "README.fa.md").is_file():
                    errors.append(f"Persian README missing for spike: {spike_dir.relative_to(root)}/README.fa.md")

    decisions_root = root / "docs/decisions"
    if decisions_root.is_dir():
        for adr in decisions_root.glob("[0-9][0-9][0-9][0-9]-*.md"):
            if adr.stem.endswith(".fa"):
                continue
            companion = adr.with_name(f"{adr.stem}.fa.md")
            if not companion.is_file():
                errors.append(f"Persian companion missing for ADR: {companion.relative_to(root)}")

    simple_decisions = root / "docs/global/OPEN-DECISIONS-SIMPLE.fa.md"
    if simple_decisions.is_file() and LINK_RE.search(simple_decisions.read_text(encoding="utf-8")):
        errors.append("simple Persian open-decisions guide must contain its information directly without links")

    owner_record = root / "docs/global/PRODUCT-DECISIONS-AND-AGREEMENTS.fa.md"
    if owner_record.is_file():
        owner_text = owner_record.read_text(encoding="utf-8")
        for number in range(1, 21):
            decision_id = f"D-{number:03d}"
            if decision_id not in owner_text:
                errors.append(f"owner decision record is missing {decision_id}")

    scope = root / "GeoCore-Product-Scope-en-v1.12.md"
    known_requirements: set[str] = set()
    if scope.is_file():
        known_requirements = set(REQUIREMENT_RE.findall(scope.read_text(encoding="utf-8")))

    for path in markdown_files(root):
        text = path.read_text(encoding="utf-8")
        if has_unclosed_fence(text):
            errors.append(f"unclosed Markdown code fence: {path.relative_to(root)}")

        for match in LINK_RE.finditer(text):
            raw_target = match.group(1).strip()
            if raw_target.startswith("<") and raw_target.endswith(">"):
                raw_target = raw_target[1:-1]
            parsed = urlsplit(raw_target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            target_path = unquote(parsed.path)
            candidate = (path.parent / target_path).resolve()
            try:
                candidate.relative_to(root)
            except ValueError:
                errors.append(
                    f"local link escapes repository in {path.relative_to(root)}: {raw_target}"
                )
                continue
            if not candidate.exists():
                errors.append(
                    f"broken local link in {path.relative_to(root)}: {raw_target}"
                )

        if path != scope and known_requirements:
            for requirement in set(REQUIREMENT_RE.findall(text)) - known_requirements:
                errors.append(
                    f"unknown requirement identifier {requirement} in {path.relative_to(root)}"
                )

    return errors


def main() -> int:
    errors = check_repository()
    if errors:
        print("Documentation checks failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    files = len(markdown_files(ROOT))
    print(
        f"Documentation checks passed: {files} Markdown files, "
        f"{len(SERVICE_SLUGS)} bilingual service manuals, "
        f"{len(GLOBAL_BILINGUAL_STEMS)} bilingual global document pairs, local links and requirement IDs."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
