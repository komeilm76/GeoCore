# Legal, privacy and license review register

**State:** Review checklist only; not legal advice, a legal opinion, a license grant, or a finding that any law applies. GeoCore currently has no released service or acquired dataset. Obtain qualified legal/privacy review for each deployment, customer, data source and jurisdiction before production processing or publication.

## Applicability assessment (release blocker)

The product owner has set Iran as the initial focus for legal/privacy review, with other jurisdictions assessed if applicable. Until a qualified, scenario-specific legal and privacy review is completed, do not process real people's location data; use authorized test data. This is a release gate, not a legal conclusion about which Iranian rules apply.

For each service and hosting model, record the accountable entity and roles, affected people, purposes, data categories, user and data-subject locations, hosting and support locations, subprocessors, data flows, retention/deletion, transfer/access locations and likely jurisdictions. Specifically assess:

- Whether GDPR or other European/EEA obligations apply to the controller/processor and actual processing; assess lawful basis, transparency, rights, contracts, security, DPIA need and international transfers where applicable.
- Which Iranian privacy, cybersecurity, telecommunications, mapping/geospatial, consumer and data-localization rules apply to the intended data and deployment. Have qualified local counsel confirm applicability and obligations; this repository does not make that determination.
- Cross-border operation, sanctions/export-control, payment/hosting/provider availability and contract constraints relevant to serving the intended customers and territory. Obtain specialist review where applicable; do not infer permission or prohibition from this checklist.
- Any additional jurisdiction triggered by the operator, customer, end user, hosting, data source or onward disclosure.

Document `in scope`, `not in scope (with rationale)`, or `unresolved`; unresolved material applicability blocks the affected production release.

## Data and software rights

For every base, derived, reference and user-supplied dataset, retain the exact source, license/version, acquisition date/method, permitted purpose, redistribution, attribution, database/derivative obligations, combination analysis, retention/deletion and owner. Assess OpenStreetMap ODbL and public-service usage policies separately; using an API or tile endpoint does not automatically license all downstream use. Obtain counsel review for ambiguous derivative database, output, combination, hosted/self-hosted or offline-package questions. Keep software dependency licenses/SBOM and notices alongside release evidence.

## Personal location and user rights

Before location history, live sharing or proximity processing: document purpose, data controller/processor allocation, legal basis, notices, recipient scope, accuracy/minimization, retention, deletion, access and portability/correction where applicable, handling of withdrawal/objection, complaint path and breach response. Consent is not assumed to be the only or always appropriate legal basis. Sharing without an end time is not unlimited retention or blanket consent. Assess whether a DPIA or other prior consultation is required.

## Approval record (complete per release)

| Field | Required record |
|---|---|
| Service/version and deployment | Exact scope, hosting model and supported region |
| Data/software sources | Inventory, license versions, attribution and assessed use |
| Jurisdictions/applicability | Counsel-reviewed determination, open questions and rationale |
| Personal-data roles and purpose | Accountable entities, purposes, lawful basis and notice |
| Transfers/subprocessors | Parties, locations, safeguards and approval where applicable |
| Retention/deletion | Primary, derivative, logs, cache, backup and restore behavior |
| Reviewer/approval | Named accountable product, security/privacy and legal reviewers; date and evidence |
| Conditions | Limitations, customer obligations, follow-up owner and review trigger |

Trace to `REQ-D5`–`REQ-D6`, `REQ-P2`–`REQ-P5`, `HIST-05`–`HIST-10`, `SHARE-01`–`SHARE-13`, `SEC-03`–`SEC-05` and each applicable dataset sheet. Reassess when data, purpose, jurisdiction, hosting, recipients or product behavior changes.
