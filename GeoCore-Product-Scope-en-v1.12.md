# GeoCore — Product Scope and Requirements

**Version:** 1.12 proposed  
**Review date:** 15 November 2026  
**Status:** Revised draft; the decisions recorded in Section 8.1 are based on the product owner's choices, and the remaining open items still require decisions and approval  
**Document purpose:** Define the scope, responsibilities, requirements and acceptance criteria at the product level; not the architecture, database design, precise API format or a definitive release plan.

> **How to read this document:** “Must” states a requirement for a capability or service **if it is offered**, not a declaration that it has been implemented or a commitment to release it in the first version. Persian and English are required languages for the product and documentation of released versions. Multi-destination routing, the option to optimize the order, storage and retrieval of history, and live location sharing for a specified duration or without an end time are product-scope requirements; optimization is selected by the consumer for each request. Elsewhere, “conditional” means that offering a capability depends on a product decision, data, licensing or technical assessment. Undetermined numerical targets are not an SLA or an existing capability.

## Quick Guide and Key Decisions

This document describes scope and requirements; it is not a report that the software is complete. All services must be documented, but implementation will be incremental. “Requested,” “designed” and “released” are distinct states; this document alone does not establish that any of them has been achieved.

| Topic | Explicit decision |
|---|---|
| Market and data | All of Iran is the initial target; OpenStreetMap is the initial source, and actual quality depends on data coverage and testing. |
| Starting point | Vector tile service first, then routing; both self-hosted and hosted models are in scope, but the release date of each is unspecified. |
| Language | Persian and English support for all product text and published documentation; English is the default after explicit preferences. |
| Trip | Car, pedestrian and bicycle are required in the first routing release. Input order is preserved unless the user explicitly selects time optimization and the status of the final destination; public transport is conditional on feasibility and data. |
| History recording | Automatic at trip start with authorization and a legal basis; organizational policy applies, or, in its absence, access is available for up to seven days after the end. Once ended, trip history does not change and late data is not added; locally held points that were not accepted are deleted at the first opportunity. |
| Inactivity and interruption | A 24-hour stop supported by sufficient data can end recording; absence of location for 24 hours is not assumed to be a stop and starts a further 24-hour confirmation period. |
| Live sharing | Time-limited or without an end time, only when explicitly started; a recipient may be an authorized account or the holder of a guest link. A link password is optional. |
| Background operation and Internet interruption | Web, Android and iOS are target environments; background acquisition is required in compatible, authorized environments. Storage and later transmission during an outage are optional, and data is not added to closed trip history after the trip ends. |
| Quality and performance | Numerical targets are set after practical testing and before each capability is released; an unagreed number is not an SLA. |

**Reading path:** Section 3 describes each service's responsibilities and acceptance; Section 7 covers common rules and tests; Section 8 records decisions; and Section 9 lists remaining decisions. If a historical example conflicts with an amended requirement, the current requirement in Section 3 and the decisions in Section 8 prevail.

## 1. Introduction, Purpose and Scope

GeoCore is a collection of infrastructure services and tools for building, running and managing map-based software. Its primary consumers are developers, organizations with geospatial data and providers of location-based products.

The product aims to provide reliable access to geospatial data and capabilities, emphasizing deployment independence, security, data quality, professional and equivalent support for Persian and English, responsible use of resources and developer experience. Services may use standard data sources or infrastructure and, when configured, work together.

**In scope:** The services in Section 3, the SDK and management tool in Section 5, and the common rules in Section 7, according to the release decisions for each version.

**Outside the scope of this document:** Internal design and final engine selection for each service, storage schema, exact request and response contract, business model and pricing, a commitment to support all countries and languages, and a commitment to provide live traffic or offline navigation. Each requires a separate decision or document.

**Important limitation:** The correctness and coverage of map and address data, as well as the accuracy of routes, warnings and ETAs, depend on the source, license, quality and freshness of data; estimates must not be presented as certain. The product is not a substitute for signs, local laws, driver judgment or safety-critical systems.

## 2. Principles and Terminology

### 2.1. Operational Independence

- Each service must have a clear responsibility and be deployable and usable without mandatory installation or operation of **other GeoCore services**. Independence does not mean that data, specialized engines, databases or other operational prerequisites are unnecessary.
- Each service's mandatory prerequisites, including its data source and runtime components, must be explicit in its documentation and obtainable. Starting and running the Manager or SDK is not mandatory for direct use of a service.
- Cooperation between GeoCore services is optional; each service must be able to obtain the input it needs from one or more suitable options among local data, consumer input or a configurable compatible source. Support for all three methods is not required. Operation without integration and the capabilities lost in that mode must be clear.
- In this document, a “service” is a product responsibility boundary; it does not require a separate repository, process, container or technology for every capability. The deployment method must be determined in a separate design.

### 2.2. Shared Terminology

- **Base data:** A reference dataset with a specified source, scope, license and version. **Proprietary data:** Data or changes belonging to a consumer that can be distinguished from the base; technical separation alone does not guarantee license compliance.
- **Coverage:** The geographical and subject-matter extent for which data or a capability is offered; lack of coverage is not the same as an empty result.
- **Freshness:** The time of observation or validity of data relative to its time of use; it is not the same as processing or publication time.
- **Direct distance:** The geographic distance between points; **network distance:** the length of a traversable route on the network. The two must not be substituted for each other without explanation.
- **ETA:** Estimated time of arrival based on the location, route and data available at calculation time; it is not a guarantee of the actual arrival time.
- **Planned trip:** A request for and result of a route between an origin and destinations. **Recorded trip:** A collection of actual location observations over a trip interval; it may be associated with a plan but is not the plan itself. A “trip” does not necessarily mean an entity stored by Routing.
- **Destination or stop:** A point to be visited on the trip; every input has its own identity or position, even if coordinates are duplicated. **Leg:** The portion of a route between two consecutive points in the final order; when returning to the origin, the return leg is also included in the result.

## 3. Service Catalogue and Responsibility Boundaries

The following catalogue defines the target scope, not simultaneous completion of all services. All 13 services must be documented, and their implementation can proceed incrementally; vector tiles are the first service to start with, followed in priority by routing. Multi-destination routing with the option to optimize the order, recording and retrieval of history of the route actually traveled, and live location sharing for a set duration or without an end time are explicit product requirements. Their release dates have not yet been approved; no version that announces these capabilities may be released without meeting the relevant criteria. Other capabilities will be offered after coverage, data and acceptance criteria have been determined.

### 3.1. Map Tile Service — Map Tile Delivery

**Responsibility:** Provide map data as vector or raster tiles to web consumers and other compatible clients.

- Provide tiles at supported zoom levels and within supported data coverage; offered styles and display resources must be compatible with the data and support selection of Persian and English labels in accordance with I18N-09. A weekly default update, configurable and using permitted input, must be possible; use of prepared data or an independent processing tool must not make installation of the GeoCore data management service mandatory.
- State tile type, numbering scheme, coverage, zoom levels, data version and terms of use; for vector tiles, style compatibility with data layers must also be clear.
- Support caching appropriate to the license, version and data freshness policy; prevent proprietary data from being served to unauthorized consumers through a shared cache.
- **Acceptance:** A sample client can display an available tile within the stated coverage and zoom level; empty tiles, lack of access and errors are distinguishable or documented in accordance with the contract and format limitations.

### 3.2. Geocoding Service — Addresses and Coordinates

**Responsibility:** Convert an address into one or more location candidates, and coordinates into location or address information extractable from the data.

- Search Persian and English addresses in available data and their structured components, and support reverse geocoding; support for house numbers only when the data exists and is permitted. State output language and limitations of untranslated names in accordance with Section 7.5.
- State the result type and level, such as house number, street or administrative area; an approximate result or nearest feature must not be presented as the exact address of the point.
- Handle ambiguous addresses, no result and out-of-coverage cases; state supported languages and data coverage.
- **Acceptance:** For a reference sample set, output includes candidates and a level of accuracy or result type, and ambiguous and not-found cases are returned in a distinguishable way.

### 3.3. Map Search Service — Place Search

**Responsibility:** Search names, categories and attributes of places and features, including query suggestions, filtering and restriction to a map area.

- Text and category search and sorting by relevance, distance or a stated criterion; searching in Persian and English for available names and data is mandatory. Typographical error tolerance beyond I18N-05 normalization, if offered, must be documented and tested.
- Normalize Persian and Arabic letters and numerals, spaces, half-spaces and common written forms in accordance with I18N-05; original data text must be preserved.
- **Boundary with Geocoding:** Search focuses on discovery of features and POIs; conversion between addresses and coordinates is Geocoding's responsibility. Shared data or engines are permitted, but the existence of either service must not require installation of the other.
- **Acceptance:** Reference examples for name, category and area yield verifiable results; empty results, identifiable out-of-coverage cases and errors are distinct, and unknown coverage is reported in accordance with DATA-01.

### 3.4. Routing Service — Routing and Multi-Destination Trips

**Responsibility:** Calculate a network route between an origin, one or more destinations and intermediate points, based on travel mode. Multi-destination trips are a product requirement; order optimization is an option the consumer enables or disables for each request, not a capability that can be removed from the product scope.

- **MODE-01 — Basic profiles:** In the first release of Routing, car, pedestrian and bicycle profiles must be offered and tested separately. Multi-destination routing and optional selection of time optimization must be supported for all three profiles in accordance with TRIP-01 through TRIP-05. The network, travel restrictions, coverage and quality of each profile must be reported on the basis of actual data; absence of a road or data must be reported rather than silently substituted with another profile.
- **MODE-02 — Public transport and taxis:** Support for buses, BRT, metro and taxis is a conditional goal, not a first-release commitment. Before any is offered, technical feasibility, valid and licensed data, city coverage, service calendar and times, and engine limitations must be assessed. OSM alone does not guarantee timetables or live data. GTFS Schedule can provide schedule data and GTFS Realtime a supplementary source of live data [29]; the existence of a format or engine alone does not mean Iranian data is available. If offered, route and station, departure and waiting times when available, route type, transfers, source and validity date must be reported understandably. BRT must be distinguished from ordinary buses using valid data; absence of that distinction must be reported. A taxi may follow a street route or a defined line; driver discovery, booking, a definitive fare and immediate availability are not commitments without separate decisions and data. General multi-destination optimization and mode combinations are offered only if the data and engine are validated for them.
- **Profile acceptance:** For each of the three basic profiles, test a reference route within coverage, route restrictions, no route, a multi-destination trip with and without optimization, and lack of coverage. For public transport, if offered, test service dates and hours, closure or no service, transfers, missing schedules and distinction between scheduled and live information.

- **TRIP-01 — Specified order:** A trip request contains an origin and an ordered list of one or more destinations; support for multiple destinations is mandatory. Optimization is off by default. When off, the service must include all destinations in the route in their input order and must not change that order. Ordinary routing must not depend on enabling optimization.
- **TRIP-02 — Optional optimization:** At the consumer's explicit request, calculate the order of stops with the objective of reducing **estimated travel time**. The origin is fixed, and both “fixed final destination” and “all destinations reorderable” are mandatory. When requesting optimization, the consumer must explicitly select one of these modes; if no selection is made, reject the request with understandable guidance rather than guessing. Without optimization, no such selection is required and input order is preserved. Every input destination appears exactly once in the planned stop list, even if two destinations have identical coordinates; this rule does not prohibit physically passing through the same point or repeating network edges. Return to origin, a distance objective and complex constraints such as time windows and capacity apply only when offered and supported and must not be silently ignored.
- **TRIP-03 — Traceable result:** A successful result must include the final order and a clear mapping to each destination's input position, optimization status of “not requested” or “performed,” objective and corresponding cost if performed, profile, geometry, and total and per-leg distance and estimated time. An identifier or position must distinguish duplicate destinations. If time spent at destinations is included, it must be stated separately; turn-by-turn instructions are added if offered.
- **TRIP-04 — Limits and failure:** State the maximum number of destinations, supported objectives and constraints, network version, and whether traffic is used. Clearly report points outside the network, disconnected routes, infeasible problems, unsupported objectives or constraints, timeouts and solver unavailability. No destination may be silently dropped. If optimization fails, the input order must not be presented as an optimized result; calculation without optimization is allowed only at the consumer's explicit request or with explicit consent.
- **TRIP-05 — Quality representation:** “Best” means reducing cost according to the objective, data and constraints of that request, not a guarantee of the best real-world route or a global optimum. An approximate result or one without proof of optimality must be presented with an appropriate status. To compare costs, profile, objective, network, traffic data and reference time must be compatible; the distance of the fastest route is not necessarily the cost of the shortest route. Traffic is considered only when data and actual support are available.
- Alternative routes, travel modes and other preferences are offered according to the declared capability; the distance of a faster route is not necessarily the shortest distance. Snapping an input point to the network, if performed, must be reported.
- **Independence:** Routing in input order must work without installing other GeoCore services. Optimization may use an internal capability or a configured compatible source; optimization-mode prerequisites must be documented and must not be imposed on ordinary mode.
- **Acceptance:** On a small reference network, the off mode preserves input order exactly. In the on mode, both fixed and free final-destination modes return a fixed origin, each destination exactly once in the list, a one-to-one mapping and a time cost consistent with the result; failure to select the final-destination mode produces an understandable error. Quality is measured against a reference answer and an approved criterion, without assuming an optimality guarantee. The sum of legs and total are checked with stop time and rounding rules accounted for. Duplicate destinations, unsupported constraints, unreachable points, timeouts and optimizer errors are tested without silent fallback.

### 3.5. Route Matrix & Optimization — Route Matrix and Optimization

**Responsibility:** Calculate travel costs between origins and destinations and provide an independent optimization capability. Routing owns multi-destination trip behavior and the final result; when configured, this service can provide cost or order to Routing without its installation being mandatory for Routing.

- Network time or distance matrix with profile, metric and direction stated; an unavailable route value must be explicit, not zero. In directed networks, outbound and return costs may differ.
- Optimization of the order of a multi-destination trip is a product requirement, and its use in each trip is optional. Routing may use an internal engine or compatible source; if this service is selected as the source, its prerequisites and failure behavior are documented. Each of the two services can run independently of installation of the other.
- Multi-vehicle assignment, capacity, time windows and other complex constraints are **conditional on offering a suitable solver and data**. The objective, supported constraints, problem size limits and feasible, infeasible or unsolved status must be stated.
- An approximate solution must not be presented as a guaranteed global optimum. OSRM's Trip capability alone is not equivalent to solving all multi-vehicle logistics problems [9]; fixed-point and input-count limitations in the selected engine must also be checked [14].
- **Acceptance:** A sample matrix correctly shows direction and unavailable values; single-trip optimization is tested with the objective, destination order and fixed constraints, and the solve status is clear. Complex constraints, if offered, are validated separately.

### 3.6. Map Matching — GPS Trace Matching

**Responsibility:** Match a sequence of location points to a network and estimate the likely route.

- Accept points with time and accuracy information when available; distinguish unmatched points, gaps and matchable segments.
- Present the result as an estimate and, when supported by the engine, a confidence indicator with its definition and limitations; retain the ability to distinguish raw data from processed output.
- **Acceptance:** Process a sample trace containing errors, an outlier and a gap without concealing unmatched portions or implying certainty.

### 3.7. Elevation & Terrain — Elevation and Terrain Features

**Responsibility:** Provide sampled elevations, elevation profiles and related calculations based on a licensed elevation model.

- State source, coverage, spatial resolution, date and vertical datum when available; distinguish ellipsoidal elevation from elevation relative to another vertical datum, and distinguish a terrain model from a surface model when known.
- Provide slope and elevation difference only with an explanation of method and data limitations; missing elevation data or insufficient quality must be indicated.
- **Acceptance:** Check sample elevation and profile against a reference for the same model and an approved tolerance; a point without data is not treated as having zero elevation.

### 3.8. Spatial Analysis & Geofencing — Spatial Analysis and Boundaries

**Responsibility:** Geometric operations and, if a stateful capability is offered, detection of entry and exit events.

- Support declared operations such as point containment, intersection, overlap and distance calculation; define behavior for invalid geometry, a point on a boundary, coordinate system and units.
- Create circular or polygonal boundaries with an explanation of the calculation method and limitations, particularly for large or polar regions or those crossing the antimeridian.
- Entry and exit events require a location stream, time, sample order, accuracy and state maintenance. Handling of delays, stale data, duplicates and boundary jitter must be specified in the offered capability; static geometry alone does not produce live events.
- **Acceptance:** Test points inside, outside and on the boundary, and invalid geometry; if events are offered, test entry, exit, late samples and duplicate behavior.
### 3.9. Location Tracking & ETA — Tracking, Trip History and Arrival Time

**Responsibility:** Receive and manage the location of a moving entity, store and retrieve recorded movement samples, and, if offered, provide ETA. History is an approximate representation of movement based on samples, not conclusive proof of the route between them. Recording history is a product requirement and differs from displaying live location or a planned route.

- **HIST-01 — Start and end:** An authorized consumer must be able to start and end trip recording; a trip has a stable identifier, an owner or access scope, a moving entity, a status, and start and end times. Manual pause and resume, if offered, must be distinguishable by status and time. A link to a route plan is retained if a valid reference is provided, but recording does not depend on a plan or installation of Routing.
- **HIST-02 — Samples:** An accepted valid sample includes coordinates and observation time; receipt time is also recorded, and accuracy, accuracy source and confidence level are retained when available. Time is expressed in UTC or with an explicit time-zone offset. Incomplete or invalid data is rejected or handled with a specified status according to the contract. Reconstruction order is based on observation time and a documented tie-breaking rule for equal times. Resending a sample with the same key and content within the key's validity window must not create a new record; using the same key with different content is a conflict. A planned route is not a substitute for observations.
- **HIST-03 — Retrieval:** An authorized consumer can retrieve a list of trips by time interval and trip details and points by identifier and, if needed, time interval. Order, times, detectable gaps and incomplete status must be clear. The method of paginated retrieval must be documented. A line drawn between two samples for display is not a definitive observation of the path between them.
- **HIST-04 — Matching:** Map Matching output, if requested, is an estimate and separate from raw samples; the version or processing time and unmatched points must be identified. Raw recording and retrieval do not depend on installing or running Map Matching.
- **HIST-05 — Retention and authorization:** When a trip starts, history recording starts automatically only if authorization and a valid legal basis exist. Retention duration is configurable by the organization; without a specific setting, the history of an ended trip is available to authorized persons for up to **seven days after recording ends**, after which access is cut off and deletion is performed according to law and policy. This default does not replace authorization or a legal basis. Authorized deletion or a legal requirement may end access earlier.
- **HIST-05A — Per-trip policy:** The effective retention duration is recorded when the trip starts, and changes to the organization's setting apply only to new trips; legal rights and authorized deletion are exceptions. End time, reason for ending, expiration and effective policy must be inspectable. After the trip ends, the end time and history content are not editable. The deadline for physical deletion and backup management must be determined before release. Backup restoration must not make deleted or expired data available again without authorization.
- **HIST-06 — Duplicate receipt and interruption:** The contract must state duplicate detection, key validity window, the acceptance period for late data and durability guarantees. Successful recording is confirmed only after durable storage according to the approved policy. Device storage and transmission after reconnection under DEVICE-03 through DEVICE-06 are optional and depend on a supported environment. A gap without data must not be filled with an invented line presented as a definitive route.
- **HIST-07 — Inactivity and unknown location:** The system must distinguish “meaningful movement,” “probable inactivity” and “unknown.” Detection takes coordinate uncertainty and multiple valid samples into account; small GPS fluctuations and replayed duplicate samples must not be assumed to be real movement or cause the inactivity count to restart solely for that reason; a duplicate sample alone is not new evidence of continued inactivity. A fixed radius is not set by the user or organization; the automatic method must be calibrated, versioned and tested against reference data. If sufficient valid observations exist to detect inactivity and probable stopping continues for **24 consecutive hours**, trip recording ends due to “inactivity”; this interval is configurable by the organization. The effective end time is when the threshold is reached, and the seven days or organizational duration are counted from that end. Continued inactivity must be supported by sufficient samples at acceptable time intervals; the maximum acceptable gap and how to handle it must be determined through testing before release. A larger gap or insufficient accuracy does not prove continued inactivity: the status is unknown and, if its conditions are met, HIST-08 applies. Replay of late data must not by itself cause an end to be determined retrospectively at a time after which a sample was already durably accepted; detection must be consistent with HIST-10 ordering and boundaries.
- **HIST-08 — Absence of location and confirmation:** If no new, valid, sufficiently fresh and reliable sample for movement assessment is received for **24 consecutive hours**, trip recording enters “awaiting confirmation due to lack of data”; absence of data is not proof of inactivity. The basis for this 24-hour period is the receipt time of the last sample qualifying for movement detection or, if none exists, the trip start time; after continuation is confirmed in the waiting state, the basis is reset under the rule below. A duplicate, old or insufficient-quality sample does not extend the period, even if it may be stored under a separate policy. A further **24 hours** is then available to respond; if connectivity returns within that period, the user is asked to choose whether to continue or end the trip. No new sample is accepted into trip history until continuation is confirmed; replay of samples stored on the device is governed by DEVICE-05. If continuation is confirmed before expiration, the same trip continues with a detectable gap; to avoid immediately re-entering the waiting state in the absence of a fresh sample, the basis of the new no-data period is the time continuation was confirmed and is updated when a qualifying sample is subsequently received. Confirmation of continuation alone proves neither movement nor inactivity, and the inactivity count is reassessed based on valid data. If ending is selected, the end is recorded at the time of confirmation. If no response arrives within the period, recording ends at the end of the second period with the reason “absence of data and no response”; thereafter a new trip must be started to continue movement, and the previous trip does not automatically reopen. Deadlines are checked against recorded time, not solely the timely execution of a scheduled task. Data deletion or live sharing is not changed solely because of this state. Delayed or duplicate transmission must not reopen an ended trip or change its history, even if the sample was observed before the trip ended; details are in HIST-09 and DEVICE-05.
- **HIST-09 — Immutable after end:** After a manual or automatic end, trip history content, samples and their order, and end time become fixed. No new sample or late data, even with an observation time before the end, and no correction may be added to or change that history. New recording attempts are rejected with the understandable status “trip ended”; a retry of the same previously recorded request may only return the previous result without change. Authorized deletion, enforcement of retention expiration, access restriction and recording of audit events are not prohibited and do not constitute editing trip history. Separate estimated processing such as Map Matching, if offered, is only independent output and does not overwrite closed history. Ending and sample acceptance under concurrency and delayed scheduler execution must use the common HIST-10 criteria so that no sample is added to history after the end takes effect.

- **HIST-10 — Ordering and time boundaries:** The decision criterion is trusted service time, not the device clock or the claimed observation time. For each trip, before accepting a sample, confirming continuation or manually ending it, no-data deadlines, the established inactivity threshold and effective status are checked against that same criterion and available valid evidence, and changes are applied atomically and serially; late scheduler execution must not extend a deadline. At the first deadline, the trip enters the waiting state and no new sample is accepted until continuation is confirmed; at the second deadline, automatic ending takes precedence and confirmation of continuation or new recording is rejected. In a race between manual ending and acceptance, the operation durably recorded earlier according to the contract governs; a new recording operation after the end is rejected. If automatic ending has already taken effect based on valid evidence available at the effective time, no response or new recording can keep the trip open by relying on scheduler delay. Evidence arriving later must not move an automatic end into the past before another sample was durably recorded; it neither changes a closed trip nor invalidates a previously successful recording. Safe retry of a previous recording result remains permitted under HIST-09; the exact operation boundary and service clock must be explained in a testable contract.

**Independence:** History can be received, stored and retrieved without installing Routing or Map Matching; storage, location source and permissions must be documented.

**Acceptance:** Test start and end, sample order and duplication, retrieval after restart, access control and seven-day expiration. For movement detection, examine stationary samples with GPS jitter, actual movement, poor accuracy, a single-point jump and late data. For an interruption, test both a response within the period and no response by the end of the total 48 hours; ending due to absence of data must not be treated as a physical stop. Also test that a retention-policy change affects only new trips and test backup restoration after deletion. Test samples observed before and after the end, correction requests, recording/end races, retries of previously recorded requests and authorized deletion of an ended trip under HIST-09. Test immediately before, at and after deadlines, delayed scheduler execution, continuation without a fresh sample, excessive spacing between apparently stationary samples, late evidence of inactivity, and races between recording or responses and automatic ending under HIST-10.

#### 3.9.1. User Live Location Sharing — Temporary and Without an End Time

**Scope and boundary:** This capability is part of Location Tracking, not a new independent service. The location owner can share their current location with specified, authorized accounts or through a guest link. “Live” means providing the latest valid location within a defined freshness interval, not guaranteeing continuity or zero latency. Location sharing, trip history recording and nearby-person search are three independent capabilities in terms of authorization and lifecycle; enabling one does not automatically enable the other two. Starting or ending a trip and history inactivity or interruption rules do not by themselves start or stop sharing.

- **SHARE-01 — Informed start:** Sharing is off by default and starts only through an explicit action by the location owner or an agent with valid legal and technical authority. Starting a trip, recording history, creating an account or joining an organization alone is not authorization to share. Before starting, the person concerned must be informed of the subject of the data, recipients, duration, accuracy level and consequences of stopping; compliance with notification requirements and a legal basis are prerequisites for processing [7, 23].
- **SHARE-02 — Two duration modes:** In **time-limited** mode, the start and end time or duration are specified at creation, and expiration is recorded as an absolute, inspectable time; access is cut off at expiration. In **no-end-time** mode, the user explicitly selects it, and sharing continues without a predetermined time expiration until stopped, revoked or ended under authorized conditions. Absence of an end time must not be mistakenly treated as immediate expiration or public authorization. Sharing without an end time does not mean unlimited retention of location or history.
- **SHARE-03 — Access method and scope:** Each share is associated with an owner, data scope, duration and status and has one or both of the following methods:
  - **Authorized account:** A specified person, with valid authentication and authorization, views the current location. Knowing the share identifier alone is not authorization.
  - **Guest link:** The location owner explicitly creates a revocable link. A recipient does not necessarily need an account to use it; possession of the link and, if a password is set, knowledge of the password grant viewing access within that link's scope. Anyone who obtains this information may gain access; their actual identity cannot be established from the link itself. The location is not placed in a public listing or search engine.
  - Both methods can be time-limited or without an end time. A link or authorized account alone does not grant the right to view history or discover nearby people. The owner must be able to view and control the method, duration and active recipient or link.
- **SHARE-04 — Location owner controls:** The location owner must be able to see active shares, their duration or “no end time,” authorized accounts, guest links and source status, and stop each share. Revoking an account or a link must be possible without cutting off other permissions. Holders of one shared link cannot be identified or revoked individually; separate links must be created for individual revocation. Duration changes require valid authority, and conversion from time-limited to no end time requires an explicit choice.
- **SHARE-05 — Status and transition:** Statuses must at minimum semantically distinguish `active`, `stopped`, `expired` and `revoked`: active; stopped by the owner or authorized agent; ended upon reaching expiration; and revoked due to removal of authorization or absence of the required basis. Revocation for one recipient does not necessarily stop the entire share. Source status, such as “fresh,” “stale” or “location unavailable,” is separate from sharing authorization status. An ended share must not automatically reactivate on reconnection or submission of a new location; a new share or extension requires valid authority and explicit action.
- **SHARE-06 — Freshness and presentation:** The displayed location must include observation time, freshness status and spatial accuracy when available. If a new location cannot be obtained or the freshness threshold has been exceeded, the recipient sees a stale or unavailable status, not the previous location labeled live. Receipt and observation times must not be confused. The freshness threshold, update rate and maximum latency are first measured and determined before release.
- **SHARE-07 — Enforcing stop and expiration:** Authorization is enforced on every read, new connection and event transmission over an existing connection. After confirmation of stopping or revoking a recipient, and from the moment of timed expiration, no new transmission to an unauthorized recipient may begin through any GeoCore path, including an open connection, queue or cache; confirmation of stop or revocation is issued only after the necessary controls are applied on data-serving paths. If authorization cannot be checked, access is securely cut off. A packet sent before cutoff may arrive afterward; the system cannot retrieve such data or an image, note or copy the recipient previously saved outside the system.
- **SHARE-08 — Interruption and recovery:** A network outage or device shutdown does not itself revoke a share without an end time, but stale location is not presented as live. After reconnection, system restart or backup restoration, duration and authorization status must be rechecked; an expired, stopped or revoked share must not return to active, and access remains closed if valid status cannot be verified. Queued events may be transmitted only after rechecking authorization and freshness; filling in or sending past history solely because live sharing is active is not permitted.
- **SHARE-09 — Separation of history and current data:** A live-sharing recipient has access only to authorized current data unless an independent right to history has been explicitly granted. The seven-day history policy or the organizational policy in HIST-05 applies to history data, not the duration of live-sharing authorization. Stopping sharing does not necessarily delete separately authorized history; its deletion and retention follow its own legal policy. Storage of the last location or sharing metadata to provide the capability must be minimal, protected and subject to a specified deletion or review policy.
- **SHARE-10 — Security and privacy:** Secure transmission, authorization checks at share and recipient level, separation of organizations, minimum necessary data and accuracy, and prevention of disclosure of a share's identity or existence to unauthorized persons are mandatory. Active lists, authorization-change records and management logs may also be personal data; their contents must be minimized and have a separate, specified retention period. Authorization changes, stopping and expiration must be traceable in secure reporting without recording unnecessary coordinates. Report deletion times must be determined before release. Reminders for sharing without an end time are configurable and off by default; enabling reminders does not by itself extend or end sharing.
- **SHARE-11 — Language and environment:** Controls, status messages, duration explanations and relevant warnings are provided in Persian and English. Background location acquisition is required in compatible environments under DEVICE-01 and DEVICE-02; continuity is not guaranteed after a forced app closure or operating-system restriction. Stale synchronized data must not be displayed as live.
- **SHARE-12 — Independence and dependencies:** Authorization management and location acquisition for sharing must be possible without mandatory installation of other GeoCore services such as Routing, Map Matching and Proximity. The system requires an authorized location source, authentication mechanism and necessary infrastructure; absence of any of these and its consequences must be stated in the documentation.
- **SHARE-13 — Guest-link safety:** A link is a secret usable by its holder; it must be unguessable, restricted to that share, revocable and usable only over a secure channel. A password is optional and becomes mandatory if the location owner chooses one; incorrect-password behavior, attempt limiting and link recovery or replacement methods must be specified and tested. Keys or passwords must not be recorded in logs or monitoring, and the risk of link disclosure through browser history, referrers, third-party tools and messaging previews must be reduced [26]. Before creating a link, the user must be informed that any link holder may gain access; if a password is used, it is preferable to send it through a separate channel.

**Sharing acceptance criteria:**
1. Without an active share, a user's location must not be readable by another recipient; starting with one authorized recipient and a time-limited mode correctly displays expiration time and status.
2. An explicitly indefinite share remains without automatic time-based ending after the test duration; when the location owner stops it, or the required basis is revoked, access is cut off in accordance with SHARE-07. This test does not claim an actually unlimited lifetime or unlimited data retention.
3. For two recipients, removing one cuts off only that recipient's access; the other's access continues until the share is stopped or expires. Tests with a manipulated identifier and cross-organization access confirm that unauthorized access is denied.
4. Test expiration and revocation on an open connection, new request, cache and queue, and after restart and backup restoration; unsent events are not disclosed after expiration. A copy delivered to the recipient before cutoff is considered outside the system's control.
5. Stale or unavailable data is not confused with live location; test disconnection, late sample arrival and reconnection. A recipient without history permission cannot receive history even with live-sharing permission.
6. Test Persian and English messages and controls, changing time-limited to indefinite by explicit action, guest links with and without a password, incorrect passwords, revocation of an individual link, prevention of password or token leakage in logs, and secure behavior when the system cannot check authorization. Measure performance and the propagation deadline of an authorization change against an approved metric and limit.

#### 3.9.2. Background Location Acquisition and Optional Recovery During Internet Interruption

**These are two different capabilities:** Background location acquisition for trip recording and live sharing is required in compatible environments according to the product decision. Temporary on-device storage during an Internet outage is optional and can be enabled by each consuming application or organization; disabling it must not prevent online use.

- **DEVICE-01 — Background:** In every environment GeoCore explicitly offers as compatible with background location, continued location acquisition while the application runs in the background or the screen is locked must be available when the capability is enabled and the user has given valid permission and required operating-system permissions. The OS version, client type, prerequisites, required notification and actual limitations of each environment must be documented. This requirement does not guarantee continuous operation when permission is revoked, the device is off, the battery is exhausted, the operating system restricts execution or the user force-closes the application [27, 28].
- **DEVICE-02 — Web and SDK:** A TypeScript SDK and backend alone do not create native background access. Support for each browser or mobile client must be announced separately and tested in that environment; where the browser or operating system does not allow acquisition, a stopped or restricted status must be visible rather than a claim of continuity. This clause alone does not require a particular native SDK; support methods and target environments must be chosen before release.
- **DEVICE-03 — Optional on-device recording:** In a supported environment and when enabled by the application or organization, samples acquired during an Internet outage may be stored on the device and sent later with observation time, accuracy when available, trip identifier and a stable idempotency identifier. Disabling this capability means a possible gap in history. An Internet outage alone does not prevent on-device recording where the device has the required location, permission, storage space and execution capability.
- **DEVICE-04 — Secure synchronization:** After reconnection, local samples are sent with valid identity and authorization, preserving observation time, in documented order and with the safe-retry mechanisms of HIST-02 and HIST-06. Acceptance or rejection of each sample must be distinguishable to the client; successful recording is announced only after service confirmation. Late data must not extend a live share's expiration or be published as the current location. Observation and receipt times remain separate, and a gap is filled only to the extent of accepted data.
- **DEVICE-05 — Interaction with trip end:** While the trip is open, authorized samples can be synchronized under the late-data policy. In the HIST-08 waiting state, samples are not added to history until continuation is confirmed; if continuation is confirmed before the end, authorized stored samples may be accepted while preserving times and gaps. After the end, no sample, even one observed before the end, is added to closed history. Points remaining only on the device do not constitute successful recording in server history; non-acceptance and known incompleteness of history must be clear in the client. The server cannot know about points that never arrived from the device; server unawareness must not be treated as proof that history is complete. A notice or operational status of deletion and non-acceptance is retained separately from fixed trip-history content and must not reproduce deleted coordinates. To continue, a new trip requires an authorized action, and data is not silently transferred to another trip. Once the trip's end is reliably established, local points belonging to that trip that were not accepted into server history must be deleted at the first opportunity when the application can execute and access local data; transfer to another trip or independent use is not permitted. On a powered-off, disconnected or OS-restricted device, deletion cannot be guaranteed until the first possible opportunity. Before deletion, the application creates a displayable message about deletion and possible history incompleteness; if immediate display is impossible, it displays it at the first opportunity and does not delay deletion until the message is viewed or acknowledged. If the result of a prior recording is unknown, the client may safely retry to check the result without changing history; if it cannot be resolved immediately, delete the local copy at that same first opportunity and report “recording confirmation unknown,” not definitively lost or recorded. Document the method for detecting and reporting an unknown result in the contract and tests. Within authorized limits, the client must be able to determine end or expiration status reliably; no response, deletion of server data or an access error alone is not proof of ending. A method for detection after history expiration and behavior on access revocation or account deletion must be determined and tested before release, respecting minimization, security and deletion policy; this uncertainty is not permission for unlimited local data retention.
- **DEVICE-06 — Privacy and local limits:** Local data must be limited to a specified authorization and purpose, protected against unauthorized access and deleted after confirmed transmission, authorized deletion or policy expiration. Queue capacity, local retention for open trips, behavior when storage is full, permission revocation, application deletion and deletion policy after access is lost must be determined and announced before release; deletion of unaccepted points from an ended trip is governed by DEVICE-05 and cannot be postponed by setting a general deadline. Deleted or expired data must not be restored during synchronization. No guarantee is made for data the device could not collect.
- **DEVICE-07 — Observable status:** Start, recording in progress, Internet interruption, local storage enabled or disabled, awaiting confirmation, permission or insufficient-space error, synchronization and trip end must be distinguishable to the consumer. Displayable content is provided in Persian and English. Reconnection does not reactivate an expired, stopped or revoked share; a share that remains active and authorized may resume with a valid, fresh location under SHARE-08.

**Acceptance test:** In an environment offered as compatible, lock the screen and background the application with valid permission and check location acquisition within that operating system's limitations; identify denied or revoked permission and OS restrictions without claiming continuity. Then test Internet interruption with buffering on and off, duplicate samples, reconnection before 24 hours, return in the waiting state with confirmation or rejection of continuation, and return after automatic ending and after expiration. No late sample, including one observed before the end, may be added to history after closure. Test automatic deletion of unaccepted local points at the first opportunity after reliable notice of ending; notification without waiting for user acknowledgment; application termination before deletion and restart; an unknown recording response; device return after history expiration; network error and lack of access; and prevention of transfer to another trip. Also test access control, local deletion, queue saturation and non-publication of stale samples as live.

### 3.10. Map Data Management — Map Data Management

**Responsibility:** Ingest, validate, prepare, version and publish licensed datasets for geospatial applications.

- Record source, license and attribution requirements, coverage, data and publication times, version, quality and processing status; perform initial validity and integrity checks on input.
- Enable publication of a valid version and rollback to the previous version within the supported scope, without silently replacing a usable version with invalid data.
- An offline package, if offered, must specify coverage, version, supported content, display dependencies, date and license terms. A map package alone does not imply offline search or routing support.
- **Acceptance:** A sample dataset is traceable from ingestion through publication and rollback to the previous version, preserving source and license information.

### 3.11. Proximity & Nearby Entities — Nearby Entities

**Responsibility:** Find authorized entities with locations within a defined area or radius.

- Filter and sort by direct distance unless another type is explicitly offered; specify location time, freshness criterion and result limits. Live results and proximity events depend on a data stream and stateful processing.
- People's locations are not visible to others by default. Viewing authorization, audience scope, ability to cut off access, and limited or unlimited duration must be enforceable in this service and independent of live-sharing authorization. Stale data must not be presented as current location.
- **Boundary with Geofencing and live sharing:** Proximity focuses on finding entities relative to a location or area; geometric rules and entry/exit events belong to spatial analysis. Live sharing with a specified recipient does not necessarily authorize discovery in Nearby; presence in Nearby does not grant live-sharing or history permission either. Shared infrastructure is optional.
- **Acceptance:** An unauthorized entity or one with an expired location is not shown in ordinary results; distance, units and ordering of sample results are checked.

### 3.12. Traffic — Traffic Information

**Responsibility:** Provide traffic data and road events from licensed sources within specified coverage and time periods.

- Speed or flow status, incidents, closures and historical data are offered only when a suitable source is available; a routing engine or OSM data alone does not imply live traffic availability.
- State source, observation or validity time, publication time, coverage and method of expressing quality or confidence when available; distinguish “unknown” from “free-flowing.” An expired event must not be offered as current.
- **Acceptance:** Fresh, stale and unavailable data and expired events are distinguishable in samples; the consumer can determine whether traffic was used in a result.

### 3.13. Map Customization — Proprietary Map Changes

**Responsibility:** Manage project- or organization-specific changes and layers without directly rewriting base data.

- Add features, change attributes, hide items visually and add proprietary layers, with separation of ownership and access levels; maintain versions and history and enable rollback in the offered capability.
- Define the order in which changes are applied and behavior on conflicts with a new base version. “Hidden in display” does not mean deletion from the base source, search results or routing graph; the effect on each consumer must be stated separately.
- Licensing for use and publication of combined base and proprietary data must be assessed independently of apparent separation [3].
- **Acceptance:** One consumer's changes must not be visible to or affect another consumer or the base source unless authorized; a version can be restored and a sample conflict detected.
## 4. Capabilities Not Currently Defined as Independent Services

| Capability | Proposed location | Condition and boundary |
|---|---|---|
| Speed cameras and other traffic-control features | Feature dataset consumed by a map or navigation capability | Coverage and correctness are not guaranteed; display or warnings depend on local law and product policy. A speed-camera tag is not the same as a speed limit [12]. |
| House number | Address data and Geocoding | Conditional on availability, quality and licensing of data. |
| POIs such as shops and hospitals | Geospatial data, search and map display | Currency and categorization depend on the source. |
| Voice guidance | Routing instruction output and optional SDK or client capability | Playback and timing depend on the platform and supported language; Routing does not necessarily generate audio files. |
| Turn, off-route and event alerts | Optional SDK or client capability with necessary data | Requires location and suitable rules; rerouting requires a compatible routing engine or service. |

**Rule:** A different type of data or a separate API is not sufficient for service independence. Responsibility, data lifecycle, consumers, operational needs, costs and privacy must justify separation.

## 5. Development and Management Tools

### 5.1. GeoCore SDK

An official TypeScript SDK for selective use of services in declared environments, with typed access, error handling and practical examples. Necessary integration with background acquisition in compatible environments and optional retransmission mechanisms under DEVICE-01 through DEVICE-07 must be documented and tested in offered environments. Integration with MapLibre and map or navigation tools comprises optional modules; support for browsers, Node.js, Bun, mobile or any other environment must be separately declared and tested in each release. A TypeScript library is not itself a native Android or iOS SDK.

- Use of one capability must not require installation, configuration or access to all services.
- A secret server key must not be distributed in client code; each environment's secure authentication method must be documented.
- **Acceptance:** Using documented Persian and English examples, a developer can call only one selected service from a supported environment and receive a stable code and understandable error explanation in the selected language.

### 5.2. GeoCore Manager

An optional tool to simplify installation, configuration, operation and monitoring of selected services in supported environments.

Target capabilities, subject to release decisions: selection of services and prerequisites, environment configuration, version and update management, viewing status and errors, troubleshooting guidance, and backup and restoration of settings and data managed by the tool. Backup coverage, version compatibility and restoration limitations must be specified and restoration tested; backup of external sources or all data is not assumed.

**Acceptance:** Installation and startup of one selected service using Manager documentation, as well as use of that service without Manager, must be possible. Offered management capabilities are protected by appropriate access roles.

## 6. Candidate Technologies and Selection Rules

| Area | Preferred option or direction | Decision constraint |
|---|---|---|
| Software development | TypeScript with Strict settings | Appropriate for new code; specialized tools and engines are not necessarily TypeScript. |
| Runtime | Bun preferred | Library, tooling and operational environment compatibility must be tested before selection; exceptions must be documented. |
| Packages and testing | pnpm and Vitest | Supplementary tools for testing non-TypeScript components are allowed. |
| API description | OpenAPI; Swagger UI as a documentation option | Version and contract coverage of each service must be stated. |
| Web display | MapLibre GL JS and the MapLibre style specification | Practical compatibility of style, fonts, resources and tile format must be checked. |
| Data and storage | OpenStreetMap and other licensed sources; PostgreSQL/PostGIS if needed | The license, coverage, cost and quality of each dataset must be assessed separately. |
| Temporary or live data | Redis if needed | A mandatory service dependency, if any, must be stated. |
| Processing | Osmium and GDAL among the options | Selection depends on format, coverage and testing. |
| Routing and matching | OSRM or Valhalla among the options | Each capability, profile and limitation must be tested in the selected version and configuration; traffic requires separate data. |
| Search | Photon or OpenSearch among the options | Functionality, language and quality must be measured with actual data and configuration; the two must not be assumed to be fully equivalent substitutes. |
| Packaging | Docker | Data and resource prerequisites and supported environments must be documented. |

Final selection must be based on assessment of maturity, software and data licensing, compatibility, measured performance, resource consumption, security, operational cost and maintenance. Naming a tool in the table does not constitute a commitment to select it or an assertion of default capability.

## 7. Shared and Assessable Requirements

### 7.1. Data, Coordinates and Quality

- **REQ-D1:** Every published dataset must have a data sheet including source, license, geographic coverage, version, data time if known, publication time and known limitations. Missing information is recorded as “unknown.”
- **REQ-D2:** In RFC 7946-compliant GeoJSON, WGS 84 horizontal coordinates are in degrees and ordered `[longitude, latitude]`; the optional third component is elevation in meters relative to the WGS 84 ellipsoid. Elevation data with another vertical datum must not be represented as that component without a valid conversion. Other formats and APIs must explicitly state the coordinate system, axis order, units and vertical datum for elevation [1].
- **REQ-D3:** Each service must provide distance, time and other quantities with clear units and meaning. Definitions of rounding, valid range, unknown values and the distinction between estimates and measurements must be documented.
- **REQ-D4:** A coverage and quality assessment method must be developed using representative, versioned reference data, broken down by region, language and scenario; an accuracy percentage without defined sample, method and date is not valid.
- **REQ-D5:** Attribution of sources must be possible and documented in output or the consumer display path in accordance with the license. The effects of ODbL share-alike on publication or public use and combination of data must be assessed case by case; all outputs or all proprietary data must not automatically be treated alike [3, 4].
- **REQ-D6:** A public service's usage policy differs from the license of the data itself. For a production product, the data source and service must have licensing, capacity and reliability appropriate to the application. Public OSM services may be used only within each service's policy; if the application or load is incompatible, use a self-hosted option or an authorized provider [5, 6]. Under its reference policy, the public Nominatim service is not permitted for autocomplete, and its limit is one request per second for the entire application, not per user; other restrictions must also be observed [5]. Bulk downloading and creating offline packages from the public OSM raster tile server are not permitted; use another authorized source for offline use [6]. Policies must be reviewed at implementation time.

### 7.2. Security and Privacy

- **REQ-P1:** Authentication and authorization must be specified in proportion to sensitivity and deployment environment; each consumer's data and changes must be separated from others, and default access to personal location must be restricted.
- **REQ-P2:** Processing purpose, data-responsibility roles, appropriate legal basis, retention duration and deletion or review process must be determined before personal data is processed. Consent is only one possible basis and, where required or selected, must be demonstrable and revocable; the consequences of revocation and stopping sharing must be specified.
- **REQ-P3:** Collect the minimum necessary data and accuracy; include location history, logs, outputs, cache and backups in retention and deletion policy. Manage deletion from backups under documented policy and legal restrictions; after backup restoration, reapply necessary deletions and expirations so deleted data does not return without authorization.
- **REQ-P4:** Encryption in transit and protection of stored data proportionate to risk, secure secret management, logging of access events and vulnerability management are mandatory. Logs must not by default contain precise coordinates or unnecessary secrets.
- **REQ-P5:** In applicable jurisdictions, including GDPR where applicable, assess legal obligations, individual rights, processing agreements, international transfers and, where necessary, data protection impact assessments [7]. This document is not legal advice.
- **Acceptance test:** Attempts at cross-consumer access, revocation of sharing access, and deletion or expiration of data under the approved policy must be tested and results recorded.

### 7.3. API and Developer Experience

- **REQ-A1:** Each API-oriented service must have an OpenAPI contract and executable examples consistent with the released version; capabilities, valid input, limitations and prerequisites must be stated.
- **REQ-A2:** Empty results, unavailable data or coverage, invalid input, lack of authorization, consumption limits and internal errors must be semantically distinguishable and documented. Errors must not disclose sensitive information.
- **REQ-A3:** Versioning and compatibility policy, announcement of breaking changes and version support periods must be defined before release. Request limits, input size and consumption limits must be stated and enforced.
- **REQ-A4:** Installation, configuration, independent operation, sample data, quick start and troubleshooting of common errors must be documented for each service. A disabled capability or optional dependency must not be presented as a ready capability.
- **REQ-A5:** OGC API Features and Tiles and the MapLibre specifications are interoperability references. Conformance to a standard may be claimed only if a specific part is selected and the relevant tests are passed [2, 8].
- **Acceptance test:** Run the quick-start example from scratch in a supported environment and check outputs and errors against that version's contract.

### 7.4. Reliability, Operations and Software Quality

- **REQ-O1:** Each service must be runnable in containerized form in declared environments, and its development and production methods, configuration, dependencies and required resources must be documented.
- **REQ-O2:** Health and readiness, traceable logs and operational metrics appropriate to the service must be provided; absence of required data or dependencies must be distinguishable from apparent process health.
- **REQ-O3:** Before each service is released, product and operations owners must set measurable targets for availability, latency, capacity, resource consumption, data freshness, recovery time and amount of data that may be lost. Measurement method, time window, load, region, data version and exceptions must be documented. Until then, no number is an SLA.
- **REQ-O4:** Unit, integration and end-to-end tests proportionate to risk, including boundaries, dependency failure, stale data and access control, must be run. Use representative, versioned reference datasets for location and routes.
- **REQ-O5:** The upgrade, rollback and recovery path for data and configuration of released components must be documented and tested against approved objectives; mandatory dependency status and degraded modes must be clear.
- **Acceptance test:** Release decisions review version test reports, failure and recovery test results, and performance measurements under agreed load.
### 7.5. Persian and English Requirements and Internationalization

**Principle:** Persian (`fa`) and English (`en`) are the product's primary languages, not an additional feature. In each released service or tool, all GeoCore-generated text presented to people must be provided in both languages; this includes messages, errors, capability names, notifications and navigation instructions that are offered, the Manager interface, and documentation. A response without human-readable text, such as a numeric matrix, does not require translation of numeric content. Technical support for both languages differs from the availability of translated names in source data.

- **I18N-01 — Language selection:** All points where generated text can be selected must support explicit selection of `fa` and `en`. Language tags, if provided, follow BCP 47 [15]; support for regional variants must be declared separately. Language selection precedence: the request's explicit option, then the client's preferred language declared through a documented mechanism, then default English (`en`). The default language and behavior for an invalid or unsupported tag must be documented; an invalid explicit request must not be silently converted to another language. If no acceptable language is available among the client's preferences, rejection or fallback behavior and the actual response language must be specified; a weight of zero means that language is unacceptable [19]. In HTTP, if `Accept-Language` is used, precedence and weights must conform to the documented behavior.
- **I18N-02 — Actual content language:** For each data text that may differ from the selected language, structured formats must let the consumer identify the actual language or “unknown” and fallback status; for images or formats where per-label metadata is impossible, the fallback policy and identification limitation must be stated in style or dataset metadata. By default, return the requested name if available, then an available local name with its actual language tag or unknown, and if neither exists return an unavailable value. A local name must not be presented as a Persian or English translation; `int_name` is not necessarily English either [18]. The fallback order proposed by this clause must be applied and documented in the service contract; other options are permitted only when explicitly selected and if offered.
- **I18N-03 — Generated text versus source data:** Messages, GeoCore-owned categories and instruction text must be offered in both languages with equivalent meaning and a common terminology. Names of people and places, addresses and information entered by consumers are considered translated only when a valid name in the requested language is available. Transliteration or machine translation, if offered, must be separately identified as generated text; it must not be assumed to be an official or verified name.
- **I18N-04 — Contract and format:** Error codes, identifiers, technical key names, contract values, coordinates and numerical values remain language-independent and stable; explanatory error text is provided in the selected language. Machine-readable JSON numbers use digits and a decimal point according to JSON rules, without thousands separators; human display formatting may be localized. Machine-readable time must have an explicit time zone; calendar and time-zone conversion for display depends on configuration and declared capability. `fa` alone does not imply the Solar Hijri calendar, Tehran time zone or a particular local unit.
- **I18N-05 — Persian and search:** Search and Geocoding must support Persian and English expressions in searchable data in the corresponding language. For Persian search comparison, at minimum the common forms `ي` and `ی`, `ك` and `ک`, Persian, Arabic-Indic and Latin numerals, and common forms of spaces and half-spaces must be handled according to documented and tested rules. This equivalence is for indexing or comparison and does not destroy or rewrite original text, identifiers or input data. Normalization must not imply that all words are identical or unconditionally remove meaningful characters [16]. For English, case and extra-space behavior must be specified.
- **I18N-06 — Writing and display:** The Persian interface is right-to-left and the English interface left-to-right. In mixed text, directional values such as English names, coordinates, URLs, code and identifiers must display without reversal and be correctly copyable. In HTML, language and direction are specified separately and inserted text with a different direction is appropriately isolated [17]. Fonts, Persian shaping, half-spaces, punctuation and map-label readability must be tested in supported environments.
- **I18N-07 — Cache:** Every response that varies by language must be separated in cache by language and other relevant factors; a Persian response must not be served from an English cache or vice versa. For cacheable HTTP responses that vary by `Accept-Language`, use `Vary: Accept-Language` and other appropriate rules and test cache separation; private data must not be placed in a shared cache solely in reliance on Vary [19].
- **I18N-08 — Translation and documentation:** For each releasable version, Persian and English documentation, including quick start, installation, configuration, API reference, request and response examples, error and security guidance, limitations, changes and upgrade guidance, must match the version, be semantically equivalent and be available in the same release. Examples must run against that version and terminology be reviewed against a shared glossary. Technical text and translations must undergo human and technical review before release; unreviewed machine translation is not an acceptance criterion. This scope document is currently in Persian; the translation requirement applies to released product documentation, and an English version of this document must be prepared and version-aligned before its formal publication.
- **I18N-09 — Map and route instructions:** Map styles offered by the product must support Persian and English label-language selection and the I18N-02 fallback policy; tile preparation, style and font resources must be mutually compatible. Text route instructions, if offered, must have equivalent meaning, direction and order in both languages. Voice guidance, if offered, must cover Persian and English and state supported regional variants and environments; no commitment to a human voice or particular speech engine is created.

**Language acceptance test:** For each released capability with human-readable text, check the complete product message inventory in both languages for translation availability, matching keys and placeholder parameters, and equivalent meaning; also run at least one success and one error scenario in both languages. Identifiers and error codes remain stable. Test at minimum “کیان/كيان” with Persian and Arabic forms of kaf and ye, digits `۱۲۳`, `١٢٣` and `123`, “می‌رود/می رود” with a half-space and space, mixed Persian text with a URL and coordinates, a name without translation, an invalid language, and cached responses in two languages. Result-ranking quality and name coverage are measured separately using reference data for each language; merely returning a result does not demonstrate sufficient accuracy.

### 7.6. Common Data, Output and Error Behavior

- **DATA-01 — Result status:** “Success with results,” “success without results,” “known out of coverage,” “unavailable or stale data,” “invalid request,” “access denied” and “dependency or processing error” must be distinguishable in the contract, except where distinguishing access denial from the existence or nonexistence of an object would disclose information; in that case concealment is permitted under SEC-01 and Section 7.10. If the service cannot reliably identify out-of-coverage status, report unknown status or an empty result with a limitation; a falsely definitive determination is not permitted.
- **DATA-02 — Reproducibility:** For outputs dependent on map data or a model, the data version or dataset identifier used and calculation time must be accessible in the response or metadata. If traffic or external data is used, the effective source and freshness must be stated to the extent information is available. This information alone does not guarantee exact reproduction of output; other influencing factors must be documented.
- **DATA-03 — Input and units:** Validate latitude and longitude ranges, geometry, axis order, time interval and units. In GeoCore machine-readable responses, distance and duration are in meters and seconds respectively, unless the format or contract explicitly specifies other units. Elevation units and vertical datum must be stated under REQ-D2; unknown values are represented by an explicit unavailable value, not zero.
- **DATA-04 — Time:** Observation, receipt, processing and publication times, where present, are recorded with distinct meanings. Machine-readable times are exchanged in UTC or with an explicit time-zone offset, and their exact format is documented. Data newer by receipt time is not necessarily a newer observation.
- **DATA-05 — Large outputs:** Maximum size, element count, processing time and paginated retrieval method must be stated for each relevant capability. An incomplete result must not be presented as complete; errors or continuation indicators and result scope must be distinguishable.
- **DATA-06 — Access and cache:** Access control must be applied before sensitive results or metadata are disclosed and preserved in cached responses. The cache key must include all relevant factors, including authorization, proprietary data, language, version and parameters where applicable. Expiration or invalidation policy after data changes or access revocation must be specified.

### 7.7. Supplementary Service Specifications and Acceptance Criteria

This section refines the requirements in Section 3 and does not by itself convert a conditional capability into a mandatory one. Wherever “if offered” appears, all listed behaviors are required for that offered capability. Numerical limits and reference datasets must be approved before release.

#### Map Tiles
- **TILE-01:** For each tile set, coverage, minimum and maximum zoom, format, numbering scheme, version, source and license must be specified. Offered styles, fonts and required resources must be compatible with the layers of that version.
- **TILE-02:** The distinction between a valid empty tile, an out-of-coverage tile, lack of authorization and a source error must be distinguishable or documented according to format and contract limitations. Private data must not be disclosed in a response or public cache.
- **Acceptance:** Display areas and zoom levels inside and outside coverage; test Persian and English styles, fonts and non-leakage of proprietary tiles belonging to two consumers.

#### Addresses and Search
- **GEO-01:** Each address candidate must, to the extent available, include coordinates, result type or level, extractable components, name language, origin and approximate status. A missing house number or exact address must not be filled with zero or an invented value; reverse geocoding may return the nearest feature, whose type must be identified.
- **SEARCH-01:** Search must use supported query, category and area. The difference between “restricted to area” and “area preference” must be clear; result ordering, output limit and continuation, if offered, must be documented. Ambiguity is addressed with a list of candidates, not a claim of certainty.
- **Acceptance:** Test Persian and English reference data including translated names, an untranslated local name, multiple candidates with the same name, present and missing house numbers, a query with no result and an area without coverage; use I18N-05 for written-form matching.

#### Routing, Matrix and Optimization
- **ROUTE-01:** State profile and objective, stop order, network version, input coordinates and corresponding point on the network if snapped, and per-leg and total distance and duration. Reject an unsupported option rather than silently ignoring it. Driving duration and stop time, if included, must be distinguishable.
- **MATRIX-01:** Map rows to input origins and columns to input destinations; preserve input order, units, profile and objective. Mark an unreachable pair with a status or unavailable value. A valid zero, such as an origin-to-itself route under appropriate conditions, is distinct from an unavailable value. A returned distance must identify which route it measures; for example, the distance of the fastest route is not assumed to equal the shortest network distance [9].
- **OPT-01:** An optimization result must include at least order, mapping to input, objective, cost, assumptions, solve status and applied constraints. In approximate mode, proof of optimality must not be claimed. Failure to solve due to a deadline and proven infeasibility must be distinguished; if this cannot be determined, report unknown status. The quality metric and solve-time limit must be determined before release.
- **Acceptance:** Test TRIP-01 through TRIP-05, an asymmetric matrix with one unreachable pair, an origin-to-itself route, ordering of duplicate destinations, and a case where the faster route is not shortest by length. Record inputs, network version, objective and expected test result.

#### Matching, Elevation and Spatial Analysis
- **MATCH-01:** Matching must identify the relationship between input points and result, removed or unmatched points, separated segments and the method of expressing confidence, if any. The result must be an estimate and usable on supplied input without requiring the history service.
- **TERRAIN-01:** Elevation-model details include source, model type if known, vertical datum, resolution and coverage. Document sampling, profile and slope calculation methods and the effect of points without data; output without data is not converted to zero.
- **SPATIAL-01:** For each operation, define acceptable geometry type, coordinate system, distance units and behavior for invalid geometry and a point on the boundary. For large or polar areas or those crossing the antimeridian, provide either a correct method or an explicit limitation. For events, specify initial state, noise and late-data rules, event duplication and delivery guarantees or their absence.
- **Acceptance:** Test a GPS trace with an outlier and gap, elevation samples inside and outside coverage, points inside/outside/on the boundary and invalid geometry against reference data; where events are offered, test delay and duplication as well.

#### Tracking, History and Nearby Entities
- **TRACK-01:** Distinguish fresh and stale locations based on observation time and an approved threshold; receipt time alone is not a freshness criterion. Recording and reading history follow HIST-01 through HIST-10, live sharing SHARE-01 through SHARE-13, and background operation and optional buffering DEVICE-01 through DEVICE-07. ETA, if offered, includes calculation time, method and effective inputs.
- **NEAR-01:** Default distance is direct distance; state search location, radius or area, units, result limit and freshness threshold. Check authorization before returning an entity, count or metadata that discloses identity. Define pagination and ordering of ties, if offered.
- **Acceptance:** Test two consumers and two entities with different access levels, fresh and expired data, duplicate and late samples, ended trips, deletion, restart and backup restoration. Also run the time-limited, no-end-time and access-cutoff tests in Section 3.9.1. Unauthorized output must not reveal an entity's location or identity.

#### Data, Traffic and Customization
- **MANAGE-01:** OSM data update checks default to weekly and are configurable; no change, retrieval failure, validation failure and successful publication are recorded separately. A new version is published only after validation, and the previous valid version remains available on failure. Data publication must be accompanied by a data sheet, validation and a traceable result; an invalid version must not replace the active version. An offline package, if offered, has specified content, version, coverage, license and date.
- **TRAFFIC-01:** Specify source and observation or validity time, coverage and freshness status. Unknown or expired status is not equivalent to free-flowing traffic. If a consumer uses traffic, the type and freshness of the effective data must be inspectable.
- **CUSTOM-01:** Every change must be associated with its owner and version; addition, editing and hiding are distinct. Handling of base-version changes and the effects of changes on tiles, search and routing must be stated for each use; visual hiding does not mean deletion from search or the graph.
- **Acceptance:** Test publication of a valid dataset and rejection of an invalid one, version rollback, stale traffic data, proprietary changes of two consumers and conflict between a change and base data.

### 7.8. Behavioral Examples and Expectation Boundaries

These examples are not an exact API contract; values and names are hypothetical.

1. **Trip in user-specified order:** Origin `A` and destinations `[B, C, D]`, with optimization off, are calculated in order `A → B → C → D`. Legs, distance and duration of each leg, and totals are provided; if `C` is unreachable, a complete successful result with it removed from the list is not reported.
2. **Trip with optimization:** For the same input, if the supported objective is “time” and the final destination is fixed, the result may be `A → C → B → D`. The result must specify each destination's mapping to input, cost, objective and approximate or proven status. This order is only an example and does not guarantee it is best in every network.
3. **Untranslated name:** If a Persian name exists and the English name of the same place is absent from the source, an English request may return the local name under I18N-02 with its actual or unknown language and fallback status; it must not claim that name is an English translation.
4. **History and connection interruption:** After recording points at 10:00 and 10:10, the service can report only received observations and any gap detectable under the approved rule. A connecting line between two points is not a definitively observed route. If a sample arrives later, while the trip is open its acceptance is subject to the late-data policy; after the end, accepting it for that trip is prohibited.
5. **Unknown traffic:** Absence of traffic data for a road does not mean it is free-flowing. Route calculation must identify that traffic was not used or was unavailable for a portion, provided the engine can report this status; otherwise the limitation is stated.
6. **Live sharing:** A person can create a one-hour or no-end-time share for a recipient. The one-hour mode is cut off at the recorded expiration time; the second continues until stopped or valid authorization is revoked. If the device is off, the last point is displayed as stale after the freshness threshold passes. The one-hour value is merely an example, not a product default or limit.

### 7.9. Assessment, Numerical Criteria and Release Evidence

- **QA-01:** For each released capability, before release record the scenario list, reference data and its version, expected result, acceptance criterion, approver and test report. Reference sets must cover common, boundary and error cases, Persian and English, target areas and data limitations.
- **QA-02:** For each service, as applicable, approve numerical criteria and calculation methods: data coverage and freshness; search and Geocoding quality in each language; route correctness and optimized-order quality; history accuracy and gaps; availability, latency, throughput, resource consumption and recovery objectives. Use an independent, valid reference for addresses or routing and record its limitations. Do not invent a sample number or SLA without testing and approval.
- **QA-03:** Search measurement must record at least the query set, relevance of reference results, ranking metric, number of results examined, handling of untranslated names and breakdown by language and region. In routing, the reference must specify network direction, access restrictions, objective and reference time. For optimization, result cost must be comparable with the reference and quality reported against an approved threshold.
- **QA-04:** At release, review execution reports for Section 3 criteria and this document's identifiers, security and access results, translation and documentation quality control in both languages, data sheets and recovery tests. Each open defect, its scope and effect must be recorded and disclosed in the release; a defect violating a legal or security condition or mandatory criterion blocks release of that capability.
### 7.10. Reference Scenarios and Executable Criteria

These scenarios specify **product behavior**, not endpoint addresses or definitive JSON structure. Names and values are hypothetical. Their execution must be documented and recorded in the test system for that version.

#### Multi-Destination Trip and Optimization Scenario

Assume origin `A`, stop list `[B, C, D]`, and fixed final destination `D`. The following hypothetical matrix is in **minutes of route cost for the same profile and network**; these numbers are not real data or a traffic test:

| From / To | A | B | C | D |
|---|---:|---:|---:|---:|
| A | 0 | 6 | 2 | 6 |
| B | 6 | 0 | 4 | 2 |
| C | 2 | 4 | 0 | 6 |
| D | 6 | 2 | 6 | 0 |

1. With optimization off, the planned stop order is `A → B → C → D`, at a cost of `6 + 4 + 6 = 16` minutes. The result must have three legs and a mapping of input stops.
2. With optimization on, the time objective, and fixed start and end points, two orders are possible: the order above at cost 16 and `A → C → B → D` at cost `2 + 4 + 2 = 8`. For this small test, the reference result is the second order; the result claims proof of optimality only when the solver has actually proved it. This laboratory expectation does not guarantee a global optimum for every problem.
3. The geometric route may pass near or even through another stop on the way to the next stop; “each stop exactly once” refers to the planned stop list, not a prohibition on physical passage or repeated network edges. Recording actual arrival, if offered, requires independent rules and data.
4. Two destinations with identical coordinates but different identifiers must remain two distinct stops with separate mappings. If a destination or connection cannot be solved, a complete successful result is not produced. On optimizer failure, substitution with the original order without consumer consent is not permitted.

#### History and Request-Retry Scenario

- An authorized trip starts; two observations with separate idempotency identifiers and times `2026-01-01T10:00:00Z` and `2026-01-01T10:10:00Z` are sent and stored durably upon confirmation. An observation at 10:05 that arrives later is accepted or rejected under the declared late-data policy; if accepted, it is retrieved in the correct chronological position.
- Resending the same observation with the same key and identical content within the declared retry window must not create a new observation; using the same key with different content must report a conflict. The policy for expiration of the retry window and uncertainty during a connection interruption is documented.
- After the trip ends, no late sample may be added to its history, even if observed during the trip. After deletion or expiration, late data must not reconstruct the same trip. Read and write access for an unauthorized person is denied or securely concealed even if the trip identifier is known.
- After restart and tested backup restoration, confirmed data is inspectable within recovery objectives and deletion policy. No test alone guarantees zero risk of data loss in every failure.

#### Connection-Interruption Boundary Scenario

Assume that the last qualifying sample reached the service at 10:00 on day one and the inactivity threshold has not been met with valid data. At 10:00 on day two, the trip enters the waiting state; if the user does not confirm continuation before 10:00 on day three, the effective end time is 10:00 on day three, even if the scheduler runs later. A response or new sample at the exact second deadline is not accepted to continue the trip. If, for example, the user confirms continuation at 16:00 on day two and no qualifying sample subsequently arrives, the basis for the new deadline is 16:00 on day two; this confirmation does not prove movement. The times in this example are service-clock times and do not change the product decision about a configurable inactivity threshold.

#### Language, Unavailable Data and Security Scenario

- Requests for Persian and English messages for the same error must return the same code and equivalent explanations. The actual language of a place name, if known, must be distinct from the response-text language. For raster tiles, rather than claiming per-label metadata, state the naming and fallback policy at style or dataset level.
- If the source name's language is unknown, the same name text may be offered under the fallback policy but must not receive a guessed language tag. For an expression with no name in the requested language in the dataset, no result is not equivalent to failure of language support, and data coverage status must be inspectable.
- If disclosing the existence of a trip or entity is risky, the external response may be identical for “identifier does not exist” and “unauthorized access”; record the actual reason only in a secure report authorized for operations. This exception takes precedence over the requirement to semantically distinguish API errors.

### 7.11. Reliability, Errors and Integration

- **OPS-01 — Prerequisites and failure:** Each service documents its mandatory and optional data, engines, storage and external services, preparation and readiness-check methods, failure behavior and the party responsible for providing each item. A dependency on an external service differs from a mandatory dependency on other GeoCore services.
- **OPS-02 — Idempotent request:** For write and location-recording operations, specify duplicate detection, scope and validity duration of the idempotency key, concurrent-use behavior and conflict for different content. Give the consumer a way to identify an unknown result and retry safely. Reads and computations without side effects must be defined separately from create or modify operations.
- **OPS-03 — Data durability:** Separately determine and test the success-confirmation boundary, committed durability type, backup policy, recovery-time objectives and maximum data loss for defined failures. Durability after confirmation under normal conditions must not be assumed equivalent to a guarantee of no data loss in every disaster.
- **OPS-04 — Limits and cancellation:** Set and state limits on points, geometry size, matrix cells, concurrent requests, solve duration and request rate for each service and environment. Timeout, resource limits and dependency error are distinct from “problem infeasible.” If asynchronous processing is offered, document and test status, expiration, cancellation and result access; asynchronous operation is not mandatory.
- **OPS-05 — Data publication:** The data version used by a process or output must be identifiable; changing versions or cache must not present an inconsistent collection of data as successful. Document the behavior of in-flight requests, the previous version and rollback during data publication. In every combination of Routing, Matrix and optimizer, network version, profile, objective and effective time or traffic data must be compatible, or incompatibility must be reported and processing rejected.
- **OPS-06 — Secure observability:** Distinguish process health from readiness to respond with required data and dependencies. Collect request count, error, latency and freshness metrics at an appropriate level; precise coordinates, address text, keys, tokens and sensitive identifiers must not be disclosed by default in logs, traces, metric labels or monitoring tools [21].
- **Acceptance:** Check engine outage, cache expiration, network-version change, concurrent duplicate submission, load above limits, backup restoration and non-disclosure of sensitive data in logs against approved scenarios and thresholds.

### 7.12. Supplementary Security and Privacy Controls

- **SEC-01 — Object- and operation-level authorization:** Check each request's authorization for the consumer, role, operation and relevant object, including trips, points, entities, tiles, versions and proprietary data. An unguessable identifier is not a substitute for authorization. Reading, writing, deletion, sharing and management operations have independent permissions [20].
- **SEC-02 — Location misuse:** Nearby search must not predictably disclose information about unauthorized entities through repeated requests, pagination, counts, filters or response timing. Determine and test consumption limits, location-inference risk assessment, and minimum accuracy and freshness policies appropriate to the product; these controls do not guarantee prevention of every inference method.
- **SEC-03 — Input data and external sources:** Invalid input, oversized geometry, infected or incompatible files and untrusted external-source responses must be validated and limited. For capabilities that accept external source addresses, assess and mitigate risks of requests to internal networks and unsafe redirects. Implementation details belong in the security document.
- **SEC-04 — Retention and recovery:** Document retention start and end, deletion methods for primary data, derivatives, cache, logs and backups, restricted backup access, and prevention of unauthorized data return after restoration. Use of a pseudonymous identifier does not automatically anonymize personal data or place it outside the law.
- **SEC-05 — Incidents and changes:** Define vulnerability reporting, the person responsible for incident investigation, a secure update path, and dependency and configuration review. Open default administrative access or fixed sample passwords are not permitted in Production.
- **Acceptance:** Run and record tests for cross-access using another consumer's valid identifier, access to a forbidden feature, pagination or cache bypass, costly requests, unsafe input, authorization revocation and recovery after deletion.

### 7.13. Metric Definitions and Required Pre-Release Evidence

Target values are deliberately not set in this document. Each objective must be recorded with its approved value, source, sample, assessment period, environment and owner. The following definitions prevent reporting meaningless numbers:

| Area | Metric definition and minimum evidence | Open decision |
|---|---|---|
| Availability | Ratio of successful eligible requests to all eligible requests in a specified interval; consumer-side errors, maintenance and no-data states must be defined separately. | Target, window, exclusions and distinction between SLI/SLO and a contractual SLA. |
| Latency and capacity | Latency percentiles, including p95, by operation, result and language under specified load and concurrency; for asynchronous processing, waiting and execution times separately. | Target percentile, load and maximum input size. |
| Search and addresses | Query set with reference results, proportion retrieving relevant results at defined ranks, and spatial accuracy or address level; separately for `fa`, `en` and target regions. Queries without a valid answer are measured separately. | Sample count, labeling method and threshold for each group. |
| Routing and optimization | Percentage of valid routes on a reference network; cost ratio or difference relative to the reference for solvable samples, with the same objective and constraints. Infeasible or unfinished cases are reported separately. | Reference set, quality metric and solve time. |
| History and recovery | Percentage of confirmed valid samples accessible according to policy and after recovery; receipt delay, duplication rate and data lost under a defined failure scenario. | Durability, gap threshold, recovery time and maximum acceptable data loss. |
| Language and documentation | Completion of the message-key inventory and documentation for each version in two languages; parameter equivalence, passing executable examples and review of mixed text and map labels. | Glossary, approver and test display environments. |
| Data | Coverage, freshness and error percentages based on the reference dataset definition and observation time; unavailable values are not replaced with zero. | Scope, reference source, frequency and minimum quality. |

**Release evidence package:** List of enabled capabilities and supported environments; API version and documentation in both languages; data sheets and licenses; functional, security, language and recovery test results; objectives and measurement results; open defects and known limitations; and product-owner and technical-owner approval. This package is prepared for the actual version; the existence of this document does not mean the package is ready.

### 7.14. Technical Basis and Validation for Stop Detection

- **MOVE-01:** GPS coordinates are estimates, and a small change between two samples is not by itself evidence of movement. The system must use consecutive samples, horizontal accuracy, observation time and, where available, valid motion data; a single jump or data with unknown accuracy must not by itself establish movement conclusively.
- **MOVE-02:** The W3C web standard describes accuracy as a radius in meters with a recommended 95% confidence level [24]; Android specifies 68% for `getAccuracy` [25]. These values are not directly equivalent. Preserve source and confidence level when available; conversion without a valid model and assumptions, or when confidence level is unknown, is not permitted.
- **MOVE-03:** The reviewed sources do not establish a universal fixed radius for all devices and stop-detection applications. An internal radius or criterion must be selected based on uncertainty and actual testing, not by the user or organization. Limitations related to outliers, boundary jitter, slow movement, changing accuracy, time gaps and data delay must be documented. With insufficient data, the result is “unknown,” not necessarily movement or inactivity.
- **MOVE-04:** Before release, test the method with labeled reference data for movement, stopping, long stops, indoor and urban environments, weak signal, data interruption, different devices and target travel modes. Measure rates of false movement detection while stopped, missed movement, unknown status and erroneous trip endings. Approve acceptance thresholds and environmental limitations after testing; retain raw data under the retention policy and keep it distinct from processed output.
## 8. Prioritization Guidance and Release Gate

### 8.1. Recorded Product-Owner Decisions

| Topic | Recorded decision | Effect and limitation |
|---|---|---|
| Initial scope | Iran | Areas and quality within Iran must be measured with actual data; naming the country does not mean complete coverage or accurate coverage of every address. |
| Documentation and order | All 13 services are to be documented; implementation may proceed incrementally, one by one. | Documentation of all services covers the target scope; their release plan and timing have not been determined. |
| Starting order | Vector Map Tile first; then multi-destination Routing for car, pedestrian and bicycle. | Public transport and taxis if feasible with suitable data; timing and ordering of other services remain unspecified. Routing can independently obtain its own licensed network. |
| Initial data | OpenStreetMap for all of Iran; weekly checks by default and configurable | Periodic checks do not mean successful publication or changes every week. Source, quality, attribution and public-service policies must be observed. |
| Default language | English | Both Persian and English are mandatory. Explicit selection and acceptable user preference under I18N-01 take precedence over the default. |
| Deployment model | Self-hosted and hosted service | Both are in product scope; simultaneous release, cost and operational responsibility have not yet been specified. Service independence remains in force. |
| Trip optimization | Minimum estimated time, with fixed or free final-destination mode selected for each optimization request | Optimization is optional; it does not run without a final-destination mode selection. Traffic is considered only with suitable data. |
| Organizational history policy | Duration is configurable per organization; without a setting, history is available to authorized persons for up to seven days after trip end. Duration changes apply only to new trips. | Automatic recording only with legal and authorization prerequisites; history is not editable after the end. Authorized deletion and legal obligations are exceptions, and live-sharing duration is independent. |
| Live sharing | Time-limited and without an end time; recipient is an authorized account or guest-link holder; link password is optional. | Off by default and revocable; reminders are configurable and off by default. Sharing, history and Nearby have independent permissions. |
| Background and Internet | Web, Android and iOS are target environments; background acquisition is mandatory in compatible and authorized environments; outage buffering is optional for the application or organization. | Actual capability is subject to authorization and operating-system restrictions. Local data is not added to closed history after the end, and unaccepted local points are deleted at the first opportunity. |
| Local data after trip end | Unaccepted local points of an ended trip are deleted after the end is established, at the first opportunity for the app to run and access local data. | Inform the user of known incompleteness; deletion does not wait for message acknowledgment. Silent transfer, independent use and addition to closed history are not permitted; immediate deletion cannot be guaranteed on a powered-off device or when execution is unavailable. |
| Ending an abandoned trip | Valid inactivity of 24 hours ends recording by default; the inactivity threshold is configurable by the organization. | Detection radius is automatic, and incomplete data is not assumed to mean inactivity. |
| Location interruption | After 24 hours without a fresh valid location, ask whether to continue the trip; after another 24 hours without response, end recording. | In the waiting state the cause is unknown; the 48 hours are counted from the last qualifying sample or trip start if there is none. Confirming continuation resets the basis of the new deadline; this ending does not prove an actual stop and does not automatically stop live sharing. |
| Performance and availability | Set targets after building and testing the first service in a specified environment | Objectives and measurement methods are approved before each service is released; no hypothetical number or SLA is set. |

### 8.2. Decision and Release Path

Other than the priority of vector tiles followed by routing, this document does not establish complete phasing, a budget or a time commitment:

1. **Define the initial scenario:** Iran and the vector tile service are the starting point; determine actual data coverage, target consumer and evaluation scenarios. Retain mandatory multi-destination trips, optional order optimization and route history capabilities in the product plan and explicitly approve their release timing.
2. **Assess feasibility:** Examine data prerequisites, quality and coverage, licensing, costs, operational resources and technology compatibility for each capability. Live traffic, logistics optimization and full navigation may require additional data and components.
3. **Approve criteria:** Approve numerical targets and reference sample sets for quality, speed, availability, security and recovery; specify contractual commitments separately.
4. **Release readiness:** Execute relevant Section 3 and 7 criteria; approve version-aligned Persian and English documentation, coverage of generated text in both languages, data provenance and license, security and privacy assessment, approved numerical objectives, limitations and operational owner.
5. **Decision:** A capability lacking sufficient data, licensing, quality or testing must not be released with a claim of readiness. Removing or temporarily disabling it in a version does not remove the product need. An approved limitation is permitted only when it does not violate that version's declared requirements; legal and security conditions cannot be waived by labeling a capability experimental.

## 9. Open Decisions for the Product Owner

| Topic | Decision needed before commitment |
|---|---|
| Market and coverage | Iran is the initial region; what are the actual coverage quality across Iran, customers and primary scenario? Regional language variants also need a decision. |
| Language and documentation | English is the default; what are the glossary, regional variants and parties responsible for Persian and English review? Section 7.5 requirements are not conditional on these decisions. |
| Release plan | Routing has priority after vector tiles; when will it be released and what are the order and timing of other services? All services will be documented. |
| Data | OSM is the initial base source and weekly checks are the configurable default; how will quality, extraction of all Iran, processing cost and licensed elevation and traffic sources be provided? |
| Environment and independence | Both self-hosted and hosted models are in scope; what are the release timing of each, SDK environments, permitted prerequisites and data-provision method for each service? |
| Quality and operations | After initial testing, what are the target values, measurement method, environment, load volume and recovery objectives for each service? |
| Security and law | What are the consumer and role model, legal jurisdictions, legal basis for processing, retention and data deletion? |
| Trips and logistics | Car, pedestrian and bicycle profiles, time optimization and fixed and free final-destination modes are decided; what are the destination limit, return to origin, solver and quality criterion? Feasibility and data for buses, BRT, metro and taxis must be assessed separately. |
| Trip history | The seven-day retention policy, automatic ending, immutability of ended trips and optional buffering are specified. The automatic movement-detection method and acceptable sample spacing, reference tests, physical server and backup deletion, late-data policy for an open trip, reliable detection of ending after history expiration, access-loss behavior and contract details for reporting an unknown recording result must be determined before release; deletion of unaccepted local points from an ended trip has been decided under DEVICE-05. |
| Client and background | Web, Android and iOS are targets; supported versions, client integration methods and actual feasibility and limitations of background acquisition and buffering on each must be specified before release. |
| Live sharing | Authorized account and guest link with optional password, two duration modes and configurable reminders off by default are specified. What are the release date, time-limited duration cap, possibility of cross-organization accounts, accuracy, freshness threshold, rate, latency and access-report retention period? Numerical latency claims are not permitted until testing and approval. |
| Offline and changes | What are the package format, limits of use and effects of proprietary changes on display, search and routing? |
| Ownership and support | Who owns the product and operations, and what are the version, support and issue-handling policies? |

## 10. Criteria for Adding a New Service

Before defining an independent service, assess and record distinct responsibility, data lifecycle, consumers, operational and security needs, ability to use independently, deployment and maintenance costs, and the actual benefit of separation. Also compare the option of offering it in an existing service. The decision must clarify responsibility boundaries and mandatory and optional dependencies; independence alone is not the goal.

## 11. References and Basis of Review

The following sources form the basis for reviewing standards, tool limitations and licenses; citing them does not claim product compliance. Policies, tool documentation and laws must be rechecked at implementation time for the relevant version and jurisdiction.

1. [RFC 7946 — GeoJSON](https://www.rfc-editor.org/rfc/rfc7946) — Coordinates, axis order and format limitations.
2. [OGC API — Features](https://www.ogc.org/standards/ogcapi-features/) and [OGC API — Tiles](https://www.ogc.org/standards/ogcapi-tiles/) — Standards for access to features and tiles; conformance depends on selected parts and tests.
3. [OSM Foundation — Licence and Legal FAQ](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ) — Attribution, ODbL and share-alike considerations.
4. [OSM Foundation — Geocoding Guideline](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline) — Output and derivative-database considerations in Geocoding.
5. [OSM Foundation — Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) — Public-service restrictions and permitted uses; not equivalent to unlimited product-use permission.
6. [OSM Foundation — Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) — Usage policy for the public OSM tile server.
7. [GDPR text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj) — Particularly processing principles, legal bases and data protection by default, where applicable.
8. [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/) and [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) — Styling and web map display.
9. [OSRM HTTP API](https://project-osrm.org/docs/v5.24.0/api/) — Routing, matrix, matching and Trip limitations; capabilities of the selected version must be checked separately.
10. [Valhalla API](https://valhalla.github.io/valhalla/api/) and [Valhalla matrix](https://valhalla.github.io/valhalla/api/matrix/) — Documented engine capabilities and limitations.
11. [Valhalla — Speed and traffic information](https://valhalla.github.io/valhalla/speeds/) — Distinction among base, historical and live speed data and need for suitable data.
12. [OSM Wiki — highway=speed_camera](https://wiki.openstreetmap.org/wiki/Tag:highway%3Dspeed_camera) — Speed-camera feature tag; different from general speed-limit data.
13. [OpenAPI Specification](https://spec.openapis.org/oas/) — Standard description of an API contract.
14. [Valhalla — Optimized Route](https://valhalla.github.io/valhalla/api/optimized/) — Example of order optimization, fixed start and end points and mapping to input order; selected-engine capability must be tested independently.
15. [BCP 47 — RFC 5646](https://www.rfc-editor.org/rfc/rfc5646) and [RFC 4647](https://www.rfc-editor.org/rfc/rfc4647) — Language tagging and matching.
16. [Unicode CLDR — Persian](https://cldr.unicode.org/translation/language-specific/persian) — Persian characters and localization considerations; product search-equivalence rules must be separately designed and tested.
17. [W3C — Text direction in HTML](https://www.w3.org/International/questions/qa-html-dir.html) and [inline bidirectional text](https://www.w3.org/International/articles/inline-bidi-markup/bidi_examples.html) — Base direction and isolation of mixed text.
18. [OpenStreetMap Wiki — Names](https://wiki.openstreetmap.org/wiki/Names) — Default names, language-tagged names and distinction between international and English names.
19. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) and [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — Language negotiation, Vary and caching rules.
20. [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) — Object-level authorization, resource consumption and external-source risks.
21. [OpenTelemetry — Handling sensitive data](https://opentelemetry.io/docs/security/handling-sensitive-data/) — Minimization of sensitive observability data.
22. [RFC 3339 — Timestamps](https://www.rfc-editor.org/rfc/rfc3339.html) and [RFC 9557](https://www.rfc-editor.org/rfc/rfc9557.html) — Time format and updates to offset semantics; exact format selection is determined in each service's contract.
23. [EDPB — Guidelines 01/2020](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-012020-processing-personal-data-context_en) — Location-data considerations in connected vehicles and mobility-related applications; legal applicability depends on jurisdiction and scenario.
24. [W3C Geolocation](https://www.w3.org/TR/2025/REC-geolocation-20251029/) — Meaning of coordinate accuracy in the web API; recommended 95% confidence level.
25. [Android Location](https://developer.android.com/reference/android/location/Location.html) — Horizontal `getAccuracy` and 68% confidence level.
26. [OWASP — Information exposure through URL query strings](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) — Risk of disclosing confidential data in logs, history and referrers.
27. [Android — Location foreground service](https://developer.android.com/develop/background-work/services/fgs/service-types) — Background location and service-execution requirements and restrictions.
28. [Apple — Location authorization](https://developer.apple.com/videos/play/wwdc2024/10212/) — Permissions and limitations for location acquisition in background, suspended and terminated application states.
29. [GTFS Schedule and Realtime — Overview](https://gtfs.org/documentation/overview/) — Distinction between schedules, real-time data and public-transport network alerts.

## 12. Summary of Corrections and Revision History

**Revision 1.12 compared with 1.11:**
- The ambiguity of “extending the inactivity count” was corrected: GPS noise must not mistakenly reset the inactivity count, but a duplicate sample is not fresh evidence either.
- The need for sufficient data and acceptable spacing between samples to establish inactivity was clarified; late evidence and threshold evaluation must not conflict with confirmed recordings or the immutability of a closed trip.
- The deadline basis after continuation confirmation was clarified in the main text, and a boundary timing scenario was added. These implementation details are document proposals, not new decisions attributed to the product owner.
- The need to reliably detect ending after history expiration and the ambiguity of behavior when access is lost were recorded; an access error or lack of response alone is not treated as trip end.

**Revision 1.11 compared with 1.10:**
- According to the product owner's decision, unaccepted local points are deleted at the first opportunity after trip end is established; actual device execution limitations, notification and prevention of data transfer were clarified.
- Precedence of automatic ending at the time boundary, races between ending and recording, and delayed scheduler behavior were clarified in HIST-10; confirmation of continuation is the basis for the next no-data deadline, not proof of movement.
- The ambiguity between resuming an active share and reactivating an ended share was resolved, and deletion and time-boundary tests were added.

**Revision 1.10 compared with 1.9:**
- Car, pedestrian and bicycle became mandatory for the first routing release; public transport and taxis were described as conditional on data and technical feasibility.
- Web, Android and iOS were recorded as target environments, while preserving actual authorization and background limitations.
- The ended-history rule was revised: no late point or correction, even one relating to before the end, is added. Exceptions for authorized deletion and access control and local-data behavior were clarified.

**Revision 1.9 compared with 1.8:**
- Routing was set as the implementation priority after vector tiles.
- Background location support in compatible environments with required permission and optional buffering during Internet interruptions were specified along with synchronization, security and testing.
- The potential conflict between late-data transmission and stopping after a long outage, automatic trip reopening, and publication of stale data as live location was addressed.

**Revision 1.8 compared with 1.7:**
- A quick guide, separation of confirmed decisions from open items, and explicit explanations of history, sharing and trips were added.
- All of Iran, configurable weekly updates and a guest link with an optional password were recorded; reminders for indefinite sharing are configurable and off by default.
- The earlier “every new location means activity” rule was corrected: automatic distinction of GPS jitter from movement, separation of missing data from stopping, and a confirmation window after disconnection were defined.
- Web and Android accuracy standards were reviewed and their confidence-level difference recorded; no unsupported universal fixed radius was set.

**Revision 1.7 compared with 1.6:**
- Live location sharing for a specified duration and without an end time was defined with explicit selection, recipient control, the ability to stop, status, security and acceptance criteria.
- Independence of live-sharing authorization from trip history and nearby search, disconnection and expiration behavior, and limits on control over delivered data were clarified.
- Test criteria and open decisions for this capability were added; no-end-time mode does not mean unlimited information storage.

**Revision 1.6 compared with 1.5:**
- Product-owner decisions on Iran, documentation of all services, starting with vector tiles, OSM data, default English and two deployment models were recorded.
- Estimated time was recorded as the required optimization objective, and explicit selection of fixed or free destination mode replaced the fixed default; tests for both modes were added. Other objectives may be added later.
- History was specified with an automatic temporary seven-day policy after trip end and organizational configurability; automatic ending with a default of 24 hours of inactivity and application of duration changes only to new trips were added. Authorization and legal-basis requirements and open deletion decisions were refined.
- Numerical targets were deferred until practical testing; the open-decision list was revised to reflect the choices.

**Revision 1.5 compared with 1.4:**
- Contradictions involving error distinction and prevention of disclosure of data existence, unknown coverage, fallback names in raster tiles and service independence were resolved.
- The meaning of “visit once” was separated from physical passage, and a verifiable numerical multi-destination example and a history and retry scenario were added.
- Idempotency scope, late data, durability, recovery objectives, network-version compatibility and processing status were clarified.
- Operational requirements, object-level security, prevention of location leakage, metric definitions and the release evidence package were completed.
- The public Nominatim service's autocomplete restriction and the public tile server's offline policy were explicitly added with references.

**Revision 1.4 compared with 1.3:**
- Persian and English support became mandatory for all product-generated text and documentation of each version; language selection, source text, untranslated names, right-to-left behavior and tests were refined.
- Error and output behavior, units, freshness, cache, unavailable data and data version were clarified, and supplementary requirements and tests were developed for each service group.
- Understandable examples, a method for determining numerical criteria and release evidence were added; timing, geographic coverage and target values remain open decisions.

**Revision 1.3 compared with 1.2:**
- Planned trip, observed history, duplicate destination and leg were defined; detection of all gaps or the exact reality between samples is not guaranteed.
- Default-off optimization and that version's final-destination default, one-to-one preservation of destinations, failure status, cost metric and reference-example testing were clarified; the final-destination rule was replaced with explicit selection in version 1.6.
- Responsibility boundaries between Routing and the optimizer and deployment independence were clarified. Trip recording, paginated retrieval, times, duplication and data delay, confirmation durability and deletion after backup restoration were refined.
- The GeoJSON elevation definition was corrected under RFC 7946; the public OSM service usage rule changed from an inaccurate general prohibition to reviewing policy and suitability for the application.
- The release gate and open decisions were clarified; numerical targets and release timing still require approval.

**Earlier corrections compared with the original document:**
- In version 1.2, multi-destination trips preserving input order with explicit optimization selection were added, along with recording and retrieval of actual trip history, with specified requirements and tests.
- Service independence was distinguished from freedom from infrastructure and data needs; optional dependencies and degraded behavior were clarified.
- Boundaries between overlapping services, including search and Geocoding, proximity and Geofencing, and route-graph display and modification, were specified.
- Live traffic, logistics problem solving, offline capabilities and navigation were made conditional on data, engine and release decisions; claims of optimality and certainty were limited.
- Coordinate and unit, data quality and provenance, OSM licensing, privacy, security, operations, testing and acceptance requirements were added; unknown numerical targets were not fabricated.
- The speed-camera reference was corrected and primary references for licensing, public-service policies, GDPR, GeoJSON and engine limitations were added.

---

**Final status:** This version is a basis for review and decision-making; until the open items are approved, it does not represent implemented capabilities or a GeoCore commercial commitment.
