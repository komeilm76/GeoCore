# Fastify + Zod compatibility spike

**State:** Isolated, non-production compatibility test for the owner-directed development stack. It does not define a GeoCore endpoint or select an API contract, authentication policy, deployment model, or production adapter.

## Question and method

Does a minimal Fastify 5 API run under Bun with strict TypeScript and Vitest, while the same Zod schemas provide runtime request/response validation and inferred handler types?

The sample uses `fastify-type-provider-zod` as a candidate integration. Vitest uses Fastify's in-process `inject` facility; it does not bind a network port or use personal, OSM, or production data. Tests check a valid request, schema-invalid requests, a wrong runtime field type and rejection of a response payload that violates its Zod schema. TypeScript checks that the route handler receives the Zod-inferred request type.

## Run

Bun 1.4.5, TypeScript 7.0.2 and Vitest 5.1.1 are pinned in the package manifest/lockfile alongside Fastify 5.12.8, `fastify-type-provider-zod` 7.0.0 and Zod 4.6.7:

```sh
bun install --frozen-lockfile
bun run check
bun run audit
```

## Observed result

The strict TypeScript check passes and all five Vitest tests pass under Bun 1.4.5. Invalid request payloads return HTTP 400 in the sample; valid input reaches a handler whose input type is inferred from the Zod schema. Bun audit reported no known vulnerabilities for the locked production dependency tree at the time of the run.

The direct API-stack packages declare MIT licenses. The Bun lockfile pins resolved versions and integrity data but is not a complete license inventory. This result is not legal approval, a full dependency-license review, a future vulnerability guarantee, or proof that the candidate adapter is suitable for production.

## Not tested / not selected

No server listener/network behavior, authentication or authorization, organization/tenant isolation, request limits, rate limiting, error contract, API versioning, OpenAPI output, production deployment, logging/redaction, load, failure recovery or service interoperability is evaluated. No adapter is approved for production. Review supported Fastify/Zod versions, maintenance, security and licensing again before adopting the integration for a real service.
