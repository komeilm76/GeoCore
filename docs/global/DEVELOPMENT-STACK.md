# Development stack baseline

**State:** The project owner has directed this baseline for GeoCore application code and APIs. This documents a technology direction; it is not evidence that any GeoCore service or API has been implemented or released. Tool versions and dependency integrations must be pinned and reviewed in each working package before use.

## Required defaults

- **Runtime and package manager:** Bun for TypeScript application code, scripts, dependency installation and lockfiles. Use the checked-in `bun.lock` and frozen installs in CI. Do not add JavaScript application or spike source; write code and tests in TypeScript. Python documentation tooling is outside this application-code rule.
- **Language:** TypeScript with `strict` enabled for application, spike, and test code. Keep compiler checks in the package validation workflow.
- **Tests:** Vitest for all project test files, written in TypeScript with the `*.test.ts` suffix and run with Bun as the runtime. Current packages invoke Vitest through Bun with the thread pool (`--pool=threads`) and include a runtime-guard test. Do not substitute Node's built-in test runner for project tests; recheck this command/pool when upgrading Bun or Vitest.
- **HTTP APIs:** Fastify is the required framework for GeoCore HTTP API implementations. No API contract, endpoint, or service implementation is created by this baseline.
- **Validation and types:** Zod is the required schema library for API input/output validation and TypeScript type inference. Parse untrusted data at boundaries; avoid defining a separate handwritten type that can drift from its validation schema.

## Integration and safety rules

- Validate the Bun + Fastify + Zod combination with a small, isolated compatibility example before establishing a reusable API template. Choose any Fastify/Zod type-provider or adapter only after checking maintenance, runtime compatibility, typing, security advisories, and licenses; this document does not select an adapter or versions.
- Derive types from the same Zod schemas used for runtime validation. Ensure Fastify's request/response typing agrees with actual runtime validation; compile-time types alone do not validate network input.
- Keep API contracts, authentication/authorization, tenant boundaries, error semantics, resource limits, deployment model and data handling in reviewed service-specific specifications. Fastify and Zod do not settle those decisions.
- Keep GeoCore services independently usable; use external engines/data/infrastructure only as explicit documented prerequisites.
- Pin dependencies in the Bun lockfile, review direct and transitive licenses and security advisories, and rerun checks when dependencies change. An audit result is time-bound, not legal approval or a future security guarantee.

## Current repository state

The tile-matrix and synthetic MVT spikes have been migrated from JavaScript/Node's built-in test runner to strict TypeScript and Vitest under Bun. A separate compatibility spike also passes a strict TypeScript check and five Vitest tests using Fastify 5, Zod 4 and the candidate `fastify-type-provider-zod` integration under Bun. The candidate adapter is not approved for production. No GeoCore API or service is implemented; service contracts and production readiness remain open.
