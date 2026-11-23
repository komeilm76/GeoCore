# Data governance and provenance

**State:** Baseline and proposed lifecycle. No dataset has been acquired, validated or published by this repository.

## Required data sheet

Every candidate and published dataset needs a versioned data sheet with: owner/source and source URL or acquisition method; exact license/version and attribution/share-alike duties; geographic and thematic coverage; observation/validity and acquisition times; processing/publication time; dataset and processing versions; known gaps, quality and reference method; permitted use and redistribution; derived-data considerations; contact/owner; retention and deletion requirements. Record unknown fields as unknown, never infer them.

## OSM and external sources

The product owner confirms OSM as the initial intended base source and asks the team to assess self-hosted preparation first; neither statement proves a particular acquisition method is lawful, suitable or approved. Distinguish the ODbL database license from the operational terms of public Nominatim and tile servers. Recheck current policy and licensing implications before implementation; do not use public raster tile services for bulk acquisition/offline package creation contrary to their policy. Assess attribution and share-alike effects case by case, including combinations and outputs; technical separation alone does not settle legal obligations. Obtain qualified legal review where appropriate.

The first tile-test focus is Tehran, Karaj, Tabriz, Mashhad and Isfahan; smaller towns and rural areas are deferred in the initial test sample. The product target is still all Iran, so this sample cannot support a claim of uniform nationwide coverage. Exact test extents, licensed reference datasets, acceptance scenarios and owners remain open.

## Publication lifecycle

`proposed → acquired → validated → prepared → candidate → approved → published → superseded/withdrawn`.

A transition requires recorded evidence and an accountable owner. Keep failed candidates separate from active data. Validate provenance, format, integrity, coverage, expected schema and representative quality. Publish an immutable version and retain a rollback path; data consumers must be able to identify the effective version. Define how in-flight requests and caches behave during a switch. Deletion and license termination requirements apply to active data, derivatives, caches and backups.

## Quality and update cadence

The scope calls for a configurable weekly default check/update capability; this is not a claim that data changes weekly or that an update is automatically fit to publish. Report source observation time separately from download, processing and publication time. Compare quality and coverage against versioned regional reference sets; unknown and absent values are not zero. Define and approve freshness, coverage, resource and update objectives before release.

## Dataset release checklist

- [ ] Source, scope, license, attribution and redistribution rights reviewed.
- [ ] Data sheet complete and versioned; provenance retained.
- [ ] Integrity/schema/geographic validation passed; failures quarantined.
- [ ] Coverage and quality checked against approved versioned reference data.
- [ ] Product compatibility (tile layers/style/fonts or relevant consumer) verified.
- [ ] Security, tenant separation and cache implications assessed.
- [ ] Publication, rollback, deletion, retention and backup behavior tested.
- [ ] English and Persian operator/user impact documented.

Trace to `REQ-D1`–`REQ-D6`, `MANAGE-01`, `TILE-01` and `OPS-05` in the product scope.
