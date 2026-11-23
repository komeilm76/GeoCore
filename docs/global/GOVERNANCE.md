# Governance, decisions and document authority

**State:** Initial working policy, proposed for maintainer approval. It does not override law, licenses or an approved product-owner decision.

## Authority and precedence

1. Applicable law, binding data/software licenses, and security/privacy obligations are non-waivable.
2. The latest explicit product-owner decision record is the current planning direction. The uploaded Persian decision/agreements record is preserved verbatim in this repository; decisions in it supersede conflicting v1.12 draft statements for planning, but do not silently rewrite that historical scope document.
3. Product Scope v1.12 remains the versioned requirements baseline until a separately reviewed, bilingual successor is approved. Any conflict between v1.12 and a newer owner decision must be listed and reconciled in that successor before release; do not infer approval from code or a historical example.
4. An approved Architecture Decision Record (ADR) records a technical design choice within the current product direction. An ADR cannot silently relax a product requirement or owner decision.
5. Versioned service contracts, implementation, tests, and manuals must agree with the approved scope and latest decisions. A contract or code change does not supersede them without an approved change.
6. If sources conflict or an owner decision is unclear, stop the affected work, record the conflict and accountable owner, and resolve it through a dated decision. Laws, license terms and security/privacy release gates remain non-waivable.

## Status vocabulary

- **Proposed:** being considered; not approved.
- **Decided:** explicitly approved by the accountable owner; record approver, date and rationale.
- **Planned:** accepted work; not necessarily started or implemented.
- **Implemented:** code exists; does not imply acceptance or release.
- **Verified:** named tests/evidence passed in a stated environment and data version.
- **Released:** approved, versioned delivery with both language manuals and a release evidence package.
- **Deprecated/Withdrawn:** lifecycle decision with migration or removal guidance.

Use these words in docs, issue titles and release notes. Avoid unqualified claims such as “supports Iran” or “secure” without scope and evidence.

## Requirement and work-item traceability

Use the requirement IDs in the product scope (for example `TILE-01`, `REQ-P4`, `OPS-05`). Each implementation task should identify: requirement(s), owner, status, acceptance checks, dependencies, data/license assumptions, security/privacy impact, and evidence location. Each release test should point back to requirement IDs. Keep product decisions in `docs/global/ROADMAP.md` until an ADR or approved scope amendment is warranted.

## Change process

For material behavior, security, data lifecycle, API, deployment, or technology choices:

1. Describe context and the concrete decision needed; distinguish facts, assumptions and options.
2. Assess product-scope compliance, data licensing, privacy/security, operational cost, failure modes, migration and Persian/English effects.
3. Obtain the appropriate product and technical approval; obtain privacy/legal review where applicable.
4. Record the decision and status, update affected requirement traceability, contracts, tests, diagrams, and both language manuals in the same change.
5. Keep superseded decisions discoverable; do not erase history or treat an unapproved proposal as binding.

## Documentation quality gate

Each released service has version-matched English and Persian user/operations documentation, a reviewed API contract where applicable, prerequisites, data sheet/license, limitations, security and retention behavior, failure modes, examples verified against that release, and support/upgrade guidance. The same change must update both languages or explicitly block release. See [the service documentation template](SERVICE-DOCUMENTATION-TEMPLATE.md) and [release gates](QUALITY-AND-RELEASE.md).
