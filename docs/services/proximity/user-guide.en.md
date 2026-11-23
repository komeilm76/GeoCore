# Proximity and Nearby Entities — User and Operator Guide

**Delivery state:** Planned; not implemented, verified or released. This manual describes the intended product boundary and safe workflow; it is not an API contract or executable setup. Do not invent endpoints, commands, credentials or production capability from this document.

## Purpose and boundary

Find entities whose authorized locations are within a declared radius or area, normally ordered by direct distance and subject to freshness and access policy.

## Prerequisites to approve

Authorized entity/location feed, identity and recipient-level consent/authorization, freshness policy, geospatial index and limits against repeated inference.

The service must run without mandatory installation of other GeoCore services. Any selected data, engine, storage, identity, network or external provider dependency must be stated, obtainable and tested. Optional integration must have a documented standalone/degraded mode.

## User workflow (design-level; not yet executable)

Obtain purpose and authorization for both location owner and viewer; use a declared search origin/radius/area, freshness threshold and result limit; distinguish direct distance from network travel; restrict repeated probing and verify stale/unauthorized entities are omitted without revealing metadata. No production access method exists.

## Safety, data and limitations

People are hidden by default. Proximity permission is separate from live sharing and history. Denied entities, counts, pagination or timing must not leak identity or location. Direct distance is not route distance.

Use only authorized data and declared coverage. Preserve coordinate reference/axis order, units, observation versus receipt time, source/version and unknown states as specified by the eventual contract. Do not publish a quality, availability, latency, freshness or accuracy claim without an approved measurement method and evidence.

## Security and operations

Apply object- and operation-level authorization, tenant separation, least privilege, bounded inputs/resources, safe failure behavior and cache separation. Minimize sensitive logging; document retention/deletion, backup restoration, health versus readiness, version compatibility, rollback and support ownership before release. See [global security baseline](../../global/SECURITY.md), [data governance](../../global/DATA-GOVERNANCE.md) and [release gates](../../global/QUALITY-AND-RELEASE.md).

## Release acceptance and traceability

Before release, publish a versioned contract and limits; test common/boundary/empty/out-of-coverage/invalid/unauthorized/dependency-failure cases; use versioned reference data and approved thresholds; review security/privacy and Persian/English behavior; execute a clean-start quick start and recovery/rollback tests; provide a data sheet and release evidence. Requirements: `NEAR-01; SEC-01/02; REQ-P1–P5; DATA-03/04/06`.

## Version and support

No released service version or support channel exists yet. The service owner, supported environments, operational targets and release date remain open. Update this guide in English and Persian with each approved contract or behavior change.
