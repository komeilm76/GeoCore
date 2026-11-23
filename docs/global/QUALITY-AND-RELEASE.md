# Quality, verification and release gates

**State:** Working release policy aligned to product scope. No numerical SLO, SLA or release date is approved here.

## Verification levels

1. **Static/unit:** deterministic logic, parsing/validation, normalization, authorization helpers and error mapping.
2. **Integration:** selected engine/storage/cache/data-source boundaries, failure handling, version compatibility and access controls.
3. **End-to-end:** documented user workflows in each declared environment and language, starting from a clean setup.
4. **Data quality:** versioned reference data with region, language, coverage and known limitations; method, labels and dates recorded.
5. **Security/privacy:** threat-driven positive and negative tests, tenant isolation, resource limits, secrets/logging, retention/deletion and restore behavior as applicable.
6. **Operational:** health versus readiness, dependency outage, rollback, recovery, capacity and performance under an approved, reproducible workload.

## Acceptance evidence

Before a capability is released, maintain a test plan linking each applicable product requirement ID to scenario, input/reference version, expected result, acceptance threshold, test environment, result, evidence location, defect and approver. Record actual measurements, not intended values. For geographic results, state source/network version and calculation time; define axis order, units, freshness and unknown values. A smoke test alone does not establish geographic accuracy, licensing compliance or security.

## Numerical targets and commitments

Product-scope targets are intentionally open until measured. Owners must approve values and methods for availability, latency percentiles, throughput/concurrency, maximum input, freshness, coverage/quality, resource use, recovery time and acceptable data loss as relevant. Define window, workload, geography, data version and exclusions. Distinguish internal SLI/SLO from contractual SLA. Do not publish unsupported percentages or performance claims.

## Release gate

A release is blocked if any of the following is missing or fails:

- Scope/requirements and the latest owner decisions for the capability are reconciled in an approved, bilingual scope version; remaining items are explicitly bounded without violating mandatory criteria.
- The first tile release meets the recorded vector-only, public/private-data and hosted/self-hosted product directions with evidence for both deployment models; validation of five focus cities is not presented as proof of nationwide uniform quality.
- The first Routing release meets the recorded requirement to offer selectable OSRM and Valhalla configurations, or a blocking feasibility result has been resolved by an approved product-scope decision before release; required car, pedestrian, bicycle, multi-stop and optimization behavior is not silently omitted.
- Legal basis, software/data rights, attribution and required approvals are documented.
- Security and privacy review and access-control tests pass; blocking findings are resolved.
- API contract and implementation match; input, empty, unavailable, out-of-coverage, forbidden, limit and dependency-failure semantics are tested.
- Required Persian/English generated text, RTL/LTR display, cache separation, and version-matched manuals pass review.
- Representative functional/data, boundary, failure, recovery and operational tests meet approved criteria.
- Deployment, prerequisites, configuration, health/readiness, rollback, support owner and known limitations are documented.
- Release evidence package, version, change notes and approval are recorded.

A conditional capability may be omitted if clearly not offered; it must not be advertised as ready. Mandatory criteria and legal/security gates cannot be bypassed through an experimental label.
