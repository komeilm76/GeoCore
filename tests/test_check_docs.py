"""Unit tests for the dependency-free documentation checker."""
from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "check_docs.py"
SPEC = importlib.util.spec_from_file_location("check_docs", SCRIPT)
assert SPEC and SPEC.loader
check_docs = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(check_docs)


class DocumentationCheckerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "docs").mkdir()
        (self.root / "docs/global").mkdir()
        (self.root / "GeoCore-Product-Scope-en-v1.12.md").write_text(
            "Requirements: `TILE-01`, `REQ-P1`.", encoding="utf-8"
        )
        (self.root / "GeoCore-Product-Scope-fa-v1.12.md").write_text(
            "دامنه", encoding="utf-8"
        )
        (self.root / "README.md").write_text("# Root", encoding="utf-8")
        (self.root / "docs/README.md").write_text("# Docs", encoding="utf-8")
        (self.root / "docs/global/REQUIREMENTS-TRACEABILITY.md").write_text(
            "# Trace", encoding="utf-8"
        )
        (self.root / "docs/global/OPEN-DECISIONS-SIMPLE.fa.md").write_text(
            "راهنمای مستقل", encoding="utf-8"
        )
        (self.root / "docs/global/PRODUCT-DECISIONS-AND-AGREEMENTS.fa.md").write_text(
            " ".join(f"D-{number:03d}" for number in range(1, 21)), encoding="utf-8"
        )
        (self.root / "docs/global/SCOPE-REVISION-PLAN.md").write_text(
            "# Scope plan", encoding="utf-8"
        )
        for stem in check_docs.GLOBAL_BILINGUAL_STEMS:
            for suffix in (".md", ".fa.md"):
                (self.root / "docs/global" / f"{stem}{suffix}").write_text(
                    "# Global document", encoding="utf-8"
                )
        for slug in check_docs.SERVICE_SLUGS:
            folder = self.root / "docs/services" / slug
            folder.mkdir(parents=True)
            for language in ("en", "fa"):
                (folder / f"user-guide.{language}.md").write_text(
                    "# Guide", encoding="utf-8"
                )

    def tearDown(self) -> None:
        self.temp.cleanup()

    def test_valid_bilingual_tree_passes(self) -> None:
        self.assertEqual(check_docs.check_repository(self.root), [])

    def test_broken_local_link_is_reported(self) -> None:
        (self.root / "README.md").write_text(
            "[missing](does-not-exist.md)", encoding="utf-8"
        )
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("broken local link" in error for error in errors))

    def test_vendor_markdown_is_excluded_from_repository_checks(self) -> None:
        vendor = self.root / "spikes/example/node_modules/vendor"
        vendor.mkdir(parents=True)
        (vendor / "README.md").write_text("[bad](missing.md)", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertFalse(any("vendor/README.md" in error for error in errors))

    def test_spike_readme_requires_persian_companion(self) -> None:
        spike = self.root / "spikes/example"
        spike.mkdir(parents=True)
        (spike / "README.md").write_text("# Spike", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("spikes/example/README.fa.md" in error for error in errors))

    def test_adr_requires_persian_companion(self) -> None:
        decisions = self.root / "docs/decisions"
        decisions.mkdir()
        (decisions / "0001-example.md").write_text("# Proposed ADR", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("0001-example.fa.md" in error for error in errors))

    def test_missing_global_translation_is_reported(self) -> None:
        (self.root / "docs/global/GOVERNANCE.fa.md").unlink()
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("GOVERNANCE.fa.md" in error for error in errors))

    def test_missing_language_pair_is_reported(self) -> None:
        (self.root / "docs/services/routing/user-guide.fa.md").unlink()
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("routing/user-guide.fa.md" in error for error in errors))

    def test_unclosed_fence_is_reported(self) -> None:
        (self.root / "docs/README.md").write_text("```python\nprint(1)\n", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("unclosed Markdown code fence" in error for error in errors))

    def test_local_link_cannot_escape_repository(self) -> None:
        (self.root / "README.md").write_text("[outside](../outside.md)", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("local link escapes repository" in error for error in errors))

    def test_mismatched_fence_marker_is_reported(self) -> None:
        (self.root / "docs/README.md").write_text("```python\nprint(1)\n~~~\n", encoding="utf-8")
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("unclosed Markdown code fence" in error for error in errors))

    def test_owner_decision_record_requires_all_twenty_ids(self) -> None:
        (self.root / "docs/global/PRODUCT-DECISIONS-AND-AGREEMENTS.fa.md").write_text(
            "D-001 D-002", encoding="utf-8"
        )
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("owner decision record is missing D-020" in error for error in errors))

    def test_simple_persian_decision_guide_must_not_link_out(self) -> None:
        (self.root / "docs/global/OPEN-DECISIONS-SIMPLE.fa.md").write_text(
            "[details](other.md)", encoding="utf-8"
        )
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("must contain its information directly without links" in error for error in errors))

    def test_unregistered_service_folder_is_reported(self) -> None:
        (self.root / "docs/services/new-service").mkdir()
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("unregistered service documentation directory" in error for error in errors))

    def test_unknown_requirement_is_reported(self) -> None:
        (self.root / "docs/README.md").write_text(
            "Unknown requirement `TRIP-99`.", encoding="utf-8"
        )
        errors = check_docs.check_repository(self.root)
        self.assertTrue(any("unknown requirement identifier TRIP-99" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
