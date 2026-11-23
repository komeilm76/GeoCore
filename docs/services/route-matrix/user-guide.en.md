# Route Matrix and Optimization — User and Operator Guide

**Delivery state:** Planned; not implemented, verified or released. This manual describes the intended product boundary and safe workflow; it is not an API contract or executable setup. Do not invent endpoints, commands, credentials or production capability from this document.

## Purpose and boundary

Calculate directed network costs between origin and destination sets and optionally solve supported stop-order problems. Routing owns the consumer-facing multi-stop trip result.

## Prerequisites to approve

A compatible licensed network and engine; declared profile, metric, direction, network version, input limits and solver configuration.

The service must run without mandatory installation of other GeoCore services. Any selected data, engine, storage, identity, network or external provider dependency must be stated, obtainable and tested. Optional integration must have a documented standalone/degraded mode.

## User workflow (design-level; not yet executable)

Map rows and columns to the original input order; declare metric/profile/direction; inspect unavailable pairs distinctly from valid zero. For optimization, state objective and fixed constraints and inspect solve status, input mapping, cost and approximation. Limits and endpoint contract are not set.

## Safety, data and limitations

Unavailable routes are not zero. Approximate optimization is not a global-optimum guarantee. Matrix and Routing inputs must use compatible network/profile/objective versions or the combination must be rejected.

Use only authorized data and declared coverage. Preserve coordinate reference/axis order, units, observation versus receipt time, source/version and unknown states as specified by the eventual contract. Do not publish a quality, availability, latency, freshness or accuracy claim without an approved measurement method and evidence.

## Security and operations

Apply object- and operation-level authorization, tenant separation, least privilege, bounded inputs/resources, safe failure behavior and cache separation. Minimize sensitive logging; document retention/deletion, backup restoration, health versus readiness, version compatibility, rollback and support ownership before release. See [global security baseline](../../global/SECURITY.md), [data governance](../../global/DATA-GOVERNANCE.md) and [release gates](../../global/QUALITY-AND-RELEASE.md).

## Release acceptance and traceability

Before release, publish a versioned contract and limits; test common/boundary/empty/out-of-coverage/invalid/unauthorized/dependency-failure cases; use versioned reference data and approved thresholds; review security/privacy and Persian/English behavior; execute a clean-start quick start and recovery/rollback tests; provide a data sheet and release evidence. Requirements: `MATRIX-01; OPT-01; TRIP-02/05; OPS-04/05; DATA-02/03`.

## Version and support

No released service version or support channel exists yet. The service owner, supported environments, operational targets and release date remain open. Update this guide in English and Persian with each approved contract or behavior change.
