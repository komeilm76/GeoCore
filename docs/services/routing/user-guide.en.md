# Routing — User and Operator Guide

**Delivery state:** Planned; not implemented, verified or released. This manual describes the intended product boundary and safe workflow; it is not an API contract or executable setup. Do not invent endpoints, commands, credentials or production capability from this document.

## Purpose and boundary

Calculate network routes from an origin through one or more ordered destinations for car, pedestrian and bicycle profiles. The product owner requires both OSRM and Valhalla to be available and selectable by each organization in the first Routing release; this is a product direction pending feasibility verification, not evidence that either engine has been integrated. Optional time optimization is explicitly selected per request.

## Prerequisites to approve

Licensed network data, graph preparation and **both** OSRM and Valhalla configurations, with organization-level engine selection, are first-release product requirements. Test each chosen version and configuration independently against car, pedestrian and bicycle scenarios, multi-stop order/optimization requirements, licenses and operational limits. These prerequisites must be provided independently of other GeoCore services. Feasibility, data source and capability parity are not yet verified.

The service must run without mandatory installation of other GeoCore services. Any selected data, engine, storage, identity, network or external provider dependency must be stated, obtainable and tested. Optional integration must have a documented standalone/degraded mode.

## User workflow (design-level; not yet executable)

Choose the organization-configured engine (OSRM or Valhalla) and a supported profile; provide an origin and identified ordered stops; keep optimization off unless explicitly needed. If optimizing, set the time objective and fixed/free end mode. Verify each input stop occurs once in the mapped result, leg/total costs reconcile, snapped points are disclosed, and engine/network version and traffic use are stated. A dedicated return-to-origin option is excluded from the first release; unsupported options must be rejected clearly. Limits and API are undecided.

## Safety, data and limitations

An estimate is not a guarantee or safety instruction. Optimization is off by default; when enabled, choose fixed or reorderable final destination explicitly. Never accept silent stop dropping, profile substitution or fallback presented as optimized.

Use only authorized data and declared coverage. Preserve coordinate reference/axis order, units, observation versus receipt time, source/version and unknown states as specified by the eventual contract. Do not publish a quality, availability, latency, freshness or accuracy claim without an approved measurement method and evidence.

## Security and operations

Apply object- and operation-level authorization, tenant separation, least privilege, bounded inputs/resources, safe failure behavior and cache separation. Minimize sensitive logging; document retention/deletion, backup restoration, health versus readiness, version compatibility, rollback and support ownership before release. See [global security baseline](../../global/SECURITY.md), [data governance](../../global/DATA-GOVERNANCE.md) and [release gates](../../global/QUALITY-AND-RELEASE.md).

## Release acceptance and traceability

Before release, publish a versioned contract and limits; run the required capability suite separately for both OSRM and Valhalla, including car, pedestrian, bicycle, input order, both optimized end modes, unreachable stops and failures; test common/boundary/empty/out-of-coverage/invalid/unauthorized/dependency-failure cases; use versioned reference data and approved thresholds; review security/privacy and Persian/English behavior; execute a clean-start quick start and recovery/rollback tests; provide a data sheet and release evidence. Any engine gap must be resolved by an explicit owner decision before release, not silently omitted. Requirements: `MODE-01/02; TRIP-01–05; ROUTE-01; OPT-01; OPS-04/05; DATA-02/03`.

## Version and support

No released service version or support channel exists yet. The service owner, supported environments, operational targets and release date remain open. Update this guide in English and Persian with each approved contract or behavior change.
