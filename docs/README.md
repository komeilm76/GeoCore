# GeoCore Documentation / مستندات GeoCore

This documentation organizes the product requirements into global governance and service-level operating manuals. English and Persian documents are maintained together. **Status is explicit:** `proposed` is not an approved decision; `planned` is not implemented; `released` requires evidence and approval.

این مستندات الزامات محصول را در اسناد حاکمیتی و راهنماهای عملیاتی هر سرویس سازمان‌دهی می‌کند. اسناد انگلیسی و فارسی باید هم‌زمان نگهداری شوند. **وضعیت‌ها صریح‌اند:** «پیشنهادی» تصمیم مصوب نیست؛ «برنامه‌ریزی‌شده» به معنی پیاده‌سازی نیست؛ «منتشرشده» نیازمند شواهد و تأیید است.

## Global docs / اسناد سراسری

English and Persian drafts are paired below. Persian translations are working drafts and still require human/technical review; they are not independently approved product requirements.

| Topic | English | فارسی |
|---|---|---|
| Governance / حاکمیت | [Governance](global/GOVERNANCE.md) | [حاکمیت](global/GOVERNANCE.fa.md) |
| Architecture / معماری | [Proposed architecture](global/ARCHITECTURE.md) | [معماری پیشنهادی](global/ARCHITECTURE.fa.md) |
| Development stack / پشته توسعه | [Bun, TypeScript, Vitest, Fastify and Zod baseline](global/DEVELOPMENT-STACK.md) | [مبنای Bun، TypeScript، Vitest، Fastify و Zod](global/DEVELOPMENT-STACK.fa.md) |
| Security / امنیت | [Security baseline](global/SECURITY.md) | [مبانی امنیت](global/SECURITY.fa.md) |
| Data / داده | [Data governance](global/DATA-GOVERNANCE.md) | [حاکمیت داده](global/DATA-GOVERNANCE.fa.md) |
| Quality / کیفیت | [Quality and release gates](global/QUALITY-AND-RELEASE.md) | [کیفیت و دروازه انتشار](global/QUALITY-AND-RELEASE.fa.md) |
| Roadmap / نقشه راه | [Roadmap](global/ROADMAP.md) | [نقشه راه](global/ROADMAP.fa.md) |
| Traceability / ردیابی | [Requirements traceability](global/REQUIREMENTS-TRACEABILITY.md) | [ردیابی الزامات](global/REQUIREMENTS-TRACEABILITY.fa.md) |
| Legal / حقوقی | [Legal, privacy and license review](global/LEGAL-AND-LICENSE-REVIEW.md) | [بازبینی حقوقی و مجوز](global/LEGAL-AND-LICENSE-REVIEW.fa.md) |
| Decisions / تصمیم‌ها | [Open decisions](global/OPEN-DECISIONS.md) | [تصمیم‌ها و موارد باز](global/OPEN-DECISIONS.fa.md) |
| Scope revision / بازنگری دامنه | [Revision plan](global/SCOPE-REVISION-PLAN.md) | [برنامه بازنگری](global/SCOPE-REVISION-PLAN.fa.md) |
| Implementation readiness / آمادگی پیاده‌سازی | [Readiness and work packages](global/IMPLEMENTATION-READINESS.md) | [آمادگی و بسته‌های کاری](global/IMPLEMENTATION-READINESS.fa.md) |
| Internationalization / زبان | [I18N](global/I18N.md) | [بین‌المللی‌سازی](global/I18N.fa.md) |
| Service documentation / مستندات سرویس | [Template](global/SERVICE-DOCUMENTATION-TEMPLATE.md) | [الگو](global/SERVICE-DOCUMENTATION-TEMPLATE.fa.md) |
| ADR / تصمیم فنی | [ADR process](global/ADRS.md) | [فرایند ADR](global/ADRS.fa.md) |
| Glossary / واژه‌نامه | [Glossary](global/GLOSSARY.md) | [واژه‌نامه](global/GLOSSARY.fa.md) |

Additional Persian records: [owner-provided decision record](global/PRODUCT-DECISIONS-AND-AGREEMENTS.fa.md) and the [simple, standalone Persian decision guide](global/OPEN-DECISIONS-SIMPLE.fa.md). The current technical proposal, **not yet accepted**, is [ADR-0001: vector-tile delivery evaluation](decisions/0001-vector-tile-delivery-contract.md) · [ترجمه فارسی](decisions/0001-vector-tile-delivery-contract.fa.md).

## Experimental spikes / نمونه‌سازی‌های آزمایشی

- [Tile-matrix indexing spike (EN)](../spikes/tile-matrix/README.md) · [فارسی](../spikes/tile-matrix/README.fa.md): non-production matrix arithmetic (no third-party runtime dependency; tests use the standard pinned Bun/Vitest toolchain).
- [MVT encode/decode spike (EN)](../spikes/mvt-encoding/README.md) · [فارسی](../spikes/mvt-encoding/README.fa.md): isolated synthetic payload candidate test; uses pinned spike-only dependencies and does not select a product contract.
- [Fastify + Zod compatibility spike (EN)](../spikes/api-stack-compat/README.md) · [فارسی](../spikes/api-stack-compat/README.fa.md): checks the owner-directed API tooling combination in process only; not a GeoCore endpoint or approved production adapter.

The spikes use strict TypeScript, Bun 1.4.5 and Vitest 5.1.1. In each spike directory run `bun install --frozen-lockfile` and `bun run check`. In packages with an `audit` script, also run `bun run audit`; check each package's README to see whether the command audits production-only or all locked dependencies. The committed Bun lockfiles are authoritative; these experiments are not production services.

## Service manuals / راهنماهای سرویس

Each service folder contains an English and a Persian guide. The guides describe intended behavior and safe operational usage. Until a service has a reviewed API specification and an implementation, they deliberately do not invent endpoints, commands, credentials, or supported deployments.

هر پوشه سرویس شامل راهنمای انگلیسی و فارسی است. راهنماها رفتار هدف و استفاده عملیاتی امن را شرح می‌دهند. تا پیش از وجود مشخصات API بازبینی‌شده و پیاده‌سازی، endpoint، فرمان، اعتبارنامه یا روش استقرار ساختگی ارائه نمی‌شود.

| Service | English | فارسی | Delivery state |
|---|---|---|---|
| Map Tile Service | [Guide](services/map-tiles/user-guide.en.md) | [راهنما](services/map-tiles/user-guide.fa.md) | First priority; not implemented |
| Geocoding | [Guide](services/geocoding/user-guide.en.md) | [راهنما](services/geocoding/user-guide.fa.md) | Planned; not implemented |
| Map Search | [Guide](services/map-search/user-guide.en.md) | [راهنما](services/map-search/user-guide.fa.md) | Planned; not implemented |
| Routing | [Guide](services/routing/user-guide.en.md) | [راهنما](services/routing/user-guide.fa.md) | Next priority; not implemented |
| Route Matrix & Optimization | [Guide](services/route-matrix/user-guide.en.md) | [راهنما](services/route-matrix/user-guide.fa.md) | Planned; not implemented |
| Map Matching | [Guide](services/map-matching/user-guide.en.md) | [راهنما](services/map-matching/user-guide.fa.md) | Planned; not implemented |
| Elevation & Terrain | [Guide](services/elevation/user-guide.en.md) | [راهنما](services/elevation/user-guide.fa.md) | Planned; not implemented |
| Spatial Analysis & Geofencing | [Guide](services/spatial-analysis/user-guide.en.md) | [راهنما](services/spatial-analysis/user-guide.fa.md) | Planned; not implemented |
| Location Tracking & ETA | [Guide](services/location-tracking/user-guide.en.md) | [راهنما](services/location-tracking/user-guide.fa.md) | Planned; not implemented |
| Map Data Management | [Guide](services/data-management/user-guide.en.md) | [راهنما](services/data-management/user-guide.fa.md) | Planned; not implemented |
| Proximity & Nearby Entities | [Guide](services/proximity/user-guide.en.md) | [راهنما](services/proximity/user-guide.fa.md) | Planned; not implemented |
| Traffic | [Guide](services/traffic/user-guide.en.md) | [راهنما](services/traffic/user-guide.fa.md) | Planned; not implemented |
| Map Customization | [Guide](services/map-customization/user-guide.en.md) | [راهنما](services/map-customization/user-guide.fa.md) | Planned; not implemented |

For every service, use its guide alongside the product scope. Service-specific, approved API/operations documents will be added under the same folder before release. See [governance](global/GOVERNANCE.md) for change control and precedence. Run the dependency-free documentation checks with `python3 scripts/check_docs.py` and `python3 -m unittest discover -s tests`; these validate document structure and links, not product behavior or translation quality. The same checks run in [GitHub Actions](../.github/workflows/docs.yml).
